from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from spam_filter import spam_filter

# Load environment variables from .env file
load_dotenv()

# Database connection function using environment variables
def get_pg_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME", "defaultdb"),
        user=os.getenv("DB_USER", "avnadmin"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        sslmode=os.getenv("DB_SSLMODE", "require")
    )

app = FastAPI(title="Articles API", description="API for filtering articles", version="1.0.0")
# Configure CORS from environment variables
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Articles API is running"}

@app.post("/sources/manual", response_model=dict)
async def create_manual_source(request: dict):
    """
    Create a manual source entry with spam filtering
    """
    try:
        # Extract required fields for spam filtering
        title = request.get("title", "")
        description = request.get("description", "")
        url = request.get("url", "")
        
        # Perform spam filtering
        spam_analysis = spam_filter.get_spam_analysis(title, description, url)
        initial_status = spam_analysis["status"]  # 'junk' if spam, 'pending' if legitimate
        
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Create sources table if it doesn't exist, including status column
        cur.execute("""
            CREATE TABLE IF NOT EXISTS sources (
                id SERIAL PRIMARY KEY,
                title TEXT,
                url TEXT,
                severity TEXT,
                description TEXT,
                date DATE,
                country TEXT[],
                category TEXT,
                manual BOOLEAN,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Add status column if it doesn't exist (for existing databases)
        cur.execute("""
            ALTER TABLE sources 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'
        """)
        
        # Insert the manual source into the sources table with spam filtering status
        insert_query = """
            INSERT INTO sources (title, url, severity, description, date, country, category, manual, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id, title, description, status, created_at;
        """
        
        # Use provided date or current date
        if request.get("date"):
            try:
                pub_date = datetime.strptime(request.get("date"), '%Y-%m-%d').date()
            except ValueError:
                pub_date = datetime.now().date()
        else:
            pub_date = datetime.now().date()
        
        cur.execute(insert_query, (
            title,
            url,
            request.get("severity"),
            description,
            pub_date,
            request.get("country"),
            request.get("category"),
            True,
            initial_status
        ))
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        # Return appropriate message based on spam filtering result
        if initial_status == "junk":
            return {
                "message": "Report submitted but flagged as potential spam/junk",
                "status": "junk",
                "filtered": True
            }
        else:
            return {
                "message": "Manual source created successfully",
                "status": "pending",
                "filtered": False
            }
        
    except psycopg2.Error as e:
        print (e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print (e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/articles/statistics")
async def get_article_statistics(req: Request):
    """
    Get statistics for articles based on provided criteria
    """
    try:
        filters = await req.json()
        filters = filters.get("filters", {})
        print ("^^^", filters)
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        stats_query = """SELECT
                COUNT(*) AS total_incidents,
                COUNT(*) FILTER (WHERE category LIKE '%Death') AS total_deaths,
                COUNT(*) FILTER (WHERE category LIKE '%Accident') AS total_accidents,
                COUNT(*) FILTER (WHERE pubDate::date = CURRENT_DATE) AS today_incidents
            FROM
                articles
            WHERE category IS NOT NULL AND category != '' AND category != 'N/A'
            AND category <> 'N/A';"""
        cur.execute(stats_query)
        rows = cur.fetchall()
        stats = dict(rows[0])
        print ("#####", stats)

        severity_query = ''
        date_query = ''
        category_query = ''
        country_query = ''

        severity_query = ' OR '.join(list(map(lambda severity: f"category LIKE '%{severity}'", list(filters.get("severities", [])))))
        if severity_query:
            severity_query = f" AND ({severity_query})"

        if filters.get("dateRange", {}).get("start") and filters.get("dateRange", {}).get("end"):
            date_query = f" AND pubDate BETWEEN '{filters.get('dateRange', {}).get('start')}' AND '{filters.get('dateRange', {}).get('end')}'"
        elif filters.get("dateRange", {}).get("start"):
            date_query = f" AND pubDate >= '{filters.get('dateRange', {}).get('start')}'"
        elif filters.get("dateRange", {}).get("end"):
            date_query = f" AND pubDate <= '{filters.get('dateRange', {}).get('end')}'"
        else:
            date_query = ''
        
        category_query = ' OR '.join(list(map(lambda category: f"category LIKE '{category}%'", filters.get("categories", []))))
        if category_query:
            category_query = f" AND ({category_query})"

        country_query = ' OR '.join(list(map(lambda country: f"c.country LIKE '{country.lower()}%'", filters.get("countries", []))))
        if country_query:
            country_query = f" AND ({country_query})"
        
        print ("!!", severity_query, date_query, category_query, country_query)
        query = f"""
            SELECT c.country, COUNT(*)
            FROM articles a
            JOIN LATERAL
                unnest(a.country) AS c(country)
                ON TRUE
            WHERE 1=1 {severity_query} {date_query} {category_query} {country_query} AND c.country IS NOT NULL AND category IS NOT NULL AND category <> 'N/A' AND category != ''
            GROUP BY c.country
        """
        print (query)
        cur.execute(query)
        rows = cur.fetchall()
        counts = rows

        articles_query = f"""
            SELECT title, link, description, pubDate, country, category
            FROM articles
            WHERE 1=1 {severity_query} {date_query} {category_query} AND country IS NOT NULL AND category IS NOT NULL AND category <> 'N/A' AND category != ''
            ORDER BY id DESC
            LIMIT 50
        """
        cur.execute(articles_query)
        articles = cur.fetchall()
        
        category_count_query = f"""
            SELECT 
                LEFT(category, POSITION('/' IN category) - 1) AS base_category, 
                COUNT(*) AS article_count
            FROM 
                articles
            WHERE 
                1=1 
                {severity_query}
                {date_query}
                {category_query}
                AND country IS NOT NULL
                AND category IS NOT NULL
                AND category <> 'N/A'
                AND category != ''
            GROUP BY 
                base_category
            ORDER BY 
                article_count DESC;
        """
        cur.execute(category_count_query)
        category_counts = cur.fetchall()

        severity_count_query = f"""
            SELECT
                SUM(CASE WHEN category LIKE '%Death' THEN 1 ELSE 0 END) AS death,
                SUM(CASE WHEN category LIKE '%Accident' THEN 1 ELSE 0 END) AS accident
            FROM
                articles
            WHERE
                1=1
                {severity_query}
                {date_query}
                {category_query}
                AND country IS NOT NULL
                AND category IS NOT NULL
                AND category <> 'N/A'
                AND category != '';
        """
        cur.execute(severity_count_query)
        severity_counts = cur.fetchall()


        cur.close()
        conn.close()


        # INSERT_YOUR_CODE
        import os

        cron_log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'cron_log.txt')
        latest_cron_time = None
        try:
            with open(cron_log_path, 'r') as f:
                lines = f.readlines()
                # Find the last non-empty line
                for line in reversed(lines):
                    line = line.strip()
                    if not line:
                        continue
                    # Example line: Scraped 189 blogs at 2025-09-22 10:20:02.668257
                    if " at " in line:
                        latest_cron_time = line.split(" at ")[-1]
                        break
        except Exception as e:
            print(f"Could not read cron_log.txt: {e}")
            latest_cron_time = None
        # INSERT_YOUR_CODE
        from datetime import datetime, timedelta

        latest_cron_datetime = None
        if latest_cron_time:
            try:
                latest_cron_datetime = datetime.strptime(latest_cron_time, "%Y-%m-%d %H:%M:%S.%f") + timedelta(hours=2)
            except Exception as e:
                print(f"Could not parse latest_cron_time: {e}")
                latest_cron_datetime = None
        
        if latest_cron_datetime:
            latest_cron_datetime = latest_cron_datetime.replace(minute=0, second=0, microsecond=0)

        return {
            "stats": stats,
            "counts": counts,
            "articles": articles,
            "last_update_time": latest_cron_datetime,
            "category_counts": category_counts,
            "severity_counts": severity_counts
        }
        
    except Exception as e:
        print (e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Admin endpoints for managing manual reports
@app.get("/admin/reports")
async def get_admin_reports():
    """
    Get all manual reports for admin review
    """
    try:
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Add status column if it doesn't exist
        cur.execute("""
            ALTER TABLE sources 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'
        """)
        
        # Get all manual reports from sources table
        query = """
            SELECT id, title, description, url, severity, date, country, category, 
                   created_at, manual, status
            FROM sources
            ORDER BY created_at DESC
        """
        cur.execute(query)
        reports = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Convert to list of dictionaries
        return [dict(report) for report in reports]
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.patch("/admin/reports/{report_id}/status")
async def update_report_status(report_id: int, request: dict):
    """
    Update the status of a manual report (approve, reject, etc.)
    """
    try:
        status = request.get("status")
        if status not in ["pending", "approved", "rejected", "junk"]:
            raise HTTPException(status_code=400, detail="Invalid status")
            
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Add status column if it doesn't exist
        cur.execute("""
            ALTER TABLE sources 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'
        """)
        
        # Update the report status
        update_query = """
            UPDATE sources 
            SET status = %s, created_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, title, status
        """
        cur.execute(update_query, (status, report_id))
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Report not found")
            
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            "message": f"Report status updated to {status}",
            "report": dict(result)
        }
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.put("/admin/reports/{report_id}")
async def update_report_content(report_id: int, request: dict):
    """
    Update the content of a manual report (title, description, etc.)
    """
    try:
        # Validate required fields
        title = request.get("title")
        description = request.get("description")
        url = request.get("url", "")
        date = request.get("date")
        country = request.get("country")
        category = request.get("category")
        
        if not all([title, description, date, country, category]):
            raise HTTPException(status_code=400, detail="Missing required fields: title, description, date, country, category")
        
        # Validate date format
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        # Validate country format (should be array)
        if isinstance(country, str):
            country = [country]
        elif not isinstance(country, list):
            raise HTTPException(status_code=400, detail="Country must be a string or array of strings")
        
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Update the report content
        update_query = """
            UPDATE sources 
            SET title = %s, description = %s, url = %s, date = %s, 
                country = %s, category = %s
            WHERE id = %s
            RETURNING id, title, description, url, date, country, category, status, created_at
        """
        cur.execute(update_query, (title, description, url, date, country, category, report_id))
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Report not found or not a manual report")
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            "message": "Report updated successfully",
            "report": dict(result)
        }
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.delete("/admin/reports/{report_id}")
async def delete_report(report_id: int):
    """
    Delete a manual report permanently
    """
    try:
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Delete the report
        delete_query = """
            DELETE FROM sources 
            WHERE id = %s
            RETURNING id, title
        """
        cur.execute(delete_query, (report_id,))
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Report not found")
            
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            "message": "Report deleted successfully",
            "deleted_report": dict(result)
        }
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/admin/stats")
async def get_admin_stats():
    """
    Get admin dashboard statistics for manual reports
    """
    try:
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Add status column if it doesn't exist
        cur.execute("""
            ALTER TABLE sources 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'
        """)
        
        # Get statistics
        stats_query = """
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending' OR status IS NULL) as pending,
                COUNT(*) FILTER (WHERE status = 'approved') as approved,
                COUNT(*) FILTER (WHERE status = 'rejected') as rejected
            FROM sources 
        """
        cur.execute(stats_query)
        stats = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return dict(stats)
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8800"))
    uvicorn.run(app, host=host, port=port)