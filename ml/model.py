import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

# ==============================
# LOAD & PREPARE DATA
# ==============================
data = pd.read_csv("data.csv")

le_crop = LabelEncoder()
le_location = LabelEncoder()

# ✅ normalize dataset (IMPORTANT FIX)
data["crop"] = data["crop"].str.lower().str.strip()
data["location"] = data["location"].str.lower().str.strip()

le_crop.fit(data["crop"])
le_location.fit(data["location"])

data["crop"] = le_crop.transform(data["crop"])
data["location"] = le_location.transform(data["location"])

X = data[["crop", "location", "quantity"]]
y = data["price"]

model = LinearRegression()
model.fit(X, y)

# ==============================
# SAFE ENCODING FUNCTION
# ==============================
def safe_encode(encoder, value, field_name):
    value = value.lower().strip()   # ✅ FIX CASE + SPACE ISSUE

    if value not in encoder.classes_:
        raise ValueError(
            f"{field_name} '{value}' not supported. Available: {list(encoder.classes_)}"
        )

    return encoder.transform([value])[0]

# ==============================
# MAIN PREDICTION FUNCTION
# ==============================
def predict_price(crop, location, quantity):
    try:
        # normalize inputs
        crop = crop.lower().strip()
        location = location.lower().strip()

        # validate
        if not crop or not location:
            return {"error": "Crop and location are required"}

        if quantity <= 0:
            return {"error": "Quantity must be greater than 0"}

        # encode safely
        crop_encoded = safe_encode(le_crop, crop, "Crop")
        location_encoded = safe_encode(le_location, location, "Location")

        # predict
        prediction = model.predict([[crop_encoded, location_encoded, quantity]])

        return {
            "predicted_price": round(float(prediction[0]), 2),
            "crop": crop,
            "location": location,
            "quantity": quantity
        }

    except ValueError as ve:
        return {"error": str(ve)}

    except Exception as e:
        return {
            "error": "Internal server error",
            "details": str(e)
        }