// load all the makes (brands) into the dropdown
async function loadCarBrands() {

    let dd = document.getElementById("makeDropdown");
    let msg = document.getElementById("makeMessage");

    if (!dd) return;

    dd.innerHTML = "<option>Loading...</option>";
    if (msg) msg.textContent = "";

    // just my personal “allowed” brands list (kept same)
    const okList = [
        "ACURA","ALFA ROMEO","ASTON MARTIN","AUDI","BENTLEY","BMW","BUICK",
        "CADILLAC","CHEVROLET","CHRYSLER","DODGE","FERRARI","FIAT",
        "FORD","GENESIS","GMC","HONDA","HYUNDAI","INFINITI","JAGUAR",
        "JEEP","KIA","LAMBORGHINI","LAND ROVER","LEXUS","LINCOLN",
        "LOTUS","LUCID","MASERATI","MAZDA","MCLAREN","MERCEDES-BENZ",
        "MINI","MITSUBISHI","NISSAN","POLESTAR","PORSCHE","RAM",
        "RANGE ROVER","ROLLS-ROYCE","SUBARU","TESLA","TOYOTA","VOLKSWAGEN",
        "VOLVO"
    ];

    try {
        // basic fetch
        let api = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";
        let r = await fetch(api);
        let j = await r.json();

        let lst = j.Results;   // original list
        dd.innerHTML = "<option value=''>-- Select Make --</option>";

        let total = 0;

        // loop through all results and check if they match allowed brands
        for (let i = 0; i < lst.length; i++) {
            let nm = (lst[i].Make_Name || "").toUpperCase();

            // quick check through okList
            if (okList.indexOf(nm) !== -1) {
                // adding option the “old school” way
                dd.innerHTML += "<option value='" + nm + "'>" + nm + "</option>";
                total++;
            }
        }

        if (msg) msg.textContent = "Loaded " + total + " brands.";

    } catch (err) {
        console.log("failed brands:", err);
        dd.innerHTML = "<option>Error</option>";
        if (msg) msg.textContent = "Couldn't load car makes.";
    }
}


// go to the models page
function goPickModels() {
    let dd = document.getElementById("makeDropdown");
    if (!dd) return;

    let v = dd.value;

    if (!v) {
        alert("Pick something first.");
        return;
    }

    // direct move to the page
    window.location = "models.html?make=" + encodeURIComponent(v);
}



// --------------- Models Page Stuff --------------------

let modelBuffer = [];   // stores current model results
let nameAsc = true;
let idAsc = true;
let makeIdAsc = true;


// rebuilds the model table each time
function drawModels(arr) {
    let t = document.getElementById("modelsTable");
    if (!t) return;

    t.innerHTML = "";

    for (let i = 0; i < arr.length; i++) {
        let m = arr[i];
        let nm = m.Model_Name || "N/A";
        let mid = m.Model_ID || "N/A";
        let mkid = m.Make_ID || "N/A";

        t.innerHTML += `
            <tr>
                <td>${nm}</td>
                <td>${mid}</td>
                <td>${mkid}</td>
            </tr>
        `;
    }
}



// load the models for the chosen make
async function loadModels() {

    let q = new URLSearchParams(window.location.search);
    let mk = q.get("make");

    let header = document.getElementById("makeTitle");
    let msg = document.getElementById("modelsMessage");

    if (!mk) {
        if (header) header.textContent = "No make selected.";
        return;
    }

    if (header) header.textContent = "Current Models for: " + mk;
    if (msg) msg.textContent = "Loading...";

    try {
        // attempt with year 2024 first
        let url1 = "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
                    mk + "/modelyear/2024?format=json";

        let r1 = await fetch(url1);
        let j1 = await r1.json();

        let arr = j1.Results;

        // fallback to generic endpoint
        if (!arr || arr.length === 0) {
            let fallback = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/" +
                           mk + "?format=json";

            let r2 = await fetch(fallback);
            let j2 = await r2.json();
            arr = j2.Results;
        }

        modelBuffer = arr;     // save results
        drawModels(arr);       // initial draw

        if (msg) msg.textContent = "Found " + arr.length + " models.";

    } catch (e) {
        console.log("model load error:", e);
        if (msg) msg.textContent = "Error loading models.";
    }
}



// search bar filtering
function filterModels() {
    let box = document.getElementById("modelSearch");
    let msg = document.getElementById("modelsMessage");
    if (!box) return;

    let term = box.value.toLowerCase();
    let out = [];

    for (let i = 0; i < modelBuffer.length; i++) {
        let nm = (modelBuffer[i].Model_Name || "").toLowerCase();
        if (nm.indexOf(term) !== -1) {
            out.push(modelBuffer[i]);
        }
    }

    drawModels(out);

    if (msg) {
        msg.textContent = "Showing " + out.length + " of " + modelBuffer.length + " models.";
    }
}



// sorting
function sortModels(field) {

    if (modelBuffer.length === 0) return;

    if (field === "name") {
        modelBuffer.sort(function(a, b) {
            let av = (a.Model_Name || "").toLowerCase();
            let bv = (b.Model_Name || "").toLowerCase();
            if (av < bv) return nameAsc ? -1 : 1;
            if (av > bv) return nameAsc ? 1 : -1;
            return 0;
        });
        nameAsc = !nameAsc;
    }

    else if (field === "id") {
        modelBuffer.sort(function(a, b) {
            let av = Number(a.Model_ID) || 0;
            let bv = Number(b.Model_ID) || 0;
            if (av < bv) return idAsc ? -1 : 1;
            if (av > bv) return idAsc ? 1 : -1;
            return 0;
        });
        idAsc = !idAsc;
    }

    else if (field === "makeid") {
        modelBuffer.sort(function(a, b) {
            let av = Number(a.Make_ID) || 0;
            let bv = Number(b.Make_ID) || 0;
            if (av < bv) return makeIdAsc ? -1 : 1;
            if (av > bv) return makeIdAsc ? 1 : -1;
            return 0;
        });
        makeIdAsc = !makeIdAsc;
    }

    filterModels();  // reapply current search if any
}


// quick scroll to top
function scrollToTop() {
    window.scrollTo(0, 0);
}