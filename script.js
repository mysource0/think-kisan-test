// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { serverTimestamp, getFirestore, getDoc, collection, setDoc, getDocs, doc as docRef } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// nav buttons

// let nav_last_recent_button = document.getElementById("last_recent_updated_section");
//let nav_search_operation_button = document.getElementById("search_results_section");
// let nav_database_reading_operations_button = document.getElementById("range_data_operations");

// nav_last_recent_button.style.display="block";
// nav_search_operation_button.style.display="none";
// nav_database_reading_operations_button.style.display="none"

// function displayLastRecentData(){
//   if(nav_last_recent_button.style.display=="none"){
//     nav_last_recent_button.style.display="block";
//     nav_search_operation_button.style.display="none";
//     nav_database_reading_operations_button.style.display="none"
//   }
// }

// function showdatabaseoperations(){
//   if(nav_database_reading_operations_button.style.display=="none"){
//     nav_database_reading_operations_button.style.display="block";
//     nav_last_recent_button.style.display="none";  // Fixed typo here
//     nav_search_operation_button.style.display="none";
//   }
// }
// document.addEventListener("DOMContentLoaded", function () {
//   window.showpdfgenerator = function () {
//     if(document.getElementById("pdfgeneratingsection").style.display == "none"){
//       document.getElementById("pdfgeneratingsection").style.display = "block";
//       document.getElementById("last_recent_updated_section").style.display = "none";
//       document.getElementById("range_data_operations").style.display = "none";
//     }
    
//   };
// });


// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBfUMZZyYlA7WcpwlLeM3KbtxhBsmJ_3N8",
  authDomain: "thinksong-b4086.firebaseapp.com",
  databaseURL: "https://thinksong-b4086-default-rtdb.asia-southeast1.firebasedatabase.app", // Updated URL
  projectId: "thinksong-b4086",
  storageBucket: "thinksong-b4086.firebasestorage.app",
  messagingSenderId: "68241922299",
  appId: "1:68241922299:web:a0d329ee7c3e741f18b85e",
  measurementId: "G-1QJ8HTK9N9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtimeDb = getDatabase(app); 






    // Function to Read and Update Battery Values
    function readValues() {
      // Use realtimeDb instead of database
      const receiverRef = ref(realtimeDb, 'receiver_battery_percentage/value');
      const transmitterRef = ref(realtimeDb, 'transmitter_battery_percentage/value');
    
      onValue(receiverRef, (snapshot) => {
        document.getElementById('receiverBattery').textContent = snapshot.val();
      });
    
      onValue(transmitterRef, (snapshot) => {
        document.getElementById('transmitterBattery').textContent = snapshot.val();
      });
    }
    document.addEventListener('DOMContentLoaded', () => {
      displayLastRecentData();
      readValues(); // 👈 ADD THIS LINE TO INITIALIZE BATTERY LISTENERS
    });


// Function to fetch and display All sensor data
const complete_database = document.getElementById("complete_database_data");
complete_database.style.display="none";
export async function getSensorData() {
  // Get the container for displaying complete database data
  let dataContainer = document.getElementById("complete_database_data");
  if(dataContainer.style.display == "none"){
        dataContainer.style.display = "block"
        document.getElementById("entire_db_button").textContent = "close database"
    }
    else{
        dataContainer.style.display = "none"

        document.getElementById("entire_db_button").textContent = "Show Entire Data In DataBase"
    }
  try {
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    dataContainer.innerHTML = ""; // Clear previous data

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert the document ID (assumed to be epoch in seconds) to a local date string
      const time_convert = new Date(parseInt(doc.id, 10) * 1000).toLocaleString();

      const dataHtml = `
        <div class="data-card">
          <h3>Sensor ID: ${doc.id} [<i>recorded at</i>] ${time_convert}</h3>
          <p><strong>Moisture:</strong> ${data.Moisture}</p>
          <p><strong>Temperature:</strong> ${data.Temperature}°C</p>
          <p><strong>pH:</strong> ${data.pH}</p>
          <p><strong>Nitrogen:</strong> ${data.Nitrogen}</p>
          <p><strong>Phosphorus:</strong> ${data.Phosphorus}</p>
          <p><strong>Potassium:</strong> ${data.Potassium}</p>
          <p><strong>Electrical Conductivity:</strong> ${data.Electrical_Conductivity}</p>
          <p><strong>RSSI:</strong> ${data.RSSI}</p>
          <p><strong>Timestamp:</strong> ${data.Timestamp}</p>
        </div>
      `;
      dataContainer.innerHTML += dataHtml;
    });
  } catch (error) {
    dataContainer.innerHTML = `Error fetching data: ${error}`;
    console.error("Error fetching data:", error);
  }
}

// Expose the function to the global scope so it can be called from the HTML button
window.getSensorData = getSensorData;

////


