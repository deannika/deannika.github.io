//   PREVENT SCRIPT FROM RUNNING TWICE
if (window.scriptAlreadyLoaded) {
    console.log("Script already executed — stopping duplicate run.");
    return;
}
window.scriptAlreadyLoaded = true;

if (window.makesLoaded) {
    console.log("loadMakes() already ran — skipping second call.");
    return;
}
window.makesLoaded = true;

// Load all car makes into the dropdown on index.html
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) {
        // safety check: if this page doesn't have the dropdown, do nothing
        return;
    }

    dropdown.innerHTML = "<option>Loading makes...</option>";
    if (message) {
        message.innerHTML = "";
    }

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";
        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;

        // Clear and add a "choose" option
        dropdown.innerHTML = "<option value=\"\">-- Choose a make --</option>";

        // Simple for loop (no fancy methods)
        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make_Name;
            dropdown.innerHTML += "<option value=\"" + makeName + "\">" + makeName + "</option>";
        }

        if (message) {
            message.innerHTML = "Loaded " + results.length + " makes from the car API.";
        }
    } catch (error) {
        console.log("Error loading makes:", error);
        dropdown.innerHTML = "<option value=\"\">(Could not load makes)</option>";
        if (message) {
            message.innerHTML = "There was a problem talking to the API. Please refresh the page.";
        }
    }
}

// When the button is clicked on index.html, go to the models page
function goToModels() {
    var dropdown = document.getElementById("makeDropdown");
    if (!dropdown) {
        return;
    }

    var make = dropdown.value;

    if (make === "") {
        alert("Please choose a car make first.");
        return;
    }

    // encode the make so spaces etc. are safe in the URL
    var encodedMake = encodeURIComponent(make);
    window.location.href = "models.html?make=" + encodedMake;
}

// Load all models for the selected make on models.html
async function loadModels() {
    var title = document.getElementById("makeTitle");
    var message = document.getElementById("modelsMessage");
    var tableBody = document.getElementById("modelsTable");

    if (!title || !tableBody) {
        // not on models page
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    if (!make) {
        title.innerHTML = "No make selected";
        if (message) {
            message.innerHTML = "Please go back and choose a car make on the first page.";
        }
        return;
    }

    title.innerHTML = "Models for: " + make;
    if (message) {
        message.innerHTML = "Loading models...";
    }

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/" +
                  encodeURIComponent(make) + "?format=json";

        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;
        tableBody.innerHTML = "";

        for (var i = 0; i < results.length; i++) {
            var model = results[i];
            var rowHtml =
                "<tr>" +
                    "<td>" + model.Model_Name + "</td>" +
                    "<td>" + model.Model_ID + "</td>" +
                    "<td>" + model.Make_ID + "</td>" +
                "</tr>";
            tableBody.innerHTML += rowHtml;
        }

        if (message) {
            if (results.length === 0) {
                message.innerHTML = "No models were returned for this make.";
            } else {
                message.innerHTML = "Found " + results.length + " models.";
            }
        }
    } catch (error) {
        console.log("Error loading models:", error);
        if (message) {
            message.innerHTML = "There was a problem loading the models. Please try again.";
        }
    }
}