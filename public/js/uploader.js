document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const form = event.target;
    const formData = new FormData(form);
    const progressBar = document.getElementById('progressBar');
    const status = document.getElementById('status');
  
    progressBar.style.display = 'block';
    status.innerHTML = 'Uploading...';
  
    try {
      const response = await uploadFile(formData, progressBar);
      const result = await response.json();
  
      if (response.ok) {
        status.innerHTML = 'Upload successful!';
        alert('Upload successful:', result);
        window.location.reload()
      } else {
        status.innerHTML = `Upload failed: ${result.message}`;
        alert('Upload failed:', result);
      }
    } catch (error) {
      status.innerHTML = `Upload failed: ${error.message}`;
      alert('Upload error:', error);
    } finally {
      progressBar.style.display = 'none';
    }
});
  
async function uploadFile(formData, progressBar) {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
        }
        };

        xhr.onload = function() {
        resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            json: () => Promise.resolve(JSON.parse(xhr.responseText))
        });
        };

        xhr.onerror = function() {
        reject(new Error('Network error'));
        };

        xhr.open('POST', '/media/sermon', true); // Update the URL to your upload endpoint
        xhr.send(formData);
    });
}
