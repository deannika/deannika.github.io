// Load modern car makes (2020–2024)
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading modern car makes...</option>";
    if (message) message.innerHTML = "";

    try {
        // Years we are combining
        var years = [2020, 2021, 2022, 2023, 2024];
        var allMakes = [];        

        // Fetch each year one at a time
        for (var i = 0; i < years.length; i++) {
            var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?year=" 
                      + years[i] + "&format=json";

            var response = await fetch(url);
            var data = await response.json();

            // Add all results to the list
            for (var j = 0; j < data.Results.length; j++) {
                allMakes.push(data.Results[j].Make_Name);
            }
        }

        // Remove duplicates by turning into a Set, then back to array
        var uniqueMakes = Array.from(new Set(allMakes));

        // Sort alphabetically
        uniqueMakes.sort();

        // Clear dropdown and add default
        dropdown.innerHTML = "<option value=''>-- Select a modern make --</option>";

        // Add all unique makes to dropdown
        for (var i = 0; i < uniqueMakes.length; i++) {
            dropdown.innerHTML += "<option value='" + uniqueMakes[i] + "'>" 
                + uniqueMakes[i] + "</option>";
        }

    } catch (error) {
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) message.innerHTML = "Could not load modern car brands.";
    }
}
// the site would keep crashing if I did all the cars so I had to slim the choices down