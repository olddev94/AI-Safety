# Configuration for batch processing classifier
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Batch processing settings
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "10"))  # Number of articles to process in a single API call
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))  # Maximum number of retries for failed API calls
RATE_LIMIT_DELAY = float(os.getenv("RATE_LIMIT_DELAY", "0.2"))  # Base delay in seconds between API calls

# OpenAI API settings
MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")
MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "200"))  # Maximum tokens for classification response
TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0"))  # Use deterministic responses for classification

# Database settings
DB_FETCH_LIMIT = int(os.getenv("DB_FETCH_LIMIT", "50"))  # Number of articles to fetch from DB at once

# Content processing settings
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", "1000"))  # Maximum characters of article content to include

# Valid classification categories
VALID_CATEGORIES = [
    'Autonomous Mobility/Death',
    'Autonomous Mobility/Accident',
    'Industrial & Workplace Robotics/Death',
    'Industrial & Workplace Robotics/Accident',
    'Clinical & Medical AI/Death',
    'Clinical & Medical AI/Accident',
    'Consumer Chatbots & LLM Advice/Death',
    'Consumer Chatbots & LLM Advice/Accident',
    'AI-Generated Manipulation & Abuse/Death',
    'AI-Generated Manipulation & Abuse/Accident',
    'Public Safety & Critical Infrastructure/Death',
    'Public Safety & Critical Infrastructure/Accident',
    'N/A'
]