// Function to fetch & display the last recent data (highest doc.id as epoch)
// Function to fetch and display MOST RECENT sensor data
async function displayLastRecentData() {

  
    console.log("displayLastRecentData function triggered.");
    try {
      // Fetch all documents from the "SensorData" collection
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      console.log("Number of documents fetched:", querySnapshot.size);
  
      // Check if there are no documents
      if (querySnapshot.empty) {
        document.getElementById("lastRecentOutput").innerText = "No data found.";
        console.warn("QuerySnapshot is empty.");
        return;
      }
  
      let lastDoc = null;
      let maxEpoch = -Infinity;
  
      // Iterate over each document and check its ID as epoch
      querySnapshot.forEach((doc) => {
        const docEpoch = parseInt(doc.id, 10);
        if (isNaN(docEpoch)) {
          console.warn("Document ID is not a valid number (epoch):", doc.id);
          return; // skip this document
        }
        console.log("Document ID:", doc.id, "Epoch:", docEpoch);
        if (docEpoch > maxEpoch) {
          maxEpoch = docEpoch;
          lastDoc = doc;
        }
      });
  
      // Check if no valid document was found
      if (!lastDoc) {
        document.getElementById("lastRecentOutput").innerText = "No valid data found.";
        console.warn("No valid document with a numeric ID found.");
        return;
      }
  
      // Convert epoch to a readable local time
      const localTime = new Date(maxEpoch * 1000).toLocaleString();
      const data = lastDoc.data();
  
      console.log("Most recent document:", lastDoc.id, data);
  
      // Build the HTML table to display the data in a clean format
      document.getElementById("lastRecentOutput").innerHTML = `
        <h3>Most Recent Sensor Data</h3>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px;">Field</th>
              <th style="text-align: left; padding: 8px;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px;">Doc ID (Epoch)</td>
              <td style="padding: 8px;">${lastDoc.id}</td>
            </tr>
             <tr>
              <td style="padding: 8px;">Timestamp </td>
              <td style="padding: 8px;">${data.Timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Moisture</td>
              <td style="padding: 8px;">${data.Moisture}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Temperature</td>
              <td style="padding: 8px;">${data.Temperature}°C</td>
            </tr>
            <tr>
              <td style="padding: 8px;">pH</td>
              <td style="padding: 8px;">${data.pH}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Nitrogen</td>
              <td style="padding: 8px;">${data.Nitrogen}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Phosphorus</td>
              <td style="padding: 8px;">${data.Phosphorus}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Potassium</td>
              <td style="padding: 8px;">${data.Potassium}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Electrical Conductivity</td>
              <td style="padding: 8px;">${data.Electrical_Conductivity}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">RSSI</td>
              <td style="padding: 8px;">${data.RSSI}</td>
            </tr>

          </tbody>
        </table>
      `;
    } catch (error) {
      console.error("Error fetching last recent data:", error);
      document.getElementById("lastRecentOutput").innerText = "Error loading data.";
    }
  }
  
  // Attach the function to DOMContentLoaded so it runs once the DOM is ready
  document.addEventListener('DOMContentLoaded', displayLastRecentData);
  

//////////////// range data and operations
// --- Assuming Firebase is already imported and initialized ---
// e.g., 
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

/**
 * Fetches sensor data within a specified date range.
 * Assumes the document IDs in "SensorData" are epoch timestamps (in seconds).
 */
let date_range_data_block = document.getElementById("last_date_range_data");
date_range_data_block.style.display="none";

async function fetchRangeData() {

 // let dataContainer = document.getElementById("last_date_range_data");
  if(date_range_data_block.style.display=="none"){
    date_range_data_block.style.display="block";
    document.getElementById("last_date_data_button").textContent="close data"
  }
  else{
    date_range_data_block.style.display="none";
    document.getElementById("last_date_data_button").textContent="fetch data"

  }
  // Get the input values for start and end date
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;

  if (!startDateInput || !endDateInput) {
    document.getElementById("last_date_range_data").innerText = "Please enter both start and end date/time.";
    return;
  }

  // Convert input date strings to epoch (in seconds)
  const startEpoch = Math.floor(new Date(startDateInput).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endDateInput).getTime() / 1000);

  try {
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    const results = [];

    // Filter documents based on doc.id (epoch)
    querySnapshot.forEach(doc => {
      const docEpoch = parseInt(doc.id, 10);
      if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
        results.push({ id: doc.id, data: doc.data() });
      }
    });

    let html = "";
    if (results.length === 0) {
      html = "<p>No records found in the selected range.</p>";
    } else {
      html += `<h3>Records from ${new Date(startEpoch * 1000).toLocaleString()} to ${new Date(endEpoch * 1000).toLocaleString()}</h3>`;
      // Loop through each record and create an outlined block for it
      results.forEach(rec => {
        html += `
          <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;">
            <h4>Doc ID (Epoch): ${rec.id}</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>`;
        // Create a row for each key-value pair in the document data
        for (const key in rec.data) {
          if (rec.data.hasOwnProperty(key)) {
            html += `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${rec.data[key]}</td>
                  </tr>`;
          }
        }
        html += `
              </tbody>
            </table>
          </div>`;
      });
    }
    document.getElementById("last_date_range_data").innerHTML = html;
  } catch (error) {
    console.error("Error fetching range data:", error);
    document.getElementById("last_date_range_data").innerText = "Error fetching data.";
  }
}

// Expose the function to the global scope
window.fetchRangeData = fetchRangeData;

//////// Last N range of data
let n_range_data_block = document.getElementById("last_n_range_data");
n_range_data_block.style.display="none";

async function fetchLastNRangeData() {

  if(n_range_data_block.style.display=="none"){
    n_range_data_block.style.display="block";
    document.getElementById("last_n_range_data_button").textContent="close data"
  }
  else{
    n_range_data_block.style.display="none";

    document.getElementById("last_n_range_data_button").textContent="last N data"

  }


  const nRecords = parseInt(document.getElementById('nRecordsInput').value, 10);
  
  if (isNaN(nRecords) || nRecords <= 0) {
      document.getElementById("last_n_range_data").innerText = "Please enter a valid number of records.";
      return;
  }

  try {
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      const records = [];

      // Sort documents by ID (Epoch) in descending order
      querySnapshot.forEach(doc => {
          records.push({ id: doc.id, data: doc.data() });
      });

      records.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Newest first
      const lastNRecords = records.slice(0, nRecords);

      let html = "";
      if (lastNRecords.length === 0) {
          html = "<p>No records found.</p>";
      } else {
          html += `<h3>Last ${nRecords} Records</h3>`;
          lastNRecords.forEach(rec => {
              html += `
              <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;">
                  <h4>Doc ID (Epoch): ${rec.id}</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                      <tbody>`;
              for (const key in rec.data) {
                  if (rec.data.hasOwnProperty(key)) {
                      html += `
                      <tr>
                          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
                          <td style="padding: 8px; border: 1px solid #ddd;">${rec.data[key]}</td>
                      </tr>`;
                  }
              }
              html += `
                      </tbody>
                  </table>
              </div>`;
          });
      }
      document.getElementById("last_n_range_data").innerHTML = html;
  } catch (error) {
      console.error("Error fetching last N records:", error);
      document.getElementById("last_n_range_data").innerText = "Error fetching data.";
  }
}

