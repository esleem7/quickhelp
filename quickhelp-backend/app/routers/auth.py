from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.schemas import RegisterRequest, LoginRequest

router = APIRouter()


@router.post("/register")
def register(payload: RegisterRequest):
    existing = (
        supabase.table("profiles")
        .select("*")
        .eq("email", payload.email)
        .execute()
    )

    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = payload.model_dump()
    result = supabase.table("profiles").insert(user_data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Could not create user")

    user = result.data[0]
    user.pop("password", None)

    return {
        "message": "User registered successfully",
        "user": user,
        "token": user["id"]
    }


@router.post("/login")
def login(payload: LoginRequest):
    result = (
        supabase.table("profiles")
        .select("*")
        .eq("email", payload.email)
        .eq("password", payload.password)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]
    user.pop("password", None)

    return {
        "message": "Login successful",
        "user": user,
        "token": user["id"]
    }


@router.get("/me/{user_id}")
def get_me(user_id: str):
    result = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = result.data[0]
    user.pop("password", None)

    return user