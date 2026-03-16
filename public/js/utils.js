/**
 * Reusable fetch function to handle network and server errors
 * @param {string} url - API endpoint to fetch data from
 * @param {Object} options - Optional fetch configuration (method, headers, body, etc.)
 * @param {Object} config - Additional config (template-specific actions, notifications)
 */
export async function fetchWithHandling(url, options, { templateAction, alert }) {
    try {
        const response = await fetch(url, options);
        
        // Handle response errors
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while fetching data.');
        }
        
        const data = await response.json();

        // Assuming the API response contains pagination info and a message
        const { users, currentPage, totalPages, totalItems, message } = data;
        
        // Call the template action with the users and pagination data
        templateAction(users, { currentPage, totalPages, totalItems });

        console.log(users);
        
        // Display success message from the backend if it exists
        if (message && alert) {
            messageAlert('Success', message);
        }
    } catch (error) {
        console.error('Network or other error:', error);
        messageAlert('Error', error.message || 'An unexpected error occurred.');
    }
}


// Reusable function to show notifications via modal
export function messageAlert(title, message, redirectTo, classType, btnType, reloadOnClose = true) {
    const heading = document.querySelector('#successModalLabel');
    heading.innerHTML = title;
    heading.classList.add(classType);
    document.querySelector('#modal-message').innerHTML = message;
    const closeModalButton = document.querySelector('#close-modal');
    closeModalButton.classList.add(btnType);

    $("#successModal").modal('show');
    
    $('#successModal').on('hide.bs.modal', function (e) {
        if (redirectTo) {
            window.location.href = redirectTo;
        } else if (reloadOnClose) {
            //window.location.reload();
        }
    });
}

// Function to render pagination controls
export const renderPaginationControls = ({ currentPage, totalPages }) => {
    const paginationContainer = document.querySelector('.pagination'); // Assuming you have a pagination container

    paginationContainer.innerHTML = ''; // Clear existing controls

    // Create previous button
    if (currentPage > 1) {
        paginationContainer.insertAdjacentHTML('beforeend', `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>`);
    }

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = (i === currentPage) ? 'active' : '';
        paginationContainer.insertAdjacentHTML('beforeend', `<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Create next button
    if (currentPage < totalPages) {
        paginationContainer.insertAdjacentHTML('beforeend', `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`);
    }

    // Add event listeners to pagination links
    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            fetchAndDisplayUsers(page);
        });
    });
};


export const handleLogout = async () => {
    try {
        await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are sent with the request
        });

        window.location.href = "/admin/login"; // Update the UI after logout
    } catch (err) {
        console.error('Error logging out:', err);
    }
};