// Expose function globally
window.fetchLastNRangeData = fetchLastNRangeData;

/// search document 
const search_results_section = document.getElementById("search_results_section");

// Assume db is already initialized
async function searchDocumentById() {
  search_results_section.style.display = "block";
  // Get the selected radio button
  const selectedRadio = document.querySelector('input[name="search-type"]:checked');
  if (!selectedRadio) {
    document.getElementById("search_results").innerHTML =
      "Please select a search type (Name, doc id, or Location).";
    return;
  }

  // Check if the selected type is "doc_id"
  if (selectedRadio.value === "doc_id") {
    // Get the search term (document ID)
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (!searchTerm) {
      document.getElementById("search_results").innerHTML =
        "Please enter a document ID to search.";
      return;
    }

    try {
      // Use docRef instead of doc
      const documentRef = docRef(db, "SensorData", searchTerm);
      const docSnap = await getDoc(documentRef);
      let html = "";
      
      if (!docSnap.exists()) {
        html = `<p>No record found with document ID "${searchTerm}".</p>`;
      } else {
        const data = docSnap.data();
        html += `<h3>Record for Document ID: ${searchTerm}</h3>`;
        html += `<table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th style="text-align:left; padding:8px;">Field</th>
                      <th style="text-align:left; padding:8px;">Value</th>
                    </tr>
                  </thead>
                  <tbody>`;

for (const key in data) {
  if (!data.hasOwnProperty(key)) continue;
  if (key === "SourceDocIDs") continue; // Skip the SourceDocIDs field
  html += `<tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">${key}</td>
            <td style="padding:8px; border:1px solid #ddd;">${data[key]}</td>
          </tr>`;
}


        }
        html += `</tbody></table>`;
      document.getElementById("search_results").innerHTML = html;
    } catch (error) {
      console.error("Error searching document by ID:", error);
      document.getElementById("search_results").innerText = "Data not found.";
    }
  } else {
    // For other search types, notify the user that only document ID search is supported.
    document.getElementById("search_results").innerHTML =
      "This search function currently supports document ID search only.";
  }
}

window.searchDocumentById = searchDocumentById;

const doc_updated_feedback_block = document.getElementById("doc_updated_feedback");
doc_updated_feedback_block.style.display = "none"; ///// document create feed back

document.addEventListener('DOMContentLoaded', () => {
  const range_operations_nav = document.getElementById("range_data_operations");
  const last_recent_updated_section = document.getElementById("last_recent_updated_section");

  
  // Set initial visibility
  range_operations_nav.style.display = "none";
  last_recent_updated_section.style.display = "block";
 

  window.display_db_reading_operations = function display_db_reading_operations() {
    last_recent_updated_section.style.display = "none";
    search_results_section.style.display = "none";
    document.getElementById("create_report_container").style.display = "none";
    doc_updated_feedback_block.style.display="none";
    document.getElementById("creationFeedback").style.display = "none";
    document.getElementById("inputFormContainer").style.display="none";
    // Use getComputedStyle if needed:
    if (window.getComputedStyle(range_operations_nav).display === "none") {
      range_operations_nav.style.display = "block";
    }
  };


  window.displayLastRecentData = function displayLastRecentData(){
    search_results_section.style.display = "none";
    range_operations_nav.style.display = "none";
    doc_updated_feedback_block.style.display="none";
    document.getElementById("creationFeedback").style.display = "none";
    document.getElementById("inputFormContainer").style.display="none";
   
    document.getElementById("create_report_container").style.display = "none";
    search_results_section.style.display = "none";
    if(window.getComputedStyle(last_recent_updated_section).display === "none"){
      last_recent_updated_section.style.display = "block";
    }
  };


  // Now you can call display_db_reading_operations() via a button click or other event.
});








// Toggle display of the create report container
function create_report() {
  document.getElementById("last_recent_updated_section").style.display="none";
  const container = document.getElementById("create_report_container");
  // Toggle visibility
  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
    document.getElementById("range_data_operations").style.display="none";
    

  } else {
    container.style.display = "none";
  }
}
window.create_report = create_report;

