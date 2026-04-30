"""
Database module — direct PostgreSQL connection via psycopg2.
Replaces the old supabase_client.py (which required an API key).
"""

import os
from contextlib import contextmanager

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

# Parse individual connection params from env, with fallback to defaults
DB_HOST = os.environ.get("DB_HOST", "aws-0-eu-west-1.pooler.supabase.com")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "postgres")
DB_USER = os.environ.get("DB_USER", "postgres.lcjiqlgmmlvwwsusgziz")
DB_PASS = os.environ.get("DB_PASS", "islemhmouda123")


def get_conn():
    """Return a new database connection."""
    database_url = os.environ.get("DATABASE_URL")

    if database_url:
        return psycopg2.connect(database_url)

    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
    )


@contextmanager
def get_cursor(commit=False):
    """Context manager that yields a RealDictCursor.

    Usage:
        with get_cursor(commit=True) as cur:
            cur.execute("INSERT …")
    """
    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        yield cur
        if commit:
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


# ── Table creation (called once at startup) ───────────────────────────────────

CREATE_PROFILES = """
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name   TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    city        TEXT,
    role        TEXT DEFAULT 'both',
    rating_average NUMERIC DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
"""

CREATE_HELP_REQUESTS = """
CREATE TABLE IF NOT EXISTS help_requests (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    description   TEXT NOT NULL,
    category      TEXT NOT NULL,
    urgency       TEXT NOT NULL,
    city          TEXT NOT NULL,
    status        TEXT DEFAULT 'open',
    requester_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
"""


def create_tables():
    """Ensure every required table exists."""
    with get_cursor(commit=True) as cur:
        cur.execute(CREATE_PROFILES)
        cur.execute(CREATE_HELP_REQUESTS)
    print("✓ Database tables verified / created.")
