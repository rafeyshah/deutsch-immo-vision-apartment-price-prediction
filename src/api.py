from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

import joblib
import pandas as pd
import os
import logging

app = FastAPI()

# Load the trained XGBoost model
model = joblib.load("artifacts/best_XGBoost_model.pkl")


# Define the input schema to match the expected features in the model
class PredictionRequest(BaseModel):
    regio1: int
    serviceCharge: float
    heatingType: int
    newlyConst: int
    balcony: int
    picturecount: int
    pricetrend: float
    telekomUploadSpeed: float
    yearConstructed: int
    scoutId: int
    firingTypes: int
    hasKitchen: int
    geo_bln: int
    cellar: int
    yearConstructedRange: int
    baseRent: float
    houseNumber: int
    livingSpace: float
    geo_krs: int
    condition: int
    street: int
    streetPlain: int
    lift: int
    baseRentRange: int
    typeOfFlat: int
    geo_plz: int
    noRooms: int
    thermalChar: float
    floor: int
    numberOfFloors: int
    noRoomsRange: int
    garden: int
    livingSpaceRange: int
    regio2: int
    regio3: int
    description: str = "dummy"  # Placeholder for description
    facilities: str = "dummy"  # Placeholder for facilities
    date: str = "2023-01-01"  # Placeholder for date
    month: int
    year: int
    season: int
    room_size: float
    rent_per_sqm: float
    price_trend_adjusted_rent: float
    description_length: int
    facilities_length: int
    livingSpace_log: float
    totalRent_log: float
    telekomTvOffer_ONE_YEAR_FREE: int
    telekomTvOffer_ON_DEMAND: int
    telekomTvOffer_Unknown: int
    interiorQual_luxury: int
    interiorQual_normal: int
    interiorQual_simple: int
    interiorQual_sophisticated: int
    petsAllowed_negotiable: int
    petsAllowed_no: int
    petsAllowed_yes: int


@app.get("/")
async def read_root():
    return RedirectResponse(url="/frontend/index.html")


frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")
app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")


@app.post("/predict")
async def predict(request: PredictionRequest):
    # Convert request data to a DataFrame
    # Updated to use model_dump()
    input_data = pd.DataFrame([request.model_dump()])

    # Ensure placeholders are added for missing object columns
    input_data["description"] = "dummy"
    input_data["facilities"] = "dummy"
    input_data["date"] = "2023-01-01"

    # Drop non-numeric columns before passing to the model
    input_data = input_data.drop(
        columns=["description", "facilities", "date"], errors="ignore"
    )

    # Ensure all expected features are present and in the correct order
    model_features = model.get_booster().feature_names
    input_data = input_data.reindex(columns=model_features, fill_value=0)

    # Make prediction and convert to float for JSON compatibility
    try:
        prediction = float(model.predict(input_data)[0])
        return {"prediction": prediction}
    except Exception as e:
        print("Hello")
        raise HTTPException(status_code=400, detail=str(e))
