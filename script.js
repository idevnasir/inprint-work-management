let jobs = [];
let editingIndex = -1;

// Function to load jobs from localStorage on page load
function loadJobs() {
    const storedJobs = localStorage.getItem('inprintJobs');
    if (storedJobs) {
        jobs = JSON.parse(storedJobs);
        renderJobs(jobs); // Re-render the jobs if any are loaded
    }
}

// Function to save jobs to localStorage
function saveJobs() {
    localStorage.setItem('inprintJobs', JSON.stringify(jobs));
}

function toggleDeliveryDate() {
    const statusDropdown = document.getElementById('status');
    const deliveryDateGroup = document.getElementById('delivery-date-group');
    deliveryDateGroup.style.display = statusDropdown.value === 'Delivered' ? 'block' : 'none';
}

function toggleEditDeliveryDate() {
    const editStatusDropdown = document.getElementById('edit-status');
    const editDeliveryDateGroup = document.getElementById('edit-delivery-date-group');
    editDeliveryDateGroup.style.display = editStatusDropdown.value === 'Delivered' ? 'block' : 'none';
}

function addJob() {
    const date = document.getElementById('date').value;
    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    const workDetails = document.getElementById('work-details').value;
    const deadline = document.getElementById('deadline').value; // Deadline is now optional
    const delivery = document.getElementById('delivery-date-group').style.display === 'block' ? document.getElementById('delivery').value : '';
    const status = document.getElementById('status').value;

    // Deadline is no longer mandatory in the condition
    if (date && clientName && workDetails) {
        jobs.push({ date, clientName, clientPhone, workDetails, deadline, delivery, status });
        saveJobs(); // Save to localStorage after adding a job
        clearInputFields();
        alert('Job added successfully!');
        if (document.getElementById('jobs-table').style.display === 'table') {
            renderJobs(jobs); // Re-render if the table is visible
        }
    } else {
        alert('Please fill in the required fields (Date, Client Name, Work Details).');
    }
}

function clearInputFields() {
    document.getElementById('date').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('work-details').value = '';
    document.getElementById('deadline').value = ''; // Clear deadline field
    document.getElementById('delivery').value = '';
    document.getElementById('delivery-date-group').style.display = 'none'; // Initially hide
    document.getElementById('status').selectedIndex = 0; // Reset dropdown to the first option
}

function showAllJobs() {
    document.getElementById('jobs-table').style.display = 'table';
    document.getElementById('filter-section').style.display = 'block';
    renderJobs(jobs);
}

function renderJobs(jobList) {
    const tableBody = document.getElementById('jobs-table-body');
    tableBody.innerHTML = '';
    if (jobList.length > 0) {
        document.getElementById('download-button').style.display = 'inline-block';
        jobList.forEach((job, index) => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = job.date;
            row.insertCell().textContent = job.clientName;
            row.insertCell().textContent = job.clientPhone;
            row.insertCell().textContent = job.workDetails;
            row.insertCell().textContent = job.deadline || '-'; // Display '-' if no deadline
            row.insertCell().textContent = job.delivery || '-';
            row.insertCell().textContent = job.status || '-';
            const actionsCell = row.insertCell();
            const editButton = document.createElement('span');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn btn btn-link'; // Use Bootstrap's link style
            editButton.onclick = () => editJob(index);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn btn btn-link text-danger'; // Use Bootstrap's link style and make it red
            deleteButton.onclick = () => deleteJob(index);
            actionsCell.appendChild(deleteButton);
        });
    } else {
        tableBody.insertRow().insertCell().textContent = 'No jobs available.';
        tableBody.rows[0].colSpan = 8;
        document.getElementById('download-button').style.display = 'none';
    }
}

