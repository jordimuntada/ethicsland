
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('newsletterForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var email = document.getElementById('email').value;
        console.log(email);
        const url = "https://api.gateway360.com/api/3.0/sms/send";
        
    // Your JSON data
        const data = {
            "email": email
        };
        // Simulating sending the email to your server, which would then send the SMS.
        // Replace 'YOUR_SERVER_ENDPOINT' with the endpoint on your server that handles SMS sending.
        fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({email: email}),
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Email sent as SMS successfully:', data);
            alert('Thank you for subscribing! Please check your SMS messages.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing your subscription.');
        });
    });
});