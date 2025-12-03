// REAL 2024 CAR MAKES (FILTERED)
const realMakes2024 = [
    "ACURA", "ALFA ROMEO", "AUDI", "BMW", "BUICK", "CADILLAC",
    "CHEVROLET", "CHRYSLER", "DODGE", "FERRARI", "FIAT", "FORD",
    "GENESIS", "GMC", "HONDA", "HYUNDAI", "INFINITI", "JAGUAR",
    "JEEP", "KIA", "LAMBORGHINI", "LAND ROVER", "LEXUS", "LINCOLN",
    "MASERATI", "MAZDA", "MERCEDES-BENZ", "MINI", "MITSUBISHI",
    "NISSAN", "PORSCHE", "RAM", "SUBARU", "TESLA", "TOYOTA",
    "VOLKSWAGEN", "VOLVO"
];

// LOAD MAKES (FILTER + API)
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading makes...</option>";
    if (message) message.innerHTML = "";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/passenger%20car?format=json";

        var response = await fetch(url);
        var data = await response.json();
        var results = data.Results;

        dropdown.innerHTML = "<option value=''>-- Select a Make --</option>";

        let count = 0;

        for (var i = 0; i < results.length; i++) {
            var name = results[i].MakeName.toUpperCase();

            if (realMakes2024.includes(name)) {
                dropdown.innerHTML += `<option value="${name}">${name}</option>`;
                count++;
            }
        }

        message.innerHTML = "Loaded " + count + " modern car makes.";

    } catch (err) {
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) message.innerHTML = "Could not load makes.";
    }
}

// GO TO MODELS PAGE
function goToModels() {
    var dropdown = document.getElementById("makeDropdown");
    var make = dropdown.value;

    if (make === "") {
        alert("Please select a make.");
        return;
    }

    window.location.href = "models.html?make=" + encodeURIComponent(make);
}

// LOAD MODELS PAGE
async function loadModels() {
    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    var title = document.getElementById("makeTitle");
    var tableBody = document.getElementById("modelsTable");
    var message = document.getElementById("modelsMessage");

    if (!make) {
        title.innerHTML = "No make selected.";
        return;
    }

    title.innerHTML = "Models for: " + make;

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformmake/" + make + "?format=json";
        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;

        tableBody.innerHTML = "";

        for (var i = 0; i < results.length; i++) {
            tableBody.innerHTML +=
                `<tr>
                    <td>${results[i].Model_Name}</td>
                    <td>${results[i].Model_ID}</td>
                    <td>${results[i].Make_ID}</td>
                </tr>`;
        }

        message.innerHTML = "Found " + results.length + " models.";

    } catch (err) {
        message.innerHTML = "Error loading models.";
    }
}