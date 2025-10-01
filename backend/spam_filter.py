"""
Spam filtering service using OpenAI API
"""
import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key="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")

class SpamFilter:
    """
    Spam filtering service that uses OpenAI to detect junk/spam content
    """
    
    def __init__(self):
        self.model_name = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "50"))
        self.temperature = float(os.getenv("OPENAI_TEMPERATURE", "0"))
        self.max_retries = 3
    
    def is_spam(self, title: str, description: str, url: Optional[str] = None) -> bool:
        """
        Check if the content is spam/junk using OpenAI API
        
        Args:
            title: Report title
            description: Report description  
            url: Optional URL
            
        Returns:
            bool: True if content is spam/junk, False otherwise
        """
        try:
            # Prepare content for analysis
            content_to_analyze = f"Title: {title}\n\nDescription: {description}"
            if url and url.strip() and not url.startswith('https://manual-entry-'):
                content_to_analyze += f"\n\nURL: {url}"
            
            system_prompt = """
You are a spam/junk content detector for an AI incident reporting system. 

Your task is to analyze submitted reports and determine if they are spam, junk, or legitimate incident reports.

Consider content as SPAM/JUNK if it contains:
- Promotional content, advertisements, or marketing material
- Irrelevant content not related to AI incidents, accidents, or safety issues
- Nonsensical or gibberish text
- Duplicate or test submissions
- Content that appears to be automated or bot-generated spam
- Personal attacks, harassment, or inappropriate content
- Content clearly unrelated to artificial intelligence incidents

Consider content as LEGITIMATE if it describes:
- Real or potential AI-related incidents, accidents, or safety issues
- Technical problems with AI systems
- Concerns about AI safety or ethics
- Reports of AI system malfunctions or unexpected behavior
- Even if poorly written, as long as it appears to be a genuine attempt to report an AI-related issue

Analyze the following content and respond with ONLY "SPAM" or "LEGITIMATE" - no other text or explanation.
"""

            user_prompt = f"""
Content to analyze:
{content_to_analyze}

Is this content spam/junk or a legitimate AI incident report?
"""

            for attempt in range(self.max_retries):
                try:
                    response = client.chat.completions.create(
                        model=self.model_name,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=self.max_tokens,
                        temperature=self.temperature
                    )
                    
                    result = response.choices[0].message.content.strip().upper()
                    
                    # Return True if spam, False if legitimate
                    if result == "SPAM":
                        return True
                    elif result == "LEGITIMATE":
                        return False
                    else:
                        # If unclear response, default to not spam to avoid false positives
                        print(f"Unclear spam filter response: {result}, defaulting to legitimate")
                        return False
                        
                except Exception as e:
                    print(f"Spam filter attempt {attempt + 1} failed: {str(e)}")
                    if attempt == self.max_retries - 1:
                        # If all attempts fail, default to not spam to avoid blocking legitimate reports
                        print("All spam filter attempts failed, defaulting to legitimate")
                        return False
                        
        except Exception as e:
            print(f"Spam filter error: {str(e)}")
            # Default to not spam if there's an error
            return False
    
    def get_spam_analysis(self, title: str, description: str, url: Optional[str] = None) -> Dict[str, Any]:
        """
        Get detailed spam analysis including reasoning
        
        Args:
            title: Report title
            description: Report description
            url: Optional URL
            
        Returns:
            Dict containing spam status and reasoning
        """
        is_spam_result = self.is_spam(title, description, url)
        
        return {
            "is_spam": is_spam_result,
            "status": "junk" if is_spam_result else "pending",
            "analyzed_content": {
                "title": title,
                "description": description,
                "url": url
            }
        }

# Global instance for easy import
spam_filter = SpamFilter()
