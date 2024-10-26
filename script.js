document.getElementById('authForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    
    if (email && password) {
        
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        
        
        window.location.href = 'glownastrona.html';
    } else {
        
        alert = 'Wszystkie pola muszą być wypełnione!';
    }
});