document.getElementById('authForm2').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    
    if (email && password && name && lastName) {
        
        localStorage.setItem('userName', name);
        localStorage.setItem('userLastName', lastName);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        
        
        window.location.href = '/';
    } else {
        
        alert = 'Wszystkie pola muszą być wypełnione!';
    }
});