// Function to submit the report
// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Function to submit the report
  async function submitReport() {
    // Get input values
    const startDate = document.getElementById("reportStartDate").value;
    const endDate = document.getElementById("reportEndDate").value;
    const reportDocName = document.getElementById("reportDocName").value.trim();
    const location = document.getElementById("reportLocation").value.trim();

    // Use the feedback element
    doc_updated_feedback_block.style.display = "block"
    const feedbackEl = document.getElementById("doc_update_results");

    if (!startDate || !endDate || !reportDocName || !location) {
      feedbackEl.innerHTML = "Please fill in all fields.";
      return;
    }

    // Convert the date inputs to epoch (seconds)
    const startEpoch = Math.floor(new Date(startDate).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endDate).getTime() / 1000);

    try {
      // Query the SensorData collection for documents in the given date range
      const querySnapshot = await getDocs(collection(db, "SensorData"));
      const filteredDocs = [];
      querySnapshot.forEach(doc => {
        const docEpoch = parseInt(doc.id, 10);
        if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
          filteredDocs.push({ id: doc.id, data: doc.data() });
        }
      });

      if (filteredDocs.length === 0) {
        feedbackEl.textContent = "No sensor data found in the selected range.";
        return;
      }

      // Initialize sums for each numeric field (assume these fields are numbers)
      let sumMoisture = 0, sumTemperature = 0, sumPH = 0, sumNitrogen = 0, sumPhosphorus = 0, sumPotassium = 0, sumEC = 0, sumRSSI = 0;
      let count = 0;
      const sourceDocIDs = [];

      filteredDocs.forEach(rec => {
        const d = rec.data;
        sumMoisture += Number(d.Moisture) || 0;
        sumTemperature += Number(d.Temperature) || 0;
        sumPH += Number(d.pH) || 0;
        sumNitrogen += Number(d.Nitrogen) || 0;
        sumPhosphorus += Number(d.Phosphorus) || 0;
        sumPotassium += Number(d.Potassium) || 0;
        sumEC += Number(d.Electrical_Conductivity) || 0;
        sumRSSI += Number(d.RSSI) || 0;
        count++;
        sourceDocIDs.push(rec.id);
      });

      // Calculate averages
      const avgMoisture = (sumMoisture / count).toFixed(2);
      const avgTemperature = (sumTemperature / count).toFixed(2);
      const avgPH = (sumPH / count).toFixed(2);
      const avgNitrogen = (sumNitrogen / count).toFixed(2);
      const avgPhosphorus = (sumPhosphorus / count).toFixed(2);
      const avgPotassium = (sumPotassium / count).toFixed(2);
      const avgEC = (sumEC / count).toFixed(2);
      const avgRSSI = (sumRSSI / count).toFixed(2);

      // Build the report data object (excluding Timestamp and doc id as per requirements)
      const reportData = {
        Moisture: avgMoisture,
        Temperature: avgTemperature,
        pH: avgPH,
        Nitrogen: avgNitrogen,
        Phosphorus: avgPhosphorus,
        Potassium: avgPotassium,
        Electrical_Conductivity: avgEC,
        RSSI: avgRSSI,
        Location: location,
        SourceDocIDs: sourceDocIDs,
        ReportCreatedAt: new Date().toISOString(),
        ReportStartDate: startDate,
        ReportEndDate: endDate
      };

      // Create a new document in the "Reports" collection using the provided reportDocName
      await setDoc(docRef(db, "Reports", reportDocName), reportData);

      feedbackEl.textContent = "Report created successfully!";
      // Optionally, hide the container or clear inputs
      document.getElementById("create_report_container").style.display = "none";
    } catch (error) {
      console.error("Error creating report:", error);
      feedbackEl.textContent = "Error creating report. Please try again.";
    }
  }

  // Expose the function to the global scope
  window.submitReport = submitReport;
});



// Toggle the visibility of the input form
function toggleForm() {
  const formContainer = document.getElementById("inputFormContainer");

  if (!formContainer) {
    console.error("Form container not found.");
    return;
  }

  if (formContainer.style.display === "none" || formContainer.style.display === "") {
    formContainer.style.display = "block";
    hideSections([
      "last_recent_updated_section",
      "range_data_operations",
      "create_report_container",
      "search_results_section"
    ]);
  } else {
    formContainer.style.display = "none";
  }
}
window.toggleForm = toggleForm;

// Utility function to hide multiple sections
function hideSections(sectionIds) {
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.display = "none";
  });
}



// Function to create a new document in Firestore
async function createNewDocument() {
  const feedbackEl = document.getElementById("creationFeedback");
  const submitButton = document.getElementById("submitButton");

  if (!feedbackEl || !submitButton) {
    console.error("Missing required elements: creationFeedback or submitButton.");
    return;
  }

  submitButton.disabled = true;
  feedbackEl.textContent = "";

  // Retrieve input values
  const getInputValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : null;
  };

  const document_name = getInputValue("document_name");
  const location_name = getInputValue("location");
  const moisture = parseFloat(getInputValue("moisture"));
  const temperature = parseFloat(getInputValue("temperature"));
  const pH = parseFloat(getInputValue("pH"));
  const nitrogen = parseFloat(getInputValue("nitrogen"));
  const phosphorus = parseFloat(getInputValue("phosphorus"));
  const potassium = parseFloat(getInputValue("potassium"));
  const electricalConductivity = parseFloat(getInputValue("electricalConductivity"));
  const rssi = parseFloat(getInputValue("rssi"));
  const timestamp = getInputValue("timestamp");
  const remark = getInputValue("remark");

  if (!document_name || isNaN(moisture) || isNaN(temperature) || isNaN(pH) ||
      isNaN(nitrogen) || isNaN(phosphorus) || isNaN(potassium) ||
      isNaN(electricalConductivity) || isNaN(rssi) || !timestamp) {
    feedbackEl.textContent = "Please fill in all required fields correctly.";
    submitButton.disabled = false;
    return;
  }

  const docData = {
    Document_Name: document_name,
    Location_Data: location_name || "Unknown",
    Moisture: moisture,
    Temperature: temperature,
    pH: pH,
    Nitrogen: nitrogen,
    Phosphorus: phosphorus,
    Potassium: potassium,
    Electrical_Conductivity: electricalConductivity,
    RSSI: rssi,
    Timestamp: timestamp,
    Remark: remark || "No remarks"
  };

  try {
    // Use docRef (the alias) to create a reference
    await setDoc(docRef(db, "SensorData", document_name), docData);
    feedbackEl.textContent = "Document created successfully!";
    document.getElementById("inputFormContainer").style.display = "none";
  } catch (error) {
    console.error("Error creating document:", error);
    feedbackEl.textContent = "Error creating document. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
}
window.createNewDocument = createNewDocument;





