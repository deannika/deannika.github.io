// GET 2024 MAKES (FILTERED)

async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return; // safety for models.html

    dropdown.innerHTML = "<option>Loading...</option>";
    if (message) message.innerHTML = "";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";
        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;

        // List of REAL modern brands (filtered for 2024)
        var modernMakes = [
            "ACURA","ALFA ROMEO","ASTON MARTIN","AUDI","BENTLEY","BMW","BUICK",
            "CADILLAC","CHEVROLET","CHRYSLER","DODGE","FERRARI","FIAT",
            "FORD","GENESIS","GMC","HONDA","HYUNDAI","INFINITI","JAGUAR",
            "JEEP","KIA","LAMBORGHINI","LAND ROVER","LEXUS","LINCOLN",
            "LOTUS","LUCID","MASERATI","MAZDA","MCLAREN","MERCEDES-BENZ",
            "MINI","MITSUBISHI","NISSAN","POLESTAR","PORSCHE","RAM",
            "RANGE ROVER","ROLLS-ROYCE","SUBARU","TESLA","TOYOTA","VOLKSWAGEN",
            "VOLVO"
        ];

        // Clear dropdown and insert filtered makes
        dropdown.innerHTML = "<option value=''>-- Select Make --</option>";

        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make_Name.toUpperCase();

            // If it's a modern 2024 brand
            for (var j = 0; j < modernMakes.length; j++) {
                if (makeName === modernMakes[j]) {
                    dropdown.innerHTML +=
                        "<option value='" + makeName + "'>" + makeName + "</option>";
                }
            }
        }

        if (message)
            message.innerHTML = "Loaded " + dropdown.options.length + " modern 2024 makes.";

    } catch (err) {
        if (message) message.innerHTML = "Error loading makes.";
        console.log(err);
    }
}

// GO TO MODELS PAGE

function goToModels() {
    var dropdown = document.getElementById("makeDropdown");
    var make = dropdown.value;

    if (make === "") {
        alert("Please select a make first.");
        return;
    }

    window.location.href = "models.html?make=" + make;
} 

// LOAD ONLY 2024 MODELS

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

    title.innerHTML = "Models for: " + make + " (2024)";
    tableBody.innerHTML = "";
    if (message) message.innerHTML = "Loading 2024 models...";

    try {
        // 🔥 **This endpoint ONLY returns 2024 models**
        var url =
            "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
            make +
            "/modelyear/2024?format=json";

        var response = await fetch(url);
        var data = await response.json();
        var results = data.Results;

        // Fill table
        for (var i = 0; i < results.length; i++) {
            var m = results[i];

            tableBody.innerHTML +=
                "<tr>" +
                "<td>" + m.Model_Name + "</td>" +
                "<td>" + m.Model_ID + "</td>" +
                "<td>" + m.Make_ID + "</td>" +
                "</tr>";
        }

        if (message)
            message.innerHTML = "Found " + results.length + " models.";

    } catch (err) {
        console.log(err);
        if (message) message.innerHTML = "Error loading models.";
    }
}