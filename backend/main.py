from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

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
            SELECT title, link, description, pubDate, c.country, category
            FROM articles a
            JOIN LATERAL
                unnest(a.country) AS c(country)
                ON TRUE
            WHERE 1=1 {severity_query} {date_query} {category_query} {country_query} AND c.country IS NOT NULL AND category IS NOT NULL AND category <> 'N/A' AND category != ''
            ORDER BY id DESC
            LIMIT 50
        """
        cur.execute(articles_query)
        articles = cur.fetchall()
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
            "last_update_time": latest_cron_datetime
        }
        
    except Exception as e:
        print (e)
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8800"))
    uvicorn.run(app, host=host, port=port)