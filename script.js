let commonPasswords = [];

// Function to fetch all the parts of the common password file and check if the password exists
function checkPasswordInAllChunks(password) {
    // Array of file names for each part
    const files = ['part1.txt', 'part2.txt', 'part3.txt', 'part4.txt', 'part5.txt', 'part6.txt', 'part7.txt'];
    let found = false;

    // Reset the warning message and strength bar when input starts
    document.getElementById('common-password-warning').textContent = '';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('feedback').textContent = '';

    // Promise chain to go through all files and check the password
    files.reduce((promiseChain, file) => {
        return promiseChain.then(() => {
            if (found) return; // If password found, stop checking further files

            return fetch(file)
                .then(response => response.text())
                .then(data => {
                    // Split the file contents into an array
                    commonPasswords = data.split('\n').map(line => line.trim());

                    // Check if the entered password is in the list
                    if (commonPasswords.includes(password)) {
                        found = true;
                        // Set message and progress bar for weak password
                        document.getElementById('common-password-warning').textContent = 'This password exists in the database and is too common!';
                        document.getElementById('feedback').textContent = 'Weak password';
                        document.getElementById('feedback').className = 'weak';
                        document.getElementById('progress-bar').style.width = '25%';
                        document.getElementById('progress-bar').style.backgroundColor = 'red';
                    }
                })
                .catch(error => console.error('Error loading dictionary file:', error));
        });
    }, Promise.resolve());
}

// Add event listener for password input
document.getElementById('password').addEventListener('input', function () {
    let password = this.value;

    // Check if the password is common in any chunk
    checkPasswordInAllChunks(password);

    // Password strength logic if password is not found in the database
    let feedback = document.getElementById('feedback');
    let progressBar = document.getElementById('progress-bar');
    let crackTime = document.getElementById('crack-time');
    let strength = 0;

    // Check password criteria if not marked as weak from database check
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    // If password was not found in common database, apply normal strength checks
    if (document.getElementById('common-password-warning').textContent === '') {
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
    }

    // Estimate time to crack based on strength
    const crackTimes = { 0: "Instantly", 1: "A few seconds", 2: "Minutes", 3: "Hours", 4: "Days", 5: "Years", 6: "Centuries" };
    crackTime.textContent = `Estimated time to crack: ${crackTimes[strength]}`;
});

// Toggle password visibility
document.getElementById('toggle-password').addEventListener('change', function () {
    let passwordInput = document.getElementById('password');
    if (this.checked) {
        passwordInput.setAttribute('type', 'text');
    } else {
        passwordInput.setAttribute('type', 'password');
    }
});
