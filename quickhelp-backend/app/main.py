from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import create_tables

from app.routers import (
    auth,
    users,
    requests,
    offers,
    messages,
    ratings,
    payments,
    ai
)

app = FastAPI(title="QuickHelp API")


@app.on_event("startup")
def startup():
    create_tables()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.56.1:8080",
        "http://172.16.51.205:8080",

        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(requests.router, prefix="/requests", tags=["Requests"])
app.include_router(offers.router, prefix="/offers", tags=["Offers"])
app.include_router(messages.router, prefix="/messages", tags=["Messages"])
app.include_router(ratings.router, prefix="/ratings", tags=["Ratings"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])


@app.get("/")
def root():
    return {"message": "QuickHelp API is running"}