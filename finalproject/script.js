// load all the makes (brands) into the dropdown
async function loadCarBrands() {
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

        var count = 0;

        for (var i = 0; i < results.length; i++) {
            var makeName = results[i].Make_Name.toUpperCase();

            for (var j = 0; j < modernMakes.length; j++) {
                if (makeName === modernMakes[j]) {
                    dropdown.innerHTML +=
                        "<option value='" + makeName + "'>" + makeName + "</option>";
                    count++;
                    break;
                }
            }
        }

        if (message) {
            message.innerHTML = "Loaded " + count + " modern car makes.";
        }

    } catch (err) {
        console.log(err);
        dropdown.innerHTML = "<option>Error loading makes</option>";
        if (message) message.innerHTML = "Could not load car makes.";
    }
}


// go to the models page
function goPickModels() {
    var dropdown = document.getElementById("makeDropdown");
    if (!dropdown) return;

    var make = dropdown.value;

    if (make === "") {
        alert("Please select a make first.");
        return;
    }

    window.location.href = "models.html?make=" + make;
}



var currentModels = [];
var sortNameAsc = true;
var sortIdAsc = true;
var sortMakeIdAsc = true;


// rebuilds the model table
function drawModels(list) {
    var tableBody = document.getElementById("modelsTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    for (var i = 0; i < list.length; i++) {
        var m = list[i];

        var modelName = m.Model_Name || "N/A";
        var modelId = m.Model_ID || "N/A";
        var makeId = m.Make_ID || "N/A";

        tableBody.innerHTML +=
            "<tr>" +
                "<td>" + modelName + "</td>" +
                "<td>" + modelId + "</td>" +
                "<td>" + makeId + "</td>" +
            "</tr>";
    }
}



// load the car models
async function loadCarModels() {
    var params = new URLSearchParams(window.location.search);
    var make = params.get("make");

    var title = document.getElementById("makeTitle");
    var message = document.getElementById("modelsMessage");

    if (!make) {
        if (title) title.innerHTML = "No make selected.";
        return;
    }

    if (title) {
        title.innerHTML = "Current Models for: " + make;
    }

    if (message) {
        message.innerHTML = "Loading models...";
    }

    try {
        var url2024 =
            "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
            make + "/modelyear/2024?format=json";

        var response2024 = await fetch(url2024);
        var data2024 = await response2024.json();
        var results = data2024.Results;

        if (results.length === 0) {
            var fallbackUrl =
                "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformmake/" +
                make + "?format=json";

            var fallbackResponse = await fetch(fallbackUrl);
            var fallbackData = await fallbackResponse.json();
            results = fallbackData.Results;
        }

        currentModels = results;
        drawModels(currentModels);

        if (message) {
            message.innerHTML = "Found " + currentModels.length + " models.";
        }

    } catch (err) {
        console.log(err);
        if (message) message.innerHTML = "Error loading models.";
    }
}



// search bar
function searchModels() {
    var input = document.getElementById("modelSearch");
    var message = document.getElementById("modelsMessage");
    if (!input) return;

    var term = input.value.toLowerCase();
    var filtered = [];
    var total = currentModels.length;

    for (var i = 0; i < currentModels.length; i++) {
        var name = currentModels[i].Model_Name || "";
        if (name.toLowerCase().indexOf(term) !== -1) {
            filtered.push(currentModels[i]);
        }
    }

    drawModels(filtered);

    if (message) {
        message.innerHTML = "Showing " + filtered.length + " of " + total + " models.";
    }
}



// sorting
function sortModelList(field) {
    if (currentModels.length === 0) return;

    if (field === "name") {
        currentModels.sort(function(a, b) {
            var av = (a.Model_Name || "").toLowerCase();
            var bv = (b.Model_Name || "").toLowerCase();
            if (av < bv) return sortNameAsc ? -1 : 1;
            if (av > bv) return sortNameAsc ? 1 : -1;
            return 0;
        });
        sortNameAsc = !sortNameAsc;
    }

    else if (field === "id") {
        currentModels.sort(function(a, b) {
            var av = Number(a.Model_ID) || 0;
            var bv = Number(b.Model_ID) || 0;
            if (av < bv) return sortIdAsc ? -1 : 1;
            if (av > bv) return sortIdAsc ? 1 : -1;
            return 0;
        });
        sortIdAsc = !sortIdAsc;
    }

    else if (field === "makeid") {
        currentModels.sort(function(a, b) {
            var av = Number(a.Make_ID) || 0;
            var bv = Number(b.Make_ID) || 0;
            if (av < bv) return sortMakeIdAsc ? -1 : 1;
            if (av > bv) return sortMakeIdAsc ? 1 : -1;
            return 0;
        });
        sortMakeIdAsc = !sortMakeIdAsc;
    }

    searchModels();
}



// scroll back to top
function goBackToTop() {
    window.scrollTo(0, 0);
}