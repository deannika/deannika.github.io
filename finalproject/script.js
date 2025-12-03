// Load modern passenger car makes (fast + stable)
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading modern car makes...</option>";
    if (message) message.innerHTML = "";

    try {
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/passenger%20car?format=json";

        var response = await fetch(url);
        var data = await response.json();

        var results = data.Results;

        dropdown.innerHTML = "<option value=''>-- Select a Make --</option>";

        // The field here is MakeName (NOT Make, NOT Make_Name)
        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].MakeName;
            dropdown.innerHTML += "<option value='" + makeName + "'>" + makeName + "</option>";
        }

        if (message) {
            message.innerHTML = "Loaded " + results.length + " modern car makes.";
        }

    } catch (err) {
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) {
            message.innerHTML = "Could not load car makes.";
        }
    }
}