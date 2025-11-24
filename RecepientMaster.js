const btn = document.getElementById('submitBtn');
const inputs = Array.from(document.querySelectorAll('input'));
const tableBody = document.querySelector('#dataList tbody');
const confirmBox = document.getElementById('submitBox');
const confirmMsg = document.getElementById('confirmMsg');
const yesBtn = document.getElementById('submitYes');
const noBtn = document.getElementById('submitNo');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageOk = document.getElementById('messageOk');


let currentRow = null; // Track the selected row
let state = 'Submit'; // Submit / Update


// -------------------- Page Load --------------------
window.onload = () => {
  const savedData = JSON.parse(localStorage.getItem('tableData')) || [];
  savedData.forEach(rowData => {
    const row = document.createElement('tr');
    row.innerHTML = rowData.map(v => `<td>${v}</td>`).join('');
    tableBody.appendChild(row);
  });
};

// -------------------- Get Input Values --------------------
function getInputValues() {
  return inputs.map(i => i.value); // exact case preserved
}

// -------------------- Save Table Data --------------------
function saveTableData() {
  const data = Array.from(tableBody.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );
  localStorage.setItem('tableData', JSON.stringify(data));
}


function setInputValues(values) {
  inputs.forEach((input, i) => input.value = values[i] || '');
}


// Helper function
function allInputsFilled() {
  return inputs.every(input => input.value !== '');
}

function showConfirm  (message, callback) {
  confirmMsg.textContent = message;
  confirmBox.style.display = 'block';

  yesBtn.onclick = () => {
    confirmBox.style.display = 'none';
    callback(true);
  };

  noBtn.onclick = () => {
    confirmBox.style.display = 'none';
    callback(false);
  };
}

function showMessage(message, callback) {
  messageText.textContent = message;
  messageBox.style.display = 'block';
  messageOk.onclick = () => {
    messageBox.style.display = 'none';
    if(callback) callback();
  };
}

function showModal(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("customOk").style.display ="block";
}

function closeOk() {
  document.getElementById("customOk").style.display = "none";
}

function validateInputs() {
  const fields = [
    {
      id: 'textbox1',
      message: 'Please enter valid 15 GSTIN number.',
      validate: value => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(value) === false
    },
    { id: 'textbox2', message: 'Please enter supplier name.' },
    { id: 'textbox3', message: 'Please enter trade name.' },
    { id: 'textbox4', message: 'Please enter state name.' },
    { id: 'textbox5', message: 'Please enter Pin_Code.' },
    {
      id: 'textbox6',
      message: 'Please enter valid 10-digit mobile number.',
      validate: value => /^[6-9]\d{9}$/.test(value) === false
    },
    {
      id: 'textbox7',
      message: 'Please enter a valid Email ID.',
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) === false
    },
    { id: 'textbox8', message: 'Please enter address.' }
  ];

  for (let field of fields) {
    const input = document.getElementById(field.id);
    const value = input.value;
    if (!value) { 
      showModal(field.message);
      input.focus();
      return false;
    }
    if (field.validate && field.validate(value)) {
      showModal(field.message);
      input.focus();
      return false;
    }
  }
  return true;
}

function getInputValues() {
  return inputs.map(input => input.value);
}

function setInputValues(values) {
  inputs.forEach((input, index) => input.value = values[index]);
}

function clearInputs() {
  inputs.forEach(input => input.value = '');
}

// Handle Submit / Update / Delete button
btn.addEventListener('click', () => {
  if (!allInputsFilled() && btn.textContent === 'Submit') {
    showModal('Please fill all fields.');
    return;
  }

//////////////For Submit/////////////////////

  if (btn.textContent === 'Submit') {
    if (!validateInputs()) return;

    showConfirm('Are you sure you want to submit?', confirmed => {
      if (confirmed) {
        const row = document.createElement('tr');
        const values = getInputValues();
        row.innerHTML = values.map(v => `<td>${v}</td>`).join('');
        tableBody.appendChild(row);
        clearInputs();
        showMessage('Data submitted successfully.');
        saveTableData(); // 🔸 Save new data
      }
    });
  } 

///////////////////////For Update/////////////////////////////

  else if (btn.textContent === 'Update') {
    if (!validateInputs()) return;

    showConfirm('Do you want to update?', confirmed => {
      if (confirmed && currentRow) {
        const values = getInputValues();
        Array.from(currentRow.children).forEach((cell, i) => cell.textContent = values[i]);
        btn.textContent = 'Submit';
        currentRow = null;
        clearInputs();
        showMessage('Data updated successfully.');
        saveTableData(); // 🔸 Save after update
      }
    });
  }


//////////////////////For Delate///////////////////////////

  else if (btn.textContent === 'Delete') {
    showConfirm('Are you sure you want to delete?', confirmed => {
      if (confirmed && currentRow) {
        tableBody.removeChild(currentRow);  // remove from table
        btn.textContent = 'Submit';
        currentRow = null;
        clearInputs();
        showMessage('Row deleted successfully.');
        saveTableData(); // 🔸 Save after delete — ensures deleted data won't reload
      }
    });
  }
});



