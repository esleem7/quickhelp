from fastapi import APIRouter, HTTPException, Query
from app.supabase_client import supabase
from app.schemas import HelpRequestCreate, HelpRequestUpdate



router = APIRouter()


@router.post("")
def create_request(payload: HelpRequestCreate, requester_id: str = Query(...)):
    data = payload.model_dump()
    data["requester_id"] = requester_id
    data["status"] = "open"

    result = supabase.table("help_requests").insert(data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Could not create request")

    return result.data[0]


@router.get("")
def list_requests(
    category: str | None = None,
    urgency: str | None = None,
    city: str | None = None,
    status: str | None = None,
):
    query = (
        supabase.table("help_requests")
        .select("*, requester:profiles!help_requests_requester_id_fkey(full_name, rating_average)")
        .order("created_at", desc=True)
    )

    if category:
        query = query.eq("category", category)

    if urgency:
        query = query.eq("urgency", urgency)

    if city:
        query = query.eq("city", city)

    if status:
        query = query.eq("status", status)

    result = query.execute()
    return result.data


@router.get("/{request_id}")
def get_request(request_id: str):
    result = (
        supabase.table("help_requests")
        .select("*, requester:profiles!help_requests_requester_id_fkey(*)")
        .eq("id", request_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    return result.data


@router.put("/{request_id}")
def update_request(request_id: str, payload: HelpRequestUpdate):
    data = {k: v for k, v in payload.model_dump().items() if v is not None}

    result = (
        supabase.table("help_requests")
        .update(data)
        .eq("id", request_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    return result.data[0]


@router.post("/{request_id}/start")
def start_request(request_id: str):
    result = (
        supabase.table("help_requests")
        .update({"status": "in_progress"})
        .eq("id", request_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    return result.data[0]


@router.post("/{request_id}/complete")
def complete_request(request_id: str):
    result = (
        supabase.table("help_requests")
        .update({"status": "completed"})
        .eq("id", request_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    return result.data[0]


@router.post("/{request_id}/cancel")
def cancel_request(request_id: str):
    result = (
        supabase.table("help_requests")
        .update({"status": "cancelled"})
        .eq("id", request_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    return result.data[0]