///// pdf download
document.addEventListener('DOMContentLoaded', () => {
  // References to modal elements
  const exportModal = document.getElementById('exportModal');
  const exportForm = document.getElementById('exportForm');
  const exportInputs = document.getElementById('exportInputs');
  const exportBtn = document.getElementById('exportBtn');
  const closeExportModal = document.getElementById('closeExportModal');
  const exportError = document.getElementById('exportError');
  
  // PDF file name option handling
  const customPdfNameContainer = document.getElementById('customPdfNameContainer');
  const pdfNameOptions = document.querySelectorAll('input[name="pdfNameOption"]');
  pdfNameOptions.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'custom' && radio.checked) {
        customPdfNameContainer.style.display = 'block';
      } else {
        customPdfNameContainer.style.display = 'none';
      }
    });
  });
  
  // Function to update dynamic export inputs based on the selected export type
  function updateExportInputs() {
    const selectedType = document.querySelector('input[name="exportType"]:checked').value;
    exportInputs.innerHTML = ''; // Clear previous inputs
    
    if (selectedType === 'byId') {
      exportInputs.innerHTML = `
        <div>
          <label for="exportDocId">Document ID:</label>
          <input type="text" id="exportDocId" name="exportDocId" placeholder="Enter Document ID">
        </div>
      `;
    } else if (selectedType === 'lastN') {
      exportInputs.innerHTML = `
        <div>
          <label for="exportLastN">Number of Records (N):</label>
          <input type="number" id="exportLastN" name="exportLastN" placeholder="Enter number of records" min="1">
        </div>
      `;
    } else if (selectedType === 'dateRange') {
      exportInputs.innerHTML = `
        <div>
          <label for="exportStartDate">Start Date & Time:</label>
          <input type="datetime-local" id="exportStartDate" name="exportStartDate">
        </div>
        <div>
          <label for="exportEndDate">End Date & Time:</label>
          <input type="datetime-local" id="exportEndDate" name="exportEndDate">
        </div>
      `;
    }
  }
  
  // Listen for changes in export type selection
  const exportTypeRadios = document.querySelectorAll('input[name="exportType"]');
  exportTypeRadios.forEach(radio => {
    radio.addEventListener('change', updateExportInputs);
  });
  updateExportInputs(); // initialize with default selection
  
  // Sensor elements order with corresponding labels and units (excluding Timestamp)
  const sensorElements = [
    { key: 'Moisture', label: 'Moisture', unit: '%' },
    { key: 'Temperature', label: 'Temperature', unit: '°C' },
    { key: 'pH', label: 'pH', unit: 'No Units' },
    { key: 'Nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha' },
    { key: 'Phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha' },
    { key: 'Potassium', label: 'Potassium (K)', unit: 'kg/ha' },
    { key: 'Electrical_Conductivity', label: 'Electrical Conductivity (EC)', unit: 'dS/m' },
    { key: 'RSSI', label: 'RSSI', unit: 'dBm' }
  ];
  
  // Function to generate the PDF
  async function generatePDF() {
    const exportError = document.getElementById('exportError');
    exportError.textContent = '';
    exportError.style.color = 'inherit';

    // Validate all header fields using array method
    const requiredFields = [
        'headerName', 'headerNumber', 'headerLocation', 'headerMandal',
        'headerSoilType', 'headerState', 'headerSoilDensity', 'headerDateTested',
        'headerReportGenerated', 'headerCropType', 'headerEquipment'
    ];
    
    const missingFields = requiredFields.filter(id => {
        const el = document.getElementById(id);
        return !el || !el.value.trim();
    });

    if (missingFields.length > 0) {
        exportError.textContent = 'Please fill in all report header details.';
        return;
    }

    // Get field values using object destructuring
    const fieldValues = Object.fromEntries(requiredFields.map(id => {
        return [id.replace('header', ''), document.getElementById(id).value.trim()];
    }));

    // Generate PDF filename
    const pdfNameOption = document.querySelector('input[name="pdfNameOption"]:checked').value;
    let pdfFileName = pdfNameOption === 'default' 
        ? `${fieldValues.Name}_${fieldValues.Location}_${fieldValues.SoilType}.pdf`
        : document.getElementById('customPdfName').value.trim();

    if (!pdfFileName.toLowerCase().endsWith('.pdf')) {
        pdfFileName += '.pdf';
    }

    try {
        // Get sensor data based on export type
        const { tableRows, tableTitle } = await handleExportType();
        
        // Generate PDF content
        const pdfDoc = generatePdfDocument(fieldValues, tableRows, tableTitle);
        
        // Handle PDF saving with Android compatibility
        const pdfData = pdfDoc.output('datauristring');
        
        if (typeof AndroidBridge !== 'undefined') {
            // Android WebView handling
            const base64Data = pdfData.split(',')[1];
            AndroidBridge.savePDF(base64Data, pdfFileName);
        } else {
            // Standard browser handling
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = pdfFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        exportError.style.color = 'green';
        exportError.textContent = 'PDF exported successfully.';
        
    } catch (error) {
        console.error('PDF generation error:', error);
        exportError.style.color = 'red';
        exportError.textContent = error.message || 'Error exporting data. Please try again.';
    }
}
async function handleExportType() {
  const selectedType = document.querySelector('input[name="exportType"]:checked').value;
  const sensorElements = [
      { key: 'Moisture', label: 'Moisture', unit: '%' },
      { key: 'Temperature', label: 'Temperature', unit: '°C' },
      { key: 'pH', label: 'pH', unit: 'No Dimensions' },
      { key: 'Nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha' },
      { key: 'Phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha' },
      { key: 'Potassium', label: 'Potassium (K)', unit: 'kg/ha' },
      { key: 'Electrical_Conductivity', label: 'Electrical Conductivity (EC)', unit: 'dS/m' },
      { key: 'RSSI', label: 'RSSI', unit: 'dBm' }
  ];

  const buildRows = (data) => sensorElements
      .filter(el => data[el.key] != null)
      .map(el => [el.label, data[el.key], el.unit]);

  switch(selectedType) {
      case 'byId':
          return handleByIdExport(sensorElements, buildRows);
      case 'lastN':
          return handleLastNExport(sensorElements, buildRows);
      case 'dateRange':
          return handleDateRangeExport(sensorElements, buildRows);
      default:
          throw new Error('Invalid export type selected');
  }
}
// Helper function for export type handling
async function handleByIdExport(sensorElements, buildRows) {
  const docId = document.getElementById('exportDocId').value.trim();
  if (!docId) throw new Error('Please enter a Document ID.');

  const docRef = firebaseDoc(db, "SensorData", docId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
      throw new Error(`No record found with Document ID "${docId}".`);
  }

  return {
      tableRows: buildRows(docSnap.data()),
      tableTitle: `Data for Document ID: ${docId}`
  };
}

async function handleLastNExport(sensorElements, buildRows) {
  const nValue = parseInt(document.getElementById('exportLastN').value, 10);
  if (isNaN(nValue) || nValue <= 0) {
      throw new Error('Please enter a valid number for records.');
  }

  const querySnapshot = await getDocs(collection(db, "SensorData"));
  const records = [];
  
  querySnapshot.forEach(doc => {
      records.push({ id: doc.id, data: doc.data() });
  });

  // Sort by document ID descending (assuming ID is timestamp)
  records.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  const lastNRecords = records.slice(0, nValue);

  if (lastNRecords.length === 0) {
      throw new Error('No records found.');
  }

  // Calculate averages
  const sums = {};
  let count = 0;

  lastNRecords.forEach(rec => {
      count++;
      sensorElements.forEach(el => {
          const value = parseFloat(rec.data[el.key]) || 0;
          sums[el.key] = (sums[el.key] || 0) + value;
      });
  });

  const averages = Object.fromEntries(
      sensorElements.map(el => [
          el.key, 
          sums[el.key] ? (sums[el.key] / count).toFixed(2) : 'N/A'
      ])
  );

  return {
      tableRows: buildRows(averages),
      tableTitle: `Average Data for Last ${nValue} Records`
  };
}

async function handleDateRangeExport(sensorElements, buildRows) {
  const startDateStr = document.getElementById('exportStartDate').value;
  const endDateStr = document.getElementById('exportEndDate').value;
  
  if (!startDateStr || !endDateStr) {
      throw new Error('Please enter both start and end date/time.');
  }

  const startEpoch = Math.floor(new Date(startDateStr).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endDateStr).getTime() / 1000);

  const querySnapshot = await getDocs(collection(db, "SensorData"));
  const filteredRecords = [];

  querySnapshot.forEach(doc => {
      const docEpoch = parseInt(doc.id, 10);
      if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
          filteredRecords.push({ id: doc.id, data: doc.data() });
      }
  });

  if (filteredRecords.length === 0) {
      throw new Error('No records found in the selected date range.');
  }

  // Calculate averages
  const sums = {};
  let count = 0;

  filteredRecords.forEach(rec => {
      count++;
      sensorElements.forEach(el => {
          const value = parseFloat(rec.data[el.key]) || 0;
          sums[el.key] = (sums[el.key] || 0) + value;
      });
  });

  const averages = Object.fromEntries(
      sensorElements.map(el => [
          el.key, 
          sums[el.key] ? (sums[el.key] / count).toFixed(2) : 'N/A'
      ])
  );

  return {
      tableRows: buildRows(averages),
      tableTitle: `Average Data from ${new Date(startEpoch * 1000).toLocaleString()} to ${new Date(endEpoch * 1000).toLocaleString()}`
  };
}
// PDF document generation
function generatePdfDocument(fields, tableRows, tableTitle) {
    const { jsPDF } = window.jspdf;
    const pdfDoc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Header Section
    pdfDoc.setFontSize(16);
    pdfDoc.text('SOIL HEALTH CARD', pdfDoc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // Header Details Table
    pdfDoc.setFontSize(12);
    pdfDoc.autoTable({
        startY: 25,
        body: createHeaderRows(fields),
        theme: 'plain',
        styles: { halign: 'left', cellPadding: 2 }
    });

    // Sensor Data Section
    const finalY = pdfDoc.lastAutoTable.finalY + 10;
    pdfDoc.setFontSize(14);
    pdfDoc.text(tableTitle, 10, finalY);
    
    pdfDoc.autoTable({
        startY: finalY + 5,
        head: [['Element', 'Value', 'Unit']],
        body: tableRows,
        theme: 'grid'
    });

    // Footer
    pdfDoc.setFontSize(10);
    pdfDoc.text(
        "Visit 'https://mysource0.github.io/think-kisan-prototype1' for more information",
        10,
        pdfDoc.internal.pageSize.height - 10
    );

    return pdfDoc;
}

// Helper function to create header rows
function createHeaderRows(fields) {
    const headers = [
        ['Name', fields.Name],
        ['Number', fields.Number],
        ['Location', fields.Location],
        ['Mandal', fields.Mandal],
        ['Soil Type', fields.SoilType],
        ['State', fields.State],
        ['Soil Density', fields.SoilDensity],
        ['Date Tested', fields.DateTested],
        ['Report Generated', fields.ReportGenerated],
        ['Crop Type', fields.CropType],
        ['Equipment Used', fields.Equipment]
    ];

    return headers.reduce((acc, [label, value], index) => {
        if (index % 2 === 0) {
            acc.push([`${label}: ${value}`]);
        } else {
            acc[acc.length - 1].push(`${label}: ${value}`);
        }
        return acc;
    }, []);
}

// Add the remaining handler functions (handleByIdExport, handleLastNExport, handleDateRangeExport)
// from your original code here, following the same pattern
  
  // Attach event listener to the Export PDF button
  exportBtn.addEventListener('click', generatePDF);
  
  // Close modal when clicking "Close"
  closeExportModal.addEventListener('click', () => {
    exportModal.style.display = 'none';
    exportError.textContent = '';
  });
  
  // Attach event listener to the FAB Export Data button
  const exportDataButton = document.getElementById('exportDataBtn');
  if (exportDataButton) {
    exportDataButton.addEventListener('click', () => {
      exportModal.style.display = 'block';
      document.getElementById("last_recent_updated_section").style.display="none";
      document.getElementById("search_results_section").style.display = "none";
      document.getElementById("range_data_operations").style.display = "none";
      
    });
  }
});



