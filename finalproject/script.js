
// LOAD FILTERED 2024 MAKES

async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading...</option>";
    if (message) message.innerHTML = "";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";
        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;

        // Modern makes (clean)
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

        dropdown.innerHTML = "<option value=''>-- Select Make --</option>";

        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make_Name.toUpperCase();

            for (var j = 0; j < modernMakes.length; j++) {
                if (makeName === modernMakes[j]) {
                    dropdown.innerHTML += "<option value='" + makeName + "'>" + makeName + "</option>";
                }
            }
        }

        if (message) {
            message.innerHTML = "Loaded " + (dropdown.options.length - 1) + " modern makes.";
        }

    } catch (err) {
        console.log(err);
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) message.innerHTML = "Could not load makes.";
    }
}

// NAVIGATION

function goToModels() {
    var make = document.getElementById("makeDropdown").value;

    if (make === "") {
        alert("Please choose a maker first.");
        return;
    }

    window.location.href = "models.html?make=" + make;
}

// LOAD MODELS — with FALLBACK

async function loadModels() {
    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    var title = document.getElementById("makeTitle");
    var tableBody = document.getElementById("modelsTable");
    var message = document.getElementById("modelsMessage");

    title.innerHTML = "Models for: " + make;
    tableBody.innerHTML = "";
    if (message) message.innerHTML = "Loading models...";

    try {
        // Try 2024 models first
        var url2024 = 
          "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
          make + "/modelyear/2024?format=json";

        var response2024 = await fetch(url2024);
        var data2024 = await response2024.json();
        var results = data2024.Results;

        // If no 2024 results → FALLBACK to classic endpoint
        if (results.length === 0) {
            var fallbackUrl = 
              "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/" +
              make + "?format=json";

            var fallbackResponse = await fetch(fallbackUrl);
            var fallbackData = await fallbackResponse.json();
            results = fallbackData.Results;

            if (message) {
                message.innerHTML =
                    "⚠ No 2024 data found — showing all available models instead.";
            }
        } else {
            if (message) {
                message.innerHTML = "Loaded " + results.length + " models from 2024.";
            }
        }

        // Fill table
        for (var i = 0; i < results.length; i++) {
            var m = results[i];

            tableBody.innerHTML +=
                "<tr>" +
                    "<td>" + m.Model_Name + "</td>" +
                    "<td>" + (m.Model_ID || "N/A") + "</td>" +
                    "<td>" + (m.Make_ID || "N/A") + "</td>" +
                "</tr>";
        }

    } catch (err) {
        console.log(err);
        if (message) message.innerHTML = "Error loading models.";
    }
}