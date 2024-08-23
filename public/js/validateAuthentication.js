document.addEventListener('DOMContentLoaded', function () {   
  
    // Initial check for authentication status
    checkAuthStatus();
});


// Function to check authentication status
const checkAuthStatus = async () => {
    try {
      const response = await fetch('/auth/status', {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      const data = await response.json();

      //console.log(data)

      if (data.authenticated) {
        showLogoutButton();
      } else {
        showLoginButton();
      }
    } catch (err) {
      console.error('Error checking authentication status:', err);
    }
};

// Function to show the logout button
const showLogoutButton = () => {
  try {
    const authButtonsContainer = document.getElementById('auth-buttons');
    authButtonsContainer.innerHTML = `
      <button id="logout-button" class="btn btn-primary rounded-3 p-2">Logout</button>
    `;

    document.getElementById('logout-button').addEventListener('click', handleLogout);
  } catch {
    
  }
};

// Function to show the login button
const showLoginButton = () => {
  try {
    const authButtonsContainer = document.getElementById('auth-buttons');
    authButtonsContainer.innerHTML = `
        <button id="login-button" class="btn btn-primary rounded-3 p-2">Login</button>
    `;

    document.getElementById('login-button').addEventListener('click', () => {
        window.location.href = '/auth/login'; // Redirect to login page
    });
  } catch {
    
  }    
};

// Function to handle logout
const handleLogout = async () => {
    try {
        await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
    });

    showLoginButton(); // Update the UI after logout
    } catch (err) {
        console.error('Error logging out:', err);
    }
};