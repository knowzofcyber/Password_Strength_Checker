let commonPasswords = [];

// Function to fetch all parts of the common password file and check if the password exists
async function checkPasswordInAllChunks(password) {
    const files = ['part1.txt', 'part2.txt', 'part3.txt', 'part4.txt', 'part5.txt', 'part6.txt', 'part7.txt'];
    let found = false;

    // Reset the warning message and progress bar
    document.getElementById('common-password-warning').textContent = '';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('feedback').textContent = '';

    for (const file of files) {
        if (found) break; // Stop checking further files if password is found

        try {
            const response = await fetch(file);
            const data = await response.text();

            // Split the file contents into an array and remove empty lines
            commonPasswords = data.split('\n').map(line => line.trim()).filter(line => line);

            // Check if the password exists in this chunk
            if (commonPasswords.includes(password)) {
                found = true;
                document.getElementById('common-password-warning').textContent = 'This password exists in the database and is too common!';
                document.getElementById('feedback').textContent = 'Weak password';
                document.getElementById('feedback').className = 'weak';
                document.getElementById('progress-bar').style.width = '25%';
                document.getElementById('progress-bar').style.backgroundColor = 'red';
            }
        } catch (error) {
            console.error(`Error fetching ${file}:`, error);
        }
    }

    return found;
}

// Main function to check password strength
document.getElementById('password').addEventListener('input', async function () {
    const password = this.value;

    // Check if the password is common in any chunk
    const foundInDictionary = await checkPasswordInAllChunks(password);

    // Password strength logic if password is not found in the database
    let feedback = document.getElementById('feedback');
    let progressBar = document.getElementById('progress-bar');
    let crackTime = document.getElementById('crack-time');
    let strength = 0;

    // If the password was found in the common database, skip the strength calculation
    if (!foundInDictionary) {
        // Calculate the password strength
        if (password.length >= 8) strength++;
        if (/\d/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        // Adjust the feedback based on password strength
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

        // Estimate time to crack based on strength
        const crackTimes = { 0: "Instantly", 1: "A few seconds", 2: "Minutes", 3: "Hours", 4: "Days", 5: "Years", 6: "Centuries" };
        crackTime.textContent = `Estimated time to crack: ${crackTimes[strength]}`;
    } else {
        // Set the estimated crack time to "Minutes" if the password exists in the database
        crackTime.textContent = 'Estimated time to crack: Minutes';
    }
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
