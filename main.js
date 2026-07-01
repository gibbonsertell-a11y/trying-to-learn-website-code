window.handlePortalLoginVerification = async function() {
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

    // -------------------------------------------------------------------------
    // 🔒 ABSOLUTE LOCAL BYPASS (No Database Call Allowed For This Account)
    // -------------------------------------------------------------------------
    if (userInput === 'gibbons-ertel_l@outlook.com' && passInput === 'supersecret') {
        if (errorBox) errorBox.classList.add('hidden');
        
        localStorage.setItem('activeSession', 'Master Administrator');
        localStorage.setItem('activePathway', 'Portal Role: IT Staff');
        localStorage.setItem('system_auth_checksum', 'sec_tok_0a4f6d'); 
        
        alert("✨ Logged in successfully via Master Admin Local Overrides!");
        window.location.href = './admin.html';
        return; 
    }

    // -------------------------------------------------------------------------
    // 🌐 LIVE DATABASE FALLBACK (Connected directly to Supabase)
    // -------------------------------------------------------------------------
    try {
        // Query your Supabase table (assuming you have a table named 'profiles' or 'users')
        const { data: user, error } = await supabase
            .from('profiles') 
            .select('*')
            .eq('email', userInput)
            .eq('password', passInput) // Matches plain text password
            .single(); // Expects exactly one matching user

        if (error || !user) {
            if (errorBox) {
                errorBox.textContent = "Invalid email or password.";
                errorBox.classList.remove('hidden');
            }
            return;
        }

        // If a matching user is found, populate localStorage based on their database data
        localStorage.setItem('activeSession', user.name);
        localStorage.setItem('activePathway', `Portal Role: ${user.role}`);
        
        // Handle security tokens depending on the role from Supabase
        if (user.role === 'Teacher') localStorage.setItem('system_auth_checksum', 'sec_tok_7d1e94');
        else if (user.role === 'IT Staff') localStorage.setItem('system_auth_checksum', 'sec_tok_0a4f6d');
        else if (user.role === 'Parent') localStorage.setItem('system_auth_checksum', 'sec_tok_3c5b8e');
        else localStorage.setItem('system_auth_checksum', 'sec_tok_8f92a1');

        // Redirect based on role
        if (user.role === 'IT Staff' || user.role === 'Teacher') {
            window.location.href = './admin.html';
        } else {
            window.location.href = './dashboard.html';
        }

    } catch (error) {
        console.error(error);
        if (errorBox) {
            errorBox.textContent = "Could not authenticate your access records with the database.";
            errorBox.classList.remove('hidden');
        }
    }
}
async function addNewUser(userEmail, userPassword, fullName, userRole) {
    const { data, error } = await supabase
        .from('profiles') // 1. Change this to your exact table name
        .insert([
            { 
                email: userEmail, 
                password: userPassword, 
                name: fullName, 
                role: userRole 
            }
        ])
        .select(); // This returns the newly created data so you can check it

    if (error) {
        console.error("Error adding user:", error.message);
        alert("Failed to add user: " + error.message);
    } else {
        console.log("User added successfully:", data);
        alert("✨ User account created in the live database!");
    }
}