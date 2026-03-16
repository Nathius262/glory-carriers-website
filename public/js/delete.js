// Simple delete modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const deleteItemName = document.getElementById('deleteItemName');
    const confirmButton = document.getElementById('confirmDelete');
    
    let currentDeleteUrl = null;
    
    // Handle all delete buttons
    document.querySelectorAll('[data-delete]').forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            currentDeleteUrl = this.getAttribute('data-url');
            
            deleteItemName.textContent = itemName;
            modal.show();
        });
    });
    
    // Handle confirm delete
    confirmButton.addEventListener('click', function() {
        if (!currentDeleteUrl) return;
        
        fetch(currentDeleteUrl, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirectTo || window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        })
        .finally(() => {
            modal.hide();
            currentDeleteUrl = null;
        });
    });
});