/////////pdf end 













































//////////////////////////// pdf record to firebase


// --- Inside your DOMContentLoaded block or relevant module code ---

// Function to save PDF report details to Firestore
async function savePdfReportToFirestore(pdfReportData, pdfNameOption, pdfFileName) {
  try {
    let pdfDocId = "";
    if (pdfNameOption === "custom") {
      // Use the custom file name (remove .pdf extension if present)
      pdfDocId = pdfFileName.replace(/\.pdf$/i, "");
    } else {
      // Generate a random document ID
      pdfDocId = Math.random().toString(36).substring(2, 11);
    }
    // Save the report data in collection "pdfrefort" using setDoc
    await setDoc(docRef(db, "pdfrefort", pdfDocId), pdfReportData);
  } catch (err) {
    // Instead of console or alert, we update our error display element.
    document.querySelector(".export-error").textContent =
      "Error saving report to Firestore.";
  }
}

// Updated generatePDF function that now also saves report details to Firestore.
async function generatePDF() {
  document.querySelector(".export-error").textContent = ""; // Clear previous errors
  
  // Collect header details
  const headerName = document.getElementById("headerName").value.trim();
  const headerNumber = document.getElementById("headerNumber").value.trim();
  const headerLocation = document.getElementById("headerLocation").value.trim();
  const headerMandal = document.getElementById("headerMandal").value.trim();
  const headerSoilType = document.getElementById("headerSoilType").value.trim();
  const headerState = document.getElementById("headerState").value.trim();
  const headerSoilDensity = document.getElementById("headerSoilDensity").value.trim();
  const headerDateTested = document.getElementById("headerDateTested").value.trim();
  const headerReportGenerated = document.getElementById("headerReportGenerated").value.trim();
  const headerCropType = document.getElementById("headerCropType").value.trim();
  const headerEquipment = document.getElementById("headerEquipment").value.trim();
  
  if (
    !headerName ||
    !headerNumber ||
    !headerLocation ||
    !headerMandal ||
    !headerSoilType ||
    !headerState ||
    !headerSoilDensity ||
    !headerDateTested ||
    !headerReportGenerated ||
    !headerCropType ||
    !headerEquipment
  ) {
    document.querySelector(".export-error").textContent = "Please fill in all report header details.";
    return;
  }
  
  // Determine PDF file name
  const pdfNameOption = document.querySelector('input[name="pdfNameOption"]:checked').value;
  let pdfFileName = "";
  if (pdfNameOption === "default") {
    pdfFileName = `${headerName}_${headerLocation}_${headerSoilType}.pdf`;
  } else {
    pdfFileName = document.getElementById("customPdfName").value.trim();
    if (!pdfFileName) {
      document.querySelector(".export-error").textContent = "Please enter a custom PDF file name.";
      return;
    }
    if (!pdfFileName.toLowerCase().endsWith(".pdf")) {
      pdfFileName += ".pdf";
    }
  }
  
  // Prepare sensor data table rows
  // Sensor elements in the desired order with labels and units
  const sensorElements = [
    { key: "Moisture", label: "Moisture", unit: "%" },
    { key: "Temperature", label: "Temperature", unit: "°C" },
    { key: "pH", label: "pH", unit: "" },
    { key: "Nitrogen", label: "Nitrogen (N)", unit: "kg/ha" },
    { key: "Phosphorus", label: "Phosphorus (P)", unit: "kg/ha" },
    { key: "Potassium", label: "Potassium (K)", unit: "kg/ha" },
    { key: "Electrical_Conductivity", label: "Electrical Conductivity (EC)", unit: "dS/m" },
    { key: "RSSI", label: "RSSI", unit: "dBm" }
  ];
  
  // Helper function to build rows from a data object
  function buildRowsFromData(dataObj) {
    const rows = [];
    sensorElements.forEach(el => {
      if (dataObj[el.key] !== undefined && dataObj[el.key] !== null) {
        rows.push([el.label, dataObj[el.key], el.unit]);
      }
    });
    return rows;
  }
  
  // Variables to hold table data and title
  let tableRows = [];
  let tableTitle = "";
  const selectedType = document.querySelector('input[name="exportType"]:checked').value;
  
  if (selectedType === "byId") {
    const docId = document.getElementById("exportDocId").value.trim();
    if (!docId) {
      document.querySelector(".export-error").textContent = "Please enter a Document ID.";
      return;
    }
    const documentReference = docRef(db, "SensorData", docId);
    const docSnap = await getDoc(documentReference);
    if (!docSnap.exists()) {
      document.querySelector(".export-error").textContent = `No record found with Document ID "${docId}".`;
      return;
    }
    const data = docSnap.data();
    tableTitle = `Data for Document ID: ${docId}`;
    tableRows = buildRowsFromData(data);
  } else if (selectedType === "lastN") {
    const nValue = parseInt(document.getElementById("exportLastN").value, 10);
    if (isNaN(nValue) || nValue <= 0) {
      document.querySelector(".export-error").textContent = "Please enter a valid number for records.";
      return;
    }
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    let records = [];
    querySnapshot.forEach(doc => {
      records.push({ id: doc.id, data: doc.data() });
    });
    records.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    const lastNRecords = records.slice(0, nValue);
    if (lastNRecords.length === 0) {
      document.querySelector(".export-error").textContent = "No records found.";
      return;
    }
    tableTitle = `Average Data for Last ${nValue} Records`;
    let sums = {};
    let count = 0;
    lastNRecords.forEach(rec => {
      count++;
      sensorElements.forEach(el => {
        const value = parseFloat(rec.data[el.key]);
        if (!isNaN(value)) {
          sums[el.key] = (sums[el.key] || 0) + value;
        }
      });
    });
    let averages = {};
    sensorElements.forEach(el => {
      if (sums[el.key] !== undefined) {
        averages[el.key] = (sums[el.key] / count).toFixed(2);
      }
    });
    tableRows = buildRowsFromData(averages);
  } else if (selectedType === "dateRange") {
    const startDateStr = document.getElementById("exportStartDate").value;
    const endDateStr = document.getElementById("exportEndDate").value;
    if (!startDateStr || !endDateStr) {
      document.querySelector(".export-error").textContent = "Please enter both start and end date/time.";
      return;
    }
    const startEpoch = Math.floor(new Date(startDateStr).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endDateStr).getTime() / 1000);
    const querySnapshot = await getDocs(collection(db, "SensorData"));
    let filteredRecords = [];
    querySnapshot.forEach(doc => {
      const docEpoch = parseInt(doc.id, 10);
      if (!isNaN(docEpoch) && docEpoch >= startEpoch && docEpoch <= endEpoch) {
        filteredRecords.push({ id: doc.id, data: doc.data() });
      }
    });
    if (filteredRecords.length === 0) {
      document.querySelector(".export-error").textContent = "No records found in the selected date range.";
      return;
    }
    tableTitle = `Average Data from ${new Date(startEpoch * 1000).toLocaleString()} to ${new Date(endEpoch * 1000).toLocaleString()}`;
    let sums = {};
    let count = 0;
    filteredRecords.forEach(rec => {
      count++;
      sensorElements.forEach(el => {
        const value = parseFloat(rec.data[el.key]);
        if (!isNaN(value)) {
          sums[el.key] = (sums[el.key] || 0) + value;
        }
      });
    });
    let averages = {};
    sensorElements.forEach(el => {
      if (sums[el.key] !== undefined) {
        averages[el.key] = (sums[el.key] / count).toFixed(2);
      }
    });
    tableRows = buildRowsFromData(averages);
  }
  
  if (tableRows.length === 0) {
    document.querySelector(".export-error").textContent = "No sensor data available for export.";
    return;
  }
  
  // Build header details rows for PDF header (2 columns per row if possible)
  const headerDetails = [
    { label: "Name", value: headerName },
    { label: "Number", value: headerNumber },
    { label: "Location", value: headerLocation },
    { label: "Mandal", value: headerMandal },
    { label: "Soil Type", value: headerSoilType },
    { label: "State", value: headerState },
    { label: "Soil Density", value: headerSoilDensity },
    { label: "Date Tested", value: headerDateTested },
    { label: "Report Generated On", value: headerReportGenerated },
    { label: "Crop Type", value: headerCropType },
    { label: "Equipment Used", value: headerEquipment }
  ];
  let headerRows = [];
  for (let i = 0; i < headerDetails.length; i += 2) {
    if (headerDetails[i + 1]) {
      headerRows.push([`${headerDetails[i].label}: ${headerDetails[i].value}`, `${headerDetails[i + 1].label}: ${headerDetails[i + 1].value}`]);
    } else {
      headerRows.push([`${headerDetails[i].label}: ${headerDetails[i].value}`]);
    }
  }
  
  // Generate PDF with jsPDF and autoTable
  const { jsPDF } = window.jspdf;
  const pdfDoc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Add header details using autoTable
  pdfDoc.setFontSize(12);
  pdfDoc.autoTable({
    startY: 10,
    head: [["SOIL HEALTH CARD", ""]],
    body: headerRows,
    theme: "plain",
    styles: { halign: "left", cellPadding: 2 },
    headStyles: { fillColor: false, textColor: 0, fontStyle: "bold" }
  });
  
  // Add sensor data title
  let finalY = pdfDoc.lastAutoTable.finalY + 10;
  pdfDoc.setFontSize(14);
  pdfDoc.text(tableTitle, 10, finalY);
  
  // Add sensor data table with headers: Element, Value, unit/measurement
  pdfDoc.autoTable({
    startY: finalY + 5,
    head: [["Element", "Value", "unit/measurement"]],
    body: tableRows,
    theme: "grid"
  });
  
  // Add footer text
  const pageHeight = pdfDoc.internal.pageSize.height;
  pdfDoc.setFontSize(10);
  pdfDoc.text("visit 'https://mysource0.github.io/think-kisan-prototype1' for more information", 10, pageHeight - 10);
  
  // Save the PDF
  // 7) Generate and handle PDF
