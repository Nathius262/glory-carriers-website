document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const formData = new FormData(form);
  const progressBar = document.getElementById('progressBar');
  const status = document.getElementById('status');
  const url = form.action; // Extract the action attribute from the form

  progressBar.style.display = 'block';
  status.innerHTML = 'Uploading...';

  try {
      const response = await uploadFile(formData, progressBar, url);
      const result = await response.json();

      if (response.ok) {
          status.innerHTML = 'Upload successful!';
          alert('Upload successful:', );
          messageAlert(
            title = "Upload Successful",
            message = result,
            redirectTo = "/",
            classType = "text-success",
            btnType = "btn-success",
          )
      } else {
          status.innerHTML = `Upload failed: ${result.message}`;
          messageAlert(
            title = "Upload failed",
            message = result,
            redirectTo = false,
            classType = "text-success",
            btnType = "btn-success",
          )
          
      }
  } catch (error) {
      status.innerHTML = `Upload failed: ${error.message}`;
        messageAlert(
            title = "Upload failed",
            message = result,
            redirectTo = false,
            classType = "text-success",
            btnType = "btn-success",
        )

  } finally {
      progressBar.style.display = 'none';
  }
});

async function uploadFile(formData, progressBar, url) {
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

      xhr.open('POST', url, true); // Use the dynamic URL
      xhr.withCredentials = true;
      xhr.send(formData);
  });
}