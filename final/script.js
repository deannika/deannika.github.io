// Load all car makes into dropdown on index.html
async function loadMakes() {

    const url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";

    const response = await fetch(url);
    const data = await response.json();

    var results = data.Results;

    var dropdown = document.getElementById("makeDropdown");
    dropdown.innerHTML = "";

    // Add each make as an option
    for (var i = 0; i < results.length; i++) {
        dropdown.innerHTML += "<option>" + results[i].Make_Name + "</option>";
    }
}

// When button clicked → go to models page
function goToModels() {
    var make = document.getElementById("makeDropdown").value;
    window.location.href = "models.html?make=" + make;
}

// Load models for selected make on models.html
async function loadModels() {

    // Read make name from URL
    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    // Set title
    document.getElementById("makeTitle").innerHTML = "Models for: " + make;

    // Fetch models
    const url = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/" + make + "?format=json";

    const response = await fetch(url);
    const data = await response.json();

    var results = data.Results;

    var table = document.getElementById("modelsTable");
    table.innerHTML = "";

    // Add rows to table
    for (var i = 0; i < results.length; i++) {
        table.innerHTML +=
            "<tr>" +
                "<td>" + results[i].Model_Name + "</td>" +
                "<td>" + results[i].Model_ID + "</td>" +
                "<td>" + results[i].Make_ID + "</td>" +
            "</tr>";
    }
}