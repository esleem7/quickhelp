from fastapi import APIRouter, HTTPException
from app.schemas import RegisterRequest, LoginRequest
from app.db import get_cursor

router = APIRouter()


@router.post("/register")
def register(payload: RegisterRequest):
    try:
        with get_cursor(commit=True) as cur:
            cur.execute(
                "SELECT id FROM profiles WHERE email = %s",
                (payload.email,)
            )
            existing = cur.fetchone()

            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")

            cur.execute(
                """
                INSERT INTO profiles (full_name, email, password, city, role)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, full_name, email, city, role, rating_average, created_at
                """,
                (
                    payload.full_name,
                    payload.email,
                    payload.password,
                    payload.city,
                    payload.role,
                )
            )

            user = cur.fetchone()

        return {
            "message": "User registered successfully",
            "user": user,
            "token": str(user["id"])
        }

    except HTTPException:
        raise
    except Exception as e:
        print("REGISTER ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login(payload: LoginRequest):
    try:
        with get_cursor() as cur:
            cur.execute(
                """
                SELECT id, full_name, email, city, role, rating_average, created_at
                FROM profiles
                WHERE email = %s AND password = %s
                """,
                (payload.email, payload.password)
            )

            user = cur.fetchone()

            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")

        return {
            "message": "Login successful",
            "user": user,
            "token": str(user["id"])
        }

    except HTTPException:
        raise
    except Exception as e:
        print("LOGIN ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/{user_id}")
def get_me(user_id: str):
    try:
        with get_cursor() as cur:
            cur.execute(
                """
                SELECT id, full_name, email, city, role, rating_average, created_at
                FROM profiles
                WHERE id = %s
                """,
                (user_id,)
            )

            user = cur.fetchone()

            if not user:
                raise HTTPException(status_code=404, detail="User not found")

        return user

    except HTTPException:
        raise
    except Exception as e:
        print("GET ME ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))