// Handle single-click / double-click on rows
let clickTimer = null;
tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  if (!row) return;
 if (btn.textContent === 'Update') return; // ignore single-click during update
if (clickTimer) return;
  clickTimer = setTimeout(() => {
    clickTimer = null;
   // Single-click → Delete
    currentRow = row;
    btn.textContent = 'Delete';
  }, 250);
});




tableBody.addEventListener('dblclick', e => {
  const row = e.target.closest('tr');
  if (!row) return;

  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;}
// Double-click → populate inputs & update
  currentRow = row;
  const values = Array.from(row.children).map(cell => cell.textContent);
  setInputValues(values);
  btn.textContent = 'Update';
});




/////////////////////////For Clear btn///////////////////////////

function clearButton() {
    
    // Clear the values of text fields
    document.getElementById("textbox1").value = "";
    document.getElementById("textbox2").value = "";
    document.getElementById("textbox3").value = "";
    document.getElementById("textbox4").value = "";
    document.getElementById("textbox5").value = "";
    document.getElementById("textbox6").value = "";
    document.getElementById("textbox7").value = "";
    document.getElementById("textbox8").value = "";
}

 function clearButton() {

    // Show showModal
    document.getElementById("clearBox").style.display = "flex";

  }

 function clearNo() {
    // Hide showModal
    document.getElementById("clearBox").style.display = "none";

  }

function clearYes() {
    // Actually clear form
    const form = document.querySelector("form");
    if (form) form.reset();
     btn.textContent = 'Submit';
    // Hide showModal
    clearNo();

  }


/////////////////////VlookUp////////////////////////////////////////////////


const textboxes = [
    document.getElementById('textbox1'), // GSTIN
    document.getElementById('textbox2'), // Supplier Name
    document.getElementById('textbox3'), // Trade Name
    document.getElementById('textbox4'), // State Name
    document.getElementById('textbox5'), // Pin_Code
    document.getElementById('textbox6'), // Mobile Number
    document.getElementById('textbox7'), // Email ID
    document.getElementById('textbox8')  // Address
];

const textbox1 = document.getElementById('textbox1');
const dataList = document.getElementById('dataList');
const submitButton = document.getElementById('submitBtn'); // Your button

textbox1.addEventListener('input', () => {
    const typedGSTIN = textbox1.value.trim().toUpperCase();
    let found = false;

    const rows = dataList.getElementsByTagName('tr');

    if (typedGSTIN === "") {
        // If GSTIN textbox is empty, clear all other fields and set button to "Submit"
        for (let i = 1; i < textboxes.length; i++) {
            textboxes[i].value = "";
        }
        submitButton.textContent = "Submit";
        return;
    }

    // Start from 1 to skip header row
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells[0].textContent.trim().toUpperCase() === typedGSTIN) {
            // GSTIN match found → autofill and change button to "Update"
            for (let j = 0; j < textboxes.length; j++) {
                textboxes[j].value = cells[j] ? cells[j].textContent.trim() : "";
            }
            submitButton.textContent = "Update";
            found = true;
            break;
        }
    }

    if (!found) {
        // No match → clear other fields and set button to "Submit"
        for (let i = 1; i < textboxes.length; i++) {
            textboxes[i].value = "";
        }
        submitButton.textContent = "Submit";
    }
});

document.getElementById("exitBtn").addEventListener("click", function () {
      window.location.href = "file:///D:/xampp/htdocs/myproject/Home%20page/HomePgae.html";
    })







