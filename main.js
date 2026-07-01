window. handlePortalLoginVerification() = async function()  {
    const usernameElement = document.getElementById('login-username') || document.getElementById('login-email');
    const passwordElement = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error');

    if (!usernameElement || !passwordElement) return;

    const userInput = usernameElement.value.trim().toLowerCase();
    const passInput = passwordElement.value.trim();

    if (!userInput || !passInput) {
        if (errorBox) {
            errorBox.textContent = "Please fill in all tracking credentials.";
            errorBox.classList.remove('hidden');
        }
        return;
    }
}