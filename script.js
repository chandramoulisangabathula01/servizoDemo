document.getElementById('chefApplicationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        experience: document.getElementById('experience').value,
        availability: Array.from(document.querySelectorAll('input[name="availability[]"]:checked')).map(cb => cb.value),
        terms: document.querySelector('input[name="terms"]').checked,
        backgroundCheck: document.querySelector('input[name="backgroundCheck"]').checked
    };

    // Replace with your actual API endpoint
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Send data to API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Application submitted successfully!');
        // You can redirect or clear the form here
        document.getElementById('chefApplicationForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting the application.');
    });
}); 