const pdfData = pdfDoc.output('datauristring');
const base64Data = pdfData.split(',')[1];

// Save to Firestore (if needed)
await savePdfReportToFirestore(pdfReportData, pdfNameOption, pdfFileName);

// Handle download
try {
    AndroidBridge.savePDF(base64Data, pdfFileName);
    exportError.style.color = 'green';
    exportError.textContent = 'PDF exported successfully.';
} catch (error) {
    console.error('Download error:', error);
    exportError.style.color = 'red';
    exportError.textContent = 'Error initiating download. Please try again.';
}
  
  // Prepare data object for Firestore log
  const pdfReportData = {
    header: {
      name: headerName,
      number: headerNumber,
      location: headerLocation,
      mandal: headerMandal,
      soilType: headerSoilType,
      state: headerState,
      soilDensity: headerSoilDensity,
      dateTested: headerDateTested,
      reportGeneratedOn: headerReportGenerated,
      cropType: headerCropType,
      equipmentUsed: headerEquipment
    },
    exportType: selectedType,
    tableTitle: tableTitle,
    tableData: tableRows,
    pdfFileName: pdfFileName,
    timestamp: new Date().toISOString()
  };
  
  // Save the report details to Firestore
  await savePdfReportToFirestore(pdfReportData, pdfNameOption, pdfFileName);
  
  document.querySelector(".export-error").style.color = "green";
  document.querySelector(".export-error").textContent = "PDF exported and report logged successfully.";
}
// 7) Save the PDF
