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
        
        # Ensure severity, content, and image_url columns exist
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS severity TEXT;
        """)
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS content TEXT;
        """)
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        """)
        
        # Copy image_url from articles table if it exists and news.image_url is NULL
        cur.execute("""
            UPDATE news n
            SET image_url = a.image_url
            FROM articles a
            WHERE n.id = a.id 
            AND n.image_url IS NULL 
            AND a.image_url IS NOT NULL;
        """)
        
        # Update severity from category if it's NULL (extract part after '/')
        cur.execute("""
            UPDATE news 
            SET severity = CASE 
                WHEN category LIKE '%/Death' THEN 'Fatality'
                WHEN category LIKE '%/Accident' THEN 'Accident'
                WHEN category LIKE '%Death%' AND category NOT LIKE '%/%' THEN 'Fatality'
                WHEN category LIKE '%Accident%' AND category NOT LIKE '%/%' THEN 'Accident'
                ELSE NULL
            END
            WHERE severity IS NULL AND category IS NOT NULL AND category != '' AND category != 'N/A';
        """)
        conn.commit()
        
        # Build filter conditions first
        severity_query = ''
        date_query = ''
        category_query = ''
        country_query = ''
        base_where = "WHERE category IS NOT NULL AND category != '' AND category != 'N/A' AND category <> 'N/A'"

        # Filter by severity field directly
        if filters.get("severities", []):
            severity_conditions = []
            for severity in filters.get("severities", []):
                severity_conditions.append(f"severity = '{severity}'")
            if severity_conditions:
                severity_query = f" AND ({' OR '.join(severity_conditions)})"

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

        # For country filter in stats query, we need to check if any country in the array matches
        if filters.get("countries", []):
            country_conditions = []
            for country in filters.get("countries", []):
                # Check if the country (case-insensitive) exists in the country array
                # Using array_to_string with lower for case-insensitive matching
                country_conditions.append(f"LOWER(array_to_string(country, ',')) LIKE LOWER('%{country}%')")
            if country_conditions:
                country_query = f" AND ({' OR '.join(country_conditions)})"
        
        # Build stats query with filters applied
        stats_query = f"""SELECT
                COUNT(*) AS total_incidents,
                COUNT(*) FILTER (WHERE severity = 'Fatality') AS total_deaths,
                COUNT(*) FILTER (WHERE severity = 'Accident') AS total_accidents,
                COUNT(*) FILTER (WHERE pubDate::date = CURRENT_DATE) AS today_incidents
            FROM
                news
            {base_where} {severity_query} {date_query} {category_query} {country_query}"""
        cur.execute(stats_query)
        rows = cur.fetchall()
        stats = dict(rows[0])
        print ("#####", stats)

        # Country query for the counts query (using LATERAL join)
        country_query_lateral = ''
        if filters.get("countries", []):
            country_conditions_lateral = ' OR '.join(list(map(lambda country: f"c.country LIKE '{country.lower()}%'", filters.get("countries", []))))
            if country_conditions_lateral:
                country_query_lateral = f" AND ({country_conditions_lateral})"
        
        print ("!!", severity_query, date_query, category_query, country_query_lateral)
        query = f"""
            SELECT c.country, COUNT(*)
            FROM news a
            JOIN LATERAL
                unnest(a.country) AS c(country)
                ON TRUE
            {base_where} {severity_query} {date_query} {category_query} {country_query_lateral} AND c.country IS NOT NULL
            GROUP BY c.country
        """
        print (query)
        cur.execute(query)
        rows = cur.fetchall()
        counts = rows

        articles_query = f"""
            SELECT id, title, url, description, pubDate AS "pubDate", country, category, content, severity, image_url
            FROM news
            {base_where} {severity_query} {date_query} {category_query} {country_query} AND country IS NOT NULL
            ORDER BY pubDate DESC
            LIMIT 50
        """
        cur.execute(articles_query)
        articles = cur.fetchall()
        
        category_count_query = f"""
            SELECT 
                category AS base_category, 
                COUNT(*) AS article_count
            FROM 
                news
            {base_where} {severity_query} {date_query} {category_query} {country_query} AND country IS NOT NULL
            GROUP BY 
                category
            ORDER BY 
                article_count DESC;
        """
        cur.execute(category_count_query)
        category_counts = cur.fetchall()

        severity_count_query = f"""
            SELECT
                COUNT(*) FILTER (WHERE severity = 'Fatality') AS death,
                COUNT(*) FILTER (WHERE severity = 'Accident') AS accident
            FROM
                news
            {base_where} {severity_query} {date_query} {category_query} {country_query} AND country IS NOT NULL;
        """
        cur.execute(severity_count_query)
        severity_counts = cur.fetchall()


        # Get the last update time from the most recent article in the news table
        last_update_query = """
            SELECT MAX(pubDate) as last_update
            FROM news
            WHERE category IS NOT NULL AND category != '' AND category != 'N/A'
        """
        cur.execute(last_update_query)
        last_update_result = cur.fetchone()
        
        latest_cron_datetime = None
        if last_update_result and last_update_result.get('last_update'):
            # Convert date to datetime for consistency
            from datetime import datetime
            last_update_date = last_update_result['last_update']
            if isinstance(last_update_date, datetime):
                latest_cron_datetime = last_update_date.isoformat()
            else:
                # If it's a date object, convert to datetime at midnight
                latest_cron_datetime = datetime.combine(last_update_date, datetime.min.time()).isoformat()
        
        cur.close()
        conn.close()

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

@app.get("/news/{news_id}")
async def get_news_detail(news_id: int):
    """
    Get detailed information about a specific news article
    """
    try:
        conn = get_pg_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Ensure severity and content columns exist
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS severity TEXT;
        """)
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS content TEXT;
        """)
        
        # Ensure image_url column exists
        cur.execute("""
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        """)
        
        # Fetch the news article
        query = """
            SELECT id, title, url, description, content, pubDate AS "pubDate", country, category, severity, image_url
            FROM news
            WHERE id = %s
        """
        cur.execute(query, (news_id,))
        article = cur.fetchone()
        
        if not article:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="News article not found")
        
        # Get relevant articles based on title keywords and category
        # Extract keywords from title (words longer than 3 characters)
        title_words = [word.lower() for word in article['title'].split() if len(word) > 3]
        
        # Build the query with proper parameterization
        if title_words:
            # Build ILIKE conditions with parameters
            title_conditions = []
            title_params = []
            for word in title_words[:5]:  # Limit to 5 keywords
                title_conditions.append("title ILIKE %s")
                title_params.append(f'%{word}%')
            
            # Build query with title conditions
            title_where = ' OR '.join(title_conditions)
            relevant_query = f"""
                SELECT id, title, url, description, pubDate AS "pubDate", country, category, severity, image_url
                FROM news
                WHERE id != %s
                AND category IS NOT NULL 
                AND category != '' 
                AND category != 'N/A'
                AND (
                    category = %s
                    OR ({title_where})
                )
                ORDER BY 
                    CASE WHEN category = %s THEN 1 ELSE 2 END,
                    pubDate DESC
                LIMIT 5
            """
            # Combine all parameters: news_id, category (for WHERE), title_params, category (for ORDER BY)
            params = (news_id, article['category']) + tuple(title_params) + (article['category'],)
            cur.execute(relevant_query, params)
        else:
            # If no keywords, just match by category
            relevant_query = """
                SELECT id, title, url, description, pubDate AS "pubDate", country, category, severity, image_url
                FROM news
                WHERE id != %s
                AND category IS NOT NULL 
                AND category != '' 
                AND category != 'N/A'
                AND category = %s
                ORDER BY pubDate DESC
                LIMIT 5
            """
            cur.execute(relevant_query, (news_id, article['category']))
        
        relevant_articles = cur.fetchall()
        
        cur.close()
        conn.close()
        
        result = dict(article)
        result['relevant_articles'] = [dict(art) for art in relevant_articles]
        
        return result
        
    except psycopg2.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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