function editJob(index) {
    editingIndex = index;
    const job = jobs[index];
    document.getElementById('edit-date').value = job.date;
    document.getElementById('edit-client-name').value = job.clientName;
    document.getElementById('edit-client-phone').value = job.clientPhone;
    document.getElementById('edit-work-details').value = job.workDetails;
    document.getElementById('edit-deadline').value = job.deadline || ''; // Populate if exists
    document.getElementById('edit-delivery').value = job.delivery || '';
    document.getElementById('edit-status').value = job.status || 'Pending';

    // Show/hide delivery date on edit form load
    document.getElementById('edit-delivery-date-group').style.display = job.status === 'Delivered' ? 'block' : 'none';

    document.getElementById('edit-job-index').value = index;
    document.getElementById('edit-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for editing
}

function saveEditedJob() {
    const indexToUpdate = parseInt(document.getElementById('edit-job-index').value);
    if (indexToUpdate !== -1 && jobs[indexToUpdate]) {
        jobs[indexToUpdate] = {
            date: document.getElementById('edit-date').value,
            clientName: document.getElementById('edit-client-name').value,
            clientPhone: document.getElementById('edit-client-phone').value,
            workDetails: document.getElementById('edit-work-details').value,
            deadline: document.getElementById('edit-deadline').value, // Deadline can be empty
            delivery: document.getElementById('edit-delivery-date-group').style.display === 'block' ? document.getElementById('edit-delivery').value : '',
            status: document.getElementById('edit-status').value
        };
        saveJobs(); // Save to localStorage after editing
        document.getElementById('edit-form').style.display = 'none';
        renderJobs(jobs);
        alert('Job updated successfully!');
        editingIndex = -1;
    } else {
        alert('Error updating job.');
    }
}

function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
    editingIndex = -1;
}

function deleteJob(index) {
    if (confirm('Are you sure you want to delete this job?')) {
        jobs.splice(index, 1);
        saveJobs(); // Save to localStorage after deleting
        renderJobs(jobs);
        alert('Job deleted successfully!');
    }
}

function filterJobs() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const selectedStatus = document.getElementById('filter-status').value;

    const filteredJobs = jobs.filter(job => {
        const dateMatch = (!startDate || !endDate) || (new Date(job.date) >= new Date(startDate) && new Date(job.date) <= new Date(endDate));
        const statusMatch = (selectedStatus === 'All') || (job.status === selectedStatus);
        return dateMatch && statusMatch;
    });

    renderJobs(filteredJobs);
}

function downloadJobs() {
    const startDateInput = document.getElementById('filter-start-date').value;
    const endDateInput = document.getElementById('filter-end-date').value;
    const selectedStatus = document.getElementById('filter-status').value;

    const filteredJobs = jobs.filter(job => {
        const dateMatch = (!startDateInput || !endDateInput) || (new Date(job.date) >= new Date(startDateInput) && new Date(job.date) <= new Date(endDateInput));
        const statusMatch = (selectedStatus === 'All') || (job.status === selectedStatus);
        return dateMatch && statusMatch;
    });

    if (filteredJobs.length === 0) {
        alert('No jobs to download based on the current filter.');
        return;
    }

    let csvContent = "Date,Client Name,Client Phone,Work Details,Deadline,Delivery,Status\n";
    filteredJobs.forEach(job => {
        csvContent += `${job.date},"${job.clientName}","${job.clientPhone}","${job.workDetails}","${job.deadline || ''}","${job.delivery || ''}","${job.status || ''}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_inprint_jobs.csv"); // Changed filename to avoid confusion
    document.body.appendChild(link); // Required for Firefox

    link.click();

    document.body.removeChild(link);
}

function downloadAllJobs() {
    if (jobs.length === 0) {
        alert('No jobs to download.');
        return;
    }

    let csvContent = "Date,Client Name,Client Phone,Work Details,Deadline,Delivery,Status\n";
    jobs.forEach(job => {
        csvContent += `${job.date},"${job.clientName}","${job.clientPhone}","${job.workDetails}","${job.deadline || ''}","${job.delivery || ''}","${job.status || ''}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_inprint_jobs.csv"); // Filename for all jobs
    document.body.appendChild(link); // Required for Firefox

    link.click();

    document.body.removeChild(link);
}

// Load jobs from localStorage when the page loads
window.onload = loadJobs;

// Initial call to hide delivery date on page load
toggleDeliveryDate();
toggleEditDeliveryDate();