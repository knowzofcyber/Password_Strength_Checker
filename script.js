// Dictionary of common weak passwords
const commonPasswords = ["123456", "password", "123456789", "qwerty", "12345678", "abc123", "password1"];

// Add event listener for password input
document.getElementById('password').addEventListener('input', function() {
    let password = this.value;
    let feedback = document.getElementById('feedback');
    let progressBar = document.getElementById('progress-bar');
    let commonPasswordWarning = document.getElementById('common-password-warning');

    // Password strength checking criteria
    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength++;
    
    // Check for digits
    if (/\d/.test(password)) strength++;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength++;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    // Progress bar and feedback text
    if (strength <= 2) {
        feedback.textContent = 'Weak password';
        feedback.className = 'weak';
        progressBar.style.width = '25%';
        progressBar.style.backgroundColor = 'red';
    } else if (strength === 3 || strength === 4) {
        feedback.textContent = 'Moderate password';
        feedback.className = 'moderate';
        progressBar.style.width = '50%';
        progressBar.style.backgroundColor = 'orange';
    } else {
        feedback.textContent = 'Strong password';
        feedback.className = 'strong';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = 'green';
    }

    // Dictionary attack prevention (Check against common passwords)
    if (commonPasswords.includes(password)) {
        commonPasswordWarning.textContent = 'This password is too common and weak!';
        progressBar.style.width = '10%';
        progressBar.style.backgroundColor = 'red';
        feedback.textContent = 'Very Weak password';
        feedback.className = 'weak';
    } else {
        commonPasswordWarning.textContent = '';
    }
});
