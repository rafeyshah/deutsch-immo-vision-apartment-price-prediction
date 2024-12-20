
document.getElementById('predictionForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Required fields (Basic Apartment Info)
    const payload = {
        regio1: parseInt(document.getElementById('regio1').value) || 1,
        serviceCharge: parseFloat(document.getElementById('serviceCharge').value) || 0.01,
        heatingType: parseInt(document.getElementById('heatingType').value) || 1,
        newlyConst: parseInt(document.getElementById('newlyConst').value) || 0,
        balcony: parseInt(document.getElementById('balcony').value) || 0,
        picturecount: parseInt(document.getElementById('picturecount').value) || 1
    };

    // Additional required and optional fields with default values
    payload.pricetrend = parseFloat(document.getElementById('pricetrend').value) || 0.5;
    payload.telekomUploadSpeed = parseFloat(document.getElementById('telekomUploadSpeed').value) || 50.0;
    payload.yearConstructed = parseInt(document.getElementById('yearConstructed').value) || 2000;
    payload.scoutId = parseInt(document.getElementById('scoutId').value) || 123456;
    payload.firingTypes = parseInt(document.getElementById('firingTypes').value) || 1;
    payload.geo_bln = parseInt(document.getElementById('geo_bln').value) || 1;
    payload.cellar = parseInt(document.getElementById('cellar').value) || 0;
    payload.yearConstructedRange = parseInt(document.getElementById('yearConstructedRange').value) || 2;
    payload.baseRent = parseFloat(document.getElementById('baseRent').value) || 500.0;
    payload.houseNumber = parseInt(document.getElementById('houseNumber').value) || 10;
    payload.livingSpace = parseFloat(document.getElementById('livingSpace').value) || 85.0;
    payload.geo_krs = parseInt(document.getElementById('geo_krs').value) || 1;
    payload.condition = parseInt(document.getElementById('condition').value) || 1;
    payload.street = parseInt(document.getElementById('street').value) || 1;
    payload.streetPlain = parseInt(document.getElementById('streetPlain').value) || 1;
    payload.lift = parseInt(document.getElementById('lift').value) || 0;
    payload.baseRentRange = parseInt(document.getElementById('baseRentRange').value) || 2;
    payload.typeOfFlat = parseInt(document.getElementById('typeOfFlat').value) || 1;
    payload.geo_plz = parseInt(document.getElementById('geo_plz').value) || 12345;
    payload.noRooms = parseInt(document.getElementById('noRooms').value) || 3;
    payload.thermalChar = parseFloat(document.getElementById('thermalChar').value) || 100.0;
    payload.floor = parseInt(document.getElementById('floor').value) || 1;
    payload.numberOfFloors = parseInt(document.getElementById('numberOfFloors').value) || 5;
    payload.noRoomsRange = parseInt(document.getElementById('noRoomsRange').value) || 2;
    payload.garden = parseInt(document.getElementById('garden').value) || 0;
    payload.livingSpaceRange = parseInt(document.getElementById('livingSpaceRange').value) || 2;
    payload.regio2 = parseInt(document.getElementById('regio2').value) || 1;
    payload.regio3 = parseInt(document.getElementById('regio3').value) || 1;
    payload.hasKitchen = parseInt(document.getElementById('hasKitchen').value) || 0; // Default to 0 if not provided

    // Description and Facilities
    payload.description = document.getElementById('description').value || "Standard apartment description";
    payload.facilities = document.getElementById('facilities').value || "Standard facilities";
    payload.description_length = document.getElementById('description').value.length || 20;
    payload.facilities_length = document.getElementById('facilities').value.length || 20;

    // Date Information
    payload.date = document.getElementById('date').value || "2023-01-01";
    payload.month = parseInt(document.getElementById('month').value) || 1;
    payload.year = parseInt(document.getElementById('year').value) || 2023;
    payload.season = parseInt(document.getElementById('season').value) || 1;

    // Calculated Features
    payload.room_size = parseFloat(document.getElementById('room_size').value) || 25.0;
    payload.rent_per_sqm = parseFloat(document.getElementById('rent_per_sqm').value) || 10.0;
    payload.price_trend_adjusted_rent = parseFloat(document.getElementById('price_trend_adjusted_rent').value) || 500.0;
    payload.livingSpace_log = parseFloat(document.getElementById('livingSpace_log').value) || 4.5;
    payload.totalRent_log = parseFloat(document.getElementById('totalRent_log').value) || 6.1;

    // Telecom & Interior Quality
    payload.telekomTvOffer_ONE_YEAR_FREE = parseInt(document.getElementById('telekomTvOffer_ONE_YEAR_FREE').value) || 0;
    payload.telekomTvOffer_ON_DEMAND = parseInt(document.getElementById('telekomTvOffer_ON_DEMAND').value) || 0;
    payload.telekomTvOffer_Unknown = parseInt(document.getElementById('telekomTvOffer_Unknown').value) || 0;
    payload.interiorQual_luxury = parseInt(document.getElementById('interiorQual_luxury').value) || 0;
    payload.interiorQual_normal = parseInt(document.getElementById('interiorQual_normal').value) || 1;
    payload.interiorQual_simple = parseInt(document.getElementById('interiorQual_simple').value) || 0;
    payload.interiorQual_sophisticated = parseInt(document.getElementById('interiorQual_sophisticated').value) || 0;

    // Pets Allowed
    payload.petsAllowed_negotiable = parseInt(document.getElementById('petsAllowed_negotiable').value) || 0;
    payload.petsAllowed_no = parseInt(document.getElementById('petsAllowed_no').value) || 1;
    payload.petsAllowed_yes = parseInt(document.getElementById('petsAllowed_yes').value) || 0;

    try {
        const response = await fetch('https://deutsch-immo-vision-apartment-price.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json()
        console.log("Response Body:", result);
        if (!response.ok) throw new Error("Prediction failed!");

        console.log(result.prediction)
        document.getElementById('result').innerHTML = `<p>Predicted Price: €${result.prediction.toFixed(2)}</p>`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('result').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
});

// Fetch the hierarchy data from the API
async function fetchHierarchyData() {
    try {
        const response = await fetch('https://deutsch-immo-vision-apartment-price.onrender.com/hierarchy'); // Replace with the actual endpoint URL
        const data = await response.json();

        populateStates(data.hierarchy);
    } catch (error) {
        console.error("Failed to fetch hierarchy data:", error);
    }
}

// Populate the states in regio1 dropdown
function populateStates(data) {
    const regio1Dropdown = document.getElementById('regio1');
    regio1Dropdown.innerHTML = '<option value="">Select State</option>';

    console.log("Data: ", data)
    data.forEach(state => {
        const option = document.createElement('option');
        option.value = state.name;
        option.text = state.name;
        regio1Dropdown.appendChild(option);
    });

    regio1Dropdown.addEventListener('change', () => {
        const selectedState = data.find(state => state.name === regio1Dropdown.value);
        populateCities(selectedState);
    });
}

// Populate cities based on selected state
function populateCities(state) {
    const regio2Dropdown = document.getElementById('regio2');
    regio2Dropdown.innerHTML = '<option value="">Select City</option>';

    state.cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.text = city.name;
        regio2Dropdown.appendChild(option);
    });

    regio2Dropdown.addEventListener('change', () => {
        const selectedCity = state.cities.find(city => city.name === regio2Dropdown.value);
        populateStreets(selectedCity);
    });
}

// Populate streets based on selected city
function populateStreets(city) {
    const regio3Dropdown = document.getElementById('regio3');
    regio3Dropdown.innerHTML = '<option value="">Select Street</option>';

    city.streets.forEach(street => {
        const option = document.createElement('option');
        option.value = street.name;
        option.text = street.name;
        regio3Dropdown.appendChild(option);
    });
}

// Call fetchHierarchyData on page load
document.addEventListener('DOMContentLoaded', fetchHierarchyData);
