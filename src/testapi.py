# tests/test_api.py

from fastapi.testclient import TestClient
from api import app  # Import your FastAPI app instance from api.py

# Initialize the TestClient with the FastAPI app
client = TestClient(app)


def test_predict_valid_input():
    # A sample valid input that should work with the model
    payload = {
        "regio1": 1,
        "serviceCharge": 200,
        "heatingType": 1,
        "newlyConst": 0,
        "balcony": 1,
        "picturecount": 10,
        "pricetrend": 0.5,
        "telekomUploadSpeed": 40,
        "yearConstructed": 2000,
        "scoutId": 123456,
        "firingTypes": 1,
        "hasKitchen": 1,
        "geo_bln": 1,
        "cellar": 1,
        "yearConstructedRange": 3,
        "baseRent": 500,
        "houseNumber": 12,
        "livingSpace": 85.0,
        "geo_krs": 1,
        "condition": 2,
        "street": 1,
        "streetPlain": 1,
        "lift": 0,
        "baseRentRange": 2,
        "typeOfFlat": 1,
        "geo_plz": 12345,
        "noRooms": 3,
        "thermalChar": 100,
        "floor": 2,
        "numberOfFloors": 5,
        "noRoomsRange": 2,
        "garden": 1,
        "livingSpaceRange": 3,
        "regio2": 1,
        "regio3": 1,
        "description": "Spacious apartment",
        "facilities": "Elevator, Kitchen",
        "date": "2023-01-01",
        "month": 1,
        "year": 2023,
        "season": 1,
        "room_size": 28.33,
        "rent_per_sqm": 12.5,
        "price_trend_adjusted_rent": 620,
        "description_length": 18,
        "facilities_length": 20,
        "livingSpace_log": 4.45,
        "totalRent_log": 6.1,
        "telekomTvOffer_ONE_YEAR_FREE": 1,
        "telekomTvOffer_ON_DEMAND": 0,
        "telekomTvOffer_Unknown": 0,
        "interiorQual_luxury": 0,
        "interiorQual_normal": 1,
        "interiorQual_simple": 0,
        "interiorQual_sophisticated": 0,
        "petsAllowed_negotiable": 0,
        "petsAllowed_no": 1,
        "petsAllowed_yes": 0,
    }

    # Send the POST request with valid input
    response = client.post("/predict", json=payload)

    # Check the response status code and structure
    assert response.status_code == 200
    assert "prediction" in response.json()


def test_predict_invalid_input():
    # A sample invalid input with missing required fields
    payload = {
        "serviceCharge": 200,
        "heatingType": 1,
        # Missing other required fields
    }

    # Send the POST request with invalid input
    response = client.post("/predict", json=payload)

    # Check the response for a 422 Unprocessable Entity error due to validation
    assert response.status_code == 422
    assert "detail" in response.json()
