(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        
        form.addEventListener('submit', async function (event) {
            
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            console.log("requuired")
          }
          else{
            event.preventDefault()
            event.stopPropagation()
            const form = event.target;
            
            const formData = new FormData(form);
            
            const progressBar = document.getElementById('progressBar');
            const status = document.getElementById('status');
            const url = form.action; // Extract the action attribute from the form

            progressBar.style.display = 'block';
            status.innerHTML = 'Uploading...';

            try {
                let method;

                if (form.id == "update-media"){
                    method = "PUT";
                    console.log("updating media...")
                }else{
                    method = "POST";
                    console.log("creating media...")
                };
                
                const response = await uploadFile(formData, progressBar, url, method);
                const result = await response.json();

                if (response.ok) {
                    status.innerHTML = 'Upload successful!';
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
                        message = error.message,
                        redirectTo = false,
                        classType = "text-danger",
                        btnType = "btn-danger",
                    )

            } finally {
                progressBar.style.display = 'none';
            }
        }
  
          form.classList.add('was-validated')
        }, false)
      })
      
})()

async function uploadFile(formData, progressBar, url, method) {
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
  
        xhr.open(method, url, true); // Use the dynamic URL
        xhr.withCredentials = true;
        xhr.send(formData);
    });
  }