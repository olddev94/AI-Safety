import requests, os, json
from datetime import datetime, timedelta
import sys
import os
# Add the project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)
import psycopg2
from classifier.main import classify_articles
from utils.main import deduplicate_articles

def fetch_articles(start_date, end_date):
    try :
        API_KEY = 'pub_21e5f68d03ca40e8834779ac95f5d761'
        url = "https://newsdata.io/api/1/archive"

        params = {
            "apikey": API_KEY,
            "q": "ai AND (death OR incident OR accident OR failure OR malfunction OR crash OR error OR kill OR injury)",
            "language": "en",
        }

        articles = []
        total = 0
        
        from_date = start_date.strftime("%Y-%m-%d %H:%M:%S")
        to_date = end_date.strftime("%Y-%m-%d %H:%M:%S")
        print (from_date, to_date)
        params["from_date"] = from_date
        params["to_date"] = to_date
        page = ""

        while True:
            params.pop("page", None)
            if page:
                params["page"] = page
            response = requests.get(url, params=params)
            data = response.json()
            day_articles = deduplicate_articles(data.get("results", []))
            next_page = data.get("nextPage", "")

            articles = []
            for art in day_articles:
                if art.get("duplicate") == True:
                    continue
                if art.get("content") == None:
                    continue
                if art.get("description") == None:
                    continue
                if art.get("title") == None:
                    continue
                if art.get("pubDate") == None:
                    continue
                if art.get("country") == None:
                    continue
                if art.get("link") == None:
                    continue
                articles.append({
                    "title": art.get("title", ""),
                    "url": art.get("link", ""),
                    "description": art.get("description", ""),
                    "content": art.get("content", ""),
                    "pubDate": art.get("pubDate", ""),
                    # "language": art.get("language", ""),
                    "country": art.get("country", ""),
                })
            categories = classify_articles(articles)
            # Add the category field to each article based on the classification result
            for idx, cat in enumerate(categories):
                if idx < len(articles):
                    articles[idx]["category"] = cat
            save_to_pg(articles)
            # save_to_pg(categories)
            page = next_page
            total += len(articles)

            if page == "" or page == None:
                break
        with open('/home/ubuntu/Project/cron_log.txt', 'a') as fp:
            fp.write(f'Scraped {total} blogs at {str(start_date)}\n')
    except Exception as e:
        print (f'Error: {e}')

def save_to_pg(articles):
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME", "defaultdb"),
        user=os.getenv("DB_USER", "avnadmin"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        sslmode=os.getenv("DB_SSLMODE", "require")
    )
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title TEXT,
            url TEXT UNIQUE,
            description TEXT,
            content TEXT,
            pubDate DATE,
            country TEXT[],
            category TEXT,
            severity TEXT
        );
    """)

    for art in articles:
        cur.execute("""
            INSERT INTO news (title, url, description, content, pubDate, country, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO NOTHING;
        """, (
            art.get("title"),
            art.get("url"),
            art.get("description"),
            art.get("content"),
            art.get("pubDate"),
            art.get("country"),
            art.get("category"),
        ))

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    print ("Start")
    # start_date = datetime.strptime("2025-09-21", "%Y-%m-%d")
    # end_date = datetime.strptime("2025-09-21", "%Y-%m-%d")
    end_date = datetime.utcnow() - timedelta(hours=1)
    start_date = end_date - timedelta(hours=1)
    
    fetch_articles(start_date, end_date)