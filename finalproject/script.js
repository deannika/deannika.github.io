// Load ONLY 2024 modern car manufacturers
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading 2024 car makes...</option>";
    if (message) message.innerHTML = "";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForManufacturerAndYear/2024?format=json";

        var response = await fetch(url);
        var data = await response.json();
        var results = data.Results;

        dropdown.innerHTML = "<option value=''>-- Select a 2024 Make --</option>";

        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make;
            dropdown.innerHTML += "<option value='" + makeName + "'>" + makeName + "</option>";
        }

        if (message) {
            message.innerHTML = "Loaded " + results.length + " makes from 2024.";
        }

    } catch (error) {
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) {
            message.innerHTML = "Could not load 2024 makes.";
        }
    }
}

// Go to models page
function goToModels() {
    var make = document.getElementById("makeDropdown").value;

    if (make === "") {
        alert("Please select a car make.");
        return;
    }

    window.location.href = "models.html?make=" + encodeURIComponent(make);
}

// Load all models for selected make
async function loadModels() {
    var title = document.getElementById("makeTitle");
    var message = document.getElementById("modelsMessage");
    var tableBody = document.getElementById("modelsTable");

    if (!title) return;

    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    title.innerHTML = "Models for: " + make;
    if (message) message.innerHTML = "Loading models...";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformmake/" +
                  encodeURIComponent(make) + "?format=json";

        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;
        tableBody.innerHTML = "";

        for (var i = 0; i < results.length; i++) {
            var r = results[i];

            tableBody.innerHTML +=
                "<tr>" +
                  "<td>" + r.Model_Name + "</td>" +
                  "<td>" + r.Model_ID + "</td>" +
                  "<td>" + r.Make_ID + "</td>" +
                "</tr>";
        }

        if (message) {
            if (results.length === 0) {
                message.innerHTML = "No models found.";
            } else {
                message.innerHTML = "Found " + results.length + " models.";
            }
        }

    } catch (error) {
        if (message) message.innerHTML = "Error loading models.";
    }
}