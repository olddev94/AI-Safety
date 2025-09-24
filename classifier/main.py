import psycopg2
import time
import json
from typing import List, Optional, Dict, Any
from openai import OpenAI
from psycopg2.extras import execute_values
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Add the project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
from classifier.config import (
    BATCH_SIZE, MAX_RETRIES, RATE_LIMIT_DELAY, MODEL_NAME,
    MAX_TOKENS, TEMPERATURE, DB_FETCH_LIMIT, MAX_CONTENT_LENGTH,
    VALID_CATEGORIES
)

# Initialize OpenAI client with API key from environment variables
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classify_articles_batch(article) -> List[str]:
    """
    Classify multiple articles in a single API call using batch processing.
    """
    if not article:
        return []
    
    death_words = [
        "death",
        "deceased",
        "died",
        "demise",
        "lifeless",
        "perished",
        "dead",
        "fatality",
        "passing",
        "gone",
        "expired",
        "mortality",
        "corpse",
        "cadaver",
        "postmortem",
        "autopsy",
        "obituary",
        "burial",
        "funeral",
        "suicide",
        "homicide",
        "murder",
        "killing",
        "manslaughter",
        "euthanasia",
        "slaying",
        "trauma",
        "execution",
        "sids",
        "accident",
        "mishap",
        "crash",
        "collision",
        "wreck",
        "impact",
        "smash",
        "prang",
        "incident",
        "disaster",
        "catastrophe",
        "calamity",
        "hazard",
        "emergency",
        "injury",
        "wound",
        "trauma",
        "damage",
        "destruction",
        "rescue",
        "paramedic",
        "hospitalization",
        "car",
        "vehicle",
        "traffic",
        "workplace",
        "industrial",
        "domestic",
        "slip",
        "trip",
        "fall",
        "burn",
        "fire",
        "explosion",
        "drowning",
        "electrocution",
        "amputation",
        "casualty",
        "survivor"
    ]
    content = article.get("content", "").lower()
    flag = 0
    for word in death_words :
        if word in content:
            flag = 1
            break
    if flag == 0:
        return 'N/A'
    
    # Use categories from config
    valid_categories = VALID_CATEGORIES
    
    # Prepare batch content
    articles_text = ""

    system_prompt = f"""
    Below is a blog excerpt and a list of allowed categories.
    Choose exactly one category for the content.
    If the blog is NOT about a death OR accident caused or directly related to AI, then select 'N/A'.
    If you are at all unsure, also select 'N/A'.

    Categories:
    {json.dumps(valid_categories, indent=2)}
    --------------
    Blog Content:
    {article.get("content", "")}
    --------------
    Your task:
    Output only the single correct category for the blog (verbatim) when you can certain, based on the instructions above.
    Other cases, you must return 'N/A'

"""

    for attempt in range(MAX_RETRIES):
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt}
                ],
                max_tokens=MAX_TOKENS,
                temperature=TEMPERATURE
            )
            classification_text = response.choices[0].message.content.strip()
            # Parse JSON response
            print ("######", classification_text)
            if classification_text != 'N/A':
                with open("1.txt", "w") as fp:
                    fp.write(system_prompt)
            return classification_text
            if attempt < MAX_RETRIES - 1:
                time.sleep(RATE_LIMIT_DELAY * (attempt + 1))  # Exponential backoff
                
        except Exception as e:
            print(f"Error on attempt {attempt + 1}: {str(e)}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RATE_LIMIT_DELAY * (attempt + 1))
    
    # Fallback: return N/A for all articles if all attempts failed
    print("All classification attempts failed, defaulting to 'N/A' for all articles")
    return 'N/A'

def classify_articles(articles: List[Dict[str, Any]]) -> List[str]:
    """
    Process articles in batches for efficient classification.
    """
    all_categories = []
    
    # Process articles in batches
    # for i in range(0, len(articles), BATCH_SIZE):
    #     batch = articles[i:i + BATCH_SIZE]
    #     print(f"Processing batch {i//BATCH_SIZE + 1}/{(len(articles) + BATCH_SIZE - 1)//BATCH_SIZE} ({len(batch)} articles)")
        
    #     batch_categories = classify_articles_batch(batch)
    #     all_categories.extend(batch_categories)
        
    #     # Rate limiting between batches
    #     if i + BATCH_SIZE < len(articles):
    #         time.sleep(RATE_LIMIT_DELAY)
    for i in range(0, len(articles)):
        batch = articles[i]
        print(f"Processing {i}")
        
        batch_categories = classify_articles_batch(batch)
        all_categories.append(batch_categories)
        
        # Rate limiting between batches
        if i + BATCH_SIZE < len(articles):
            time.sleep(RATE_LIMIT_DELAY)
    
    return all_categories

def get_pg_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME", "defaultdb"),
        user=os.getenv("DB_USER", "avnadmin"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        sslmode=os.getenv("DB_SSLMODE", "require")
    )

def save_category_articles(articles, categories):
    conn = get_pg_connection()
    cur = conn.cursor()
    # Batch update all articles in one operation, no need for a for loop

    update_tuples = [(category, article["id"]) for article, category in zip(articles, categories)]
    if update_tuples:
        execute_values(
            cur,
            """
            UPDATE articles AS a SET category = data.category
            FROM (VALUES %s) AS data(category, id)
            WHERE a.id = data.id;
            """,
            update_tuples
        )
    conn.commit()
    cur.close()
    conn.close()

def load_articles():
    articles = []
    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title, link, description, content, pubDate, country, category
        FROM articles
        WHERE category IS NULL OR category = '' OR category = 'N/A'
        LIMIT %s;
    """, (DB_FETCH_LIMIT,))
    rows = cur.fetchall()
    for row in rows:
        articles.append({
            "id": row[0],
            "title": row[1],
            "link": row[2],
            "description": row[3],
            "content": row[4],
            "pubDate": row[5],
            "country": row[6],
            "category": row[7],
        })
    cur.close()
    conn.close()
    return articles

def main():
    """Main processing loop with improved error handling and progress tracking."""
    while True:
        try:
            articles = load_articles()
            if not articles:
                print("No more articles to process. Waiting 30 seconds before checking again...")
                time.sleep(30)
                continue
            
            print(f"Found {len(articles)} articles to classify")
            start_time = time.time()
            
            categories = classify_articles(articles)
            
            if len(categories) != len(articles):
                print(f"Warning: Mismatch between articles ({len(articles)}) and categories ({len(categories)})")
                continue

            save_category_articles(articles, categories)
            
            elapsed_time = time.time() - start_time
            print(f"Successfully processed {len(articles)} articles in {elapsed_time:.2f} seconds")
            print(f"Average time per article: {elapsed_time/len(articles):.2f} seconds")
            
            # Brief pause before next batch
            time.sleep(2)
            
        except KeyboardInterrupt:
            print("\nProcess interrupted by user")
            break
        except Exception as e:
            print(f"Error in main loop: {str(e)}")
            print("Waiting 30 seconds before retrying...")
            time.sleep(30)

if __name__ == "__main__":
    main()