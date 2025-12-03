// Load modern car makes (2020–2024 only)
async function loadMakes() {
    var dropdown = document.getElementById("makeDropdown");
    var message = document.getElementById("makeMessage");

    if (!dropdown) return;

    dropdown.innerHTML = "<option>Loading modern car makes...</option>";
    if (message) message.innerHTML = "";

    try {
        // Choose any modern year (change 2020 to 2021/2022/2023/2024 if you want)
        var url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?year=2020&format=json";

        var response = await fetch(url);
        var data = await response.json();
        var results = data.Results;

        // Clear dropdown and add default option
        dropdown.innerHTML = "<option value=''>-- Select a modern make --</option>";

        // Add each modern make
        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make_Name;
            dropdown.innerHTML += "<option value='" + makeName + "'>" + makeName + "</option>";
        }

    } catch (error) {
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) message.innerHTML = "Could not load modern makes.";
    }
}
// the site would keep crashing if I did all the cars so I had to slim the choices down