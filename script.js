// Add Sensor Functionality
document.getElementById('addSensorBtn').addEventListener('click', addNewSensor);

function addNewSensor() {
    const sensorName = prompt('Enter sensor name:');
    if (sensorName) {
        const sensorBlock = document.createElement('div');
        sensorBlock.className = 'sensor-block';
        
        // Generate random values for demonstration
        const randomValue = (Math.random() * 50 + 20).toFixed(1) + "°C";
        const randomCharge = Math.floor(Math.random() * 100);
        
        sensorBlock.innerHTML = `
            <p class="sensor-name">${sensorName}</p>
            <p class="sensor-value">${randomValue}</p>
            <p class="sensor-charge">Charge: ${randomCharge}%</p>
        `;
        
        document.getElementById('sensorsContainer').appendChild(sensorBlock);
    }
}

// Documentation Section Functionality
document.getElementById('exportSheetBtn').addEventListener('click', () => {
    alert('Exporting data as a sheet...');
    // Add logic to export as a sheet (e.g., CSV or Excel)
});

document.getElementById('exportPdfBtn').addEventListener('click', () => {
    alert('Exporting data as a PDF...');
    // Add logic to export as a PDF
});

document.getElementById('sendReportBtn').addEventListener('click', () => {
    const feedback = document.getElementById('feedbackTextarea').value;
    if (feedback.trim()) {
        alert('Feedback sent successfully!');
        document.getElementById('feedbackTextarea').value = ''; // Clear textarea
    } else {
        alert('Please enter feedback before sending.');
    }
});




// Get references to the section elements by their IDs
const control_panel    = document.getElementById("control_panel_section1");
const document_section = document.getElementById("documentation_section2");
const device_sensors   = document.getElementById("devices_sensors_section3");
const soil_data        = document.getElementById("soil_data_section4");
const profile_login    = document.getElementById("profile_and_login_section5");

// Set the initial state: show control panel, hide the rest
control_panel.style.display    = "block";
document_section.style.display = "none";
device_sensors.style.display   = "none";
soil_data.style.display        = "none";
profile_login.style.display    = "none";

// Get all the navigation buttons
const navButtons = document.querySelectorAll(".nav-btn");

// Add click event listeners to each navigation button
navButtons.forEach(button => {
  button.addEventListener("click", function() {
    // Retrieve the data-section attribute value of the clicked button
    const section = this.getAttribute("data-section");

    // Use if/else statements to show the corresponding section and hide the others
    if (section === "section1") {
      control_panel.style.display    = "block";
      document_section.style.display = "none";
      device_sensors.style.display   = "none";
      soil_data.style.display        = "none";
      profile_login.style.display    = "none";
    } else if (section === "section2") {
      control_panel.style.display    = "none";
      document_section.style.display = "block";
      device_sensors.style.display   = "none";
      soil_data.style.display        = "none";
      profile_login.style.display    = "none";
    } else if (section === "section3") {
      control_panel.style.display    = "none";
      document_section.style.display = "none";
      device_sensors.style.display   = "block";
      soil_data.style.display        = "none";
      profile_login.style.display    = "none";
    } else if (section === "section4") {
      control_panel.style.display    = "none";
      document_section.style.display = "none";
      device_sensors.style.display   = "none";
      soil_data.style.display        = "block";
      profile_login.style.display    = "none";
    } else if (section === "section5") {
      control_panel.style.display    = "none";
      document_section.style.display = "none";
      device_sensors.style.display   = "none";
      soil_data.style.display        = "none";
      profile_login.style.display    = "block";
    }
  });
});


/// firebase
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyBm_VvF1OJrLzb010ImgxVaCt7izUK382Q",
    authDomain: "ledtest-7d77d.firebaseapp.com",
    databaseURL: "https://ledtest-7d77d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ledtest-7d77d",
    storageBucket: "ledtest-7d77d.firebasestorage.app",
    messagingSenderId: "93448662040",
    appId: "1:93448662040:web:d6cecc8ed85fc9e295676d",
    measurementId: "G-383K6DK0HY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global variables to store the data
var nitrogenValue, phosphorusValue, potassiumValue, phValue;

function readValues() {
    var database = firebase.database();
    var ref = database.ref('sensors');
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        nitrogenValue = data.Nitrogen;
        phosphorusValue = data.Phosphorus;
        potassiumValue = data.Potassium;
        phValue = data.ph;



document.getElementById("nitrogen_sensor_read").innerHTML = nitrogenValue;
document.getElementById("Phosphorus_sensor_read").textContent = phosphorusValue;
document.getElementById("Potassium_sensor_read").textContent = potassiumValue;
document.getElementById("ph_sensor_read").innerHTML = phValue;

/////////////////// soil nutrient calc
const organicCarbonResult = organic_Carbon(nitrogenValue);
const zincResult = zinc(phValue);
const magnesiumResult = magnesium(phValue);
const calciumResult = calcium(phValue);
const copperResult = copper(phValue);
const ironResult = iron(phValue);
const siliconResult = silicon(phValue);
const boronResult = boron(phValue);
const molybdenumResult = molybdenum(phValue);

function organic_Carbon(nitrogen) {
    return nitrogen === 0 ? 0 : 0.77 * nitrogen;
}
function zinc(ph) {
    return ph === 0 ? 0 : 10 - (1.7 * ph);
}
function magnesium(ph) {
    return ph === 0 ? 0 : 70 + (17 * ph);
}
function calcium(ph) {
    return ph === 0 ? 0 : 700 + (70 * ph);
}
function copper(ph) {
    return ph === 0 ? 0 : 7 - (0.4 * ph);
}
function iron(ph) {
    return ph === 0 ? 0 : 77 - (7.7 * ph);
}
function silicon(ph) {
    return ph === 0 ? 0 : 70 + (10 * ph);
}
function boron(ph) {
    return ph === 0 ? 0 : 1.7 - (0.7 * ph);
}
function molybdenum(ph) {
    return ph === 0 ? 0 : 0.01 + (0.007 * ph);
}


/////////////
document.getElementById("Nutrientcalculator").innerHTML = `<p><strong>Nitrogen:</strong> ${nitrogenValue}</p>
            <p><strong>Phosphorus:</strong> ${phosphorusValue}</p>
            <p><strong>Potassium:</strong> ${potassiumValue}</p>`
            ////
            document.getElementById("Nutrientcalculator_primary").innerHTML = `<p><strong>Magbesiunm:</strong> ${magnesiumResult}</p>
            <p><strong>Calcium:</strong> ${calciumResult}</p>
        `
            /////
            document.getElementById("Nutrientcalculator_micro").innerHTML = `<p><strong>Zinc:</strong> ${zincResult}</p>
            <p><strong>Copper:</strong> ${copperResult}</p>
            <p><strong>Iron:</strong> ${ironResult}</p>
            <p><strong>Molybdenum::</strong> ${molybdenumResult}</p>
            <p><strong>Boron:</strong> ${boronResult}</p>`
            /////
            document.getElementById("Nutrientcalculator_others").innerHTML = `<p><strong>silicon:</strong> ${siliconResult}</p>
            <p><strong>Organic Carbon:</strong> ${organicCarbonResult}</p>`
            ///
            document.getElementById("phVal").innerHTML=phValue;


////////////////////////
    });
}

