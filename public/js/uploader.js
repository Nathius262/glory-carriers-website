//import { body, header } from "express-validator"

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

            loadStatus(true)
            
            const formData = new FormData(form);
            
            const url = form.action; // Extract the action attribute from the form

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
                    messageAlert(
                        title = "Upload Successful",
                        message = result.message,
                        redirectTo = result.redirectTo,
                        classType = "text-success",
                        btnType = "btn-success",
                    )
                } else {
                    messageAlert(
                        title = "Upload failed",
                        message = result.message,
                        redirectTo = false,
                        classType = "text-success",
                        btnType = "btn-success",
                    )
                    
                }
            } catch (error) {
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
            loadStatus(false)
        }
  
          form.classList.add('was-validated')
        }, false)
      })
      
})()


try {
    document.getElementById('id_image_group').onclick = function(event){
        document.getElementById('id_image_file').click();
    };
}  catch (TypeError) {

}
  

try {
    document.getElementById('id_audio_file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const audioPlayer = document.getElementById('audioPlayer');
            const fileURL = URL.createObjectURL(file);
    
            // Set the audio source to the selected file
            audioPlayer.src = fileURL;
            audioPlayer.load(); // Load the new file
            audioPlayer.play(); // Optionally, auto-play the selected file
        }
    });
}  catch (TypeError) {

}
  
try{
    const pdfFileInput = document.getElementById('id_pdf_file');
    const pdfPreview = document.getElementById('pdfPreview');


    // If a file URL is already available, show the preview
    document.addEventListener("DOMContentLoaded", function() {
        if (pdfPreview.src != "") {
            pdfPreview.style.display = 'block';  // Make sure the preview is visible
        }
    });

    // Event listener for file input change
    pdfFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file && file.type === 'application/pdf') {
            const fileURL = URL.createObjectURL(file); // Create a URL for the selected file

            // Set the preview element to show the PDF
            pdfPreview.src = fileURL;
            pdfPreview.style.display = 'block'; // Show the preview
        } else {
            // Hide the preview if it's not a valid PDF
            pdfPreview.style.display = 'none';

            messageAlert(
                title = "Error",
                message='Please select a valid PDF file.',
                redirectTo = false,
                classType = "text-danger",
                btnType = "btn-danger",
            )
        }
    });
} catch (TypeError) {

}


function loadStatus(status){
    let statusEl = document.getElementsByClassName('status')
    let btn = document.getElementById('btn')
    let progressBar = document.getElementById('progressBar')
    let deleteBtn = document.querySelector('#delete')

    if (status) {
        try {
            progressBar.style.display = 'block';
            btn.classList.add('disabled')
            deleteBtn.classList.add('disabled')
            for (let i of statusEl){
                i.classList.remove('d-none')
                console.log("removing")
            } 
        } catch (error) {
            
        }
        
    }
    else{
        try {
            btn.classList.remove('disabled')
            deleteBtn.classList.remove('disabled')
            progressBar.style.display = 'none';
            for (let i of statusEl){
                i.classList.add('d-none')
                console.log("adding")
            }
        } catch (error) {
            
        }
    }
}

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

deleteMedia()


function deleteMedia(){
    let displayError = document.querySelector('#error')
    try{
        let deleteBtn = document.querySelector('#delete')
        deleteBtn.addEventListener('click', async ()=>{
    
            let url = deleteBtn.dataset.url
            let method = "DELETE"
            let data = JSON.stringify({})
    
            let option = {
                method: method,
                credentials: "include",
                body:data
            }
            loadStatus(true)
            const response = await fetch(url, option)
            const result = await response.json();
            console.log(result)
            if (response.ok) {
                messageAlert(
                title = "Success",
                message = result.message,
                redirectTo = result.redirectTo,
                classType = "text-danger",
                btnType = "btn-danger",
                )
                
            } 
            else {
                try {
                for(let i of result.errors){
                    displayError.insertAdjacentHTML(
                    'beforeend',
                    `<li>${i.msg}</li>`
                    
                    )
                }
                } catch {
                let errMessage;
                if (result.detail) errMessage = result.detail
                else if (result.message) errMessage = result.message;
                displayError.insertAdjacentHTML(
                    'beforeend',
                    `<li>${errMessage}</li>`
                )
                }
            }
            loadStatus(false)
        })
    }catch{
    
    }
}


function readURL(input){
    let reader = new FileReader();
    reader.onload = function(e){
    $('#id_image_display')
        .attr('src', e.target.result)
    };
    reader.readAsDataURL(input.files[0]);
}

