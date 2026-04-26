import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# In case environment variables are missing, prevent crashing instantly but supabase calls will fail
if url and key:
    supabase: Client = create_client(url, key)
else:
    supabase = None
    print("Warning: SUPABASE_URL and/or SUPABASE_KEY not found in environment.")
