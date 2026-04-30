from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.schemas import OfferCreate

router = APIRouter()


@router.post("")
def create_offer(payload: OfferCreate):
    request_result = (
        supabase.table("help_requests")
        .select("*")
        .eq("id", payload.request_id)
        .single()
        .execute()
    )

    if not request_result.data:
        raise HTTPException(status_code=404, detail="Request not found")

    if request_result.data["status"] not in ["open", "offered"]:
        raise HTTPException(status_code=400, detail="Request is not available")

    offer_data = payload.model_dump()
    offer_data["status"] = "pending"

    offer = supabase.table("help_offers").insert(offer_data).execute()

    supabase.table("help_requests").update({
        "status": "offered"
    }).eq("id", payload.request_id).execute()

    return offer.data[0]


@router.get("/request/{request_id}")
def get_request_offers(request_id: str):
    result = (
        supabase.table("help_offers")
        .select("*, helper:profiles!help_offers_helper_id_fkey(*)")
        .eq("request_id", request_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


@router.post("/{offer_id}/accept")
def accept_offer(offer_id: str):
    offer_result = (
        supabase.table("help_offers")
        .select("*")
        .eq("id", offer_id)
        .single()
        .execute()
    )

    if not offer_result.data:
        raise HTTPException(status_code=404, detail="Offer not found")

    offer = offer_result.data

    supabase.table("help_offers").update({
        "status": "accepted"
    }).eq("id", offer_id).execute()

    supabase.table("help_offers").update({
        "status": "rejected"
    }).eq("request_id", offer["request_id"]).neq("id", offer_id).execute()

    request = (
        supabase.table("help_requests")
        .update({
            "status": "accepted",
            "accepted_helper_id": offer["helper_id"]
        })
        .eq("id", offer["request_id"])
        .execute()
    )

    return request.data[0]