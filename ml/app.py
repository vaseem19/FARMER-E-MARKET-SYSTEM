from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model import predict_price
from db import get_connection
from datetime import datetime

# ==============================
# APP INIT
# ==============================
app = FastAPI(title="Farmer Market ML API 🚀")

# ==============================
# CORS
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# REQUEST MODEL
# ==============================
class PredictionRequest(BaseModel):
    crop: str = Field(..., example="Wheat")
    location: str = Field(..., example="Delhi")
    quantity: int = Field(..., gt=0, example=10)

# ==============================
# HEALTH CHECK
# ==============================
@app.get("/")
def home():
    return {"status": "ML API Running 🚀"}

# ==============================
# PREDICT ROUTE
# ==============================
@app.post("/predict")
def predict(data: PredictionRequest):

    try:
        # ✅ CLEAN INPUT (VERY IMPORTANT)
        crop = data.crop.lower().strip()
        location = data.location.lower().strip()
        quantity = data.quantity

        print("🔥 Clean Input:", crop, location, quantity)

        result = predict_price(crop, location, quantity)

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        price = result["predicted_price"]

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO prediction_history 
        (crop, location, quantity, predicted_price, created_at)
        VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            crop,
            location,
            quantity,
            price,
            datetime.now()
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "success": True,
            "data": {
                "crop": crop,
                "location": location,
                "quantity": quantity,
                "predicted_price": price
            }
        }

    except Exception as e:
        print("❌ ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
# ==============================
# HISTORY ROUTE
# ==============================
@app.get("/history")
def get_history():

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT crop, location, quantity, predicted_price, created_at
            FROM prediction_history
            ORDER BY created_at DESC
        """)

        results = cursor.fetchall()

        cursor.close()
        conn.close()

        print("📊 History fetched:", len(results))

        return {
            "success": True,
            "count": len(results),
            "data": results
        }

    except Exception as e:
        print("❌ ERROR in /history:", e)
        raise HTTPException(status_code=500, detail=str(e))