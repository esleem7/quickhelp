from supabase import create_client, Client
from app.config import settings

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
elif settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
else:
    supabase = None
    print("Warning: SUPABASE_URL and/or SUPABASE_KEY not found in environment.")