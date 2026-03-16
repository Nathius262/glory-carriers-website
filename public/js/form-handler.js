//import { body, header } from "express-validator"
import {messageAlert} from './utils.js'


(function () {
    'use strict'
    console.log('form handler loaded')

  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        
        form.addEventListener('submit', async function (event) {
            
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            console.log("required")
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

                if (form.id == "update-form"){
                    method = "PUT";
                    console.log("updating form...")
                }else{
                    method = "POST";
                    console.log("creating form...")
                };

                console.log(formData)
                
                const response = await processForm(formData, url, method);
                const result = await response.json();

                if (response.ok) {
                    messageAlert(
                        title = "Form Processed Successful",
                        message = result.message,
                        redirectTo = result.redirectTo,
                        classType = "text-success",
                        btnType = "btn-success",
                    )
                } else {
                    messageAlert(
                        title = "Form submission failed",
                        message = result.message,
                        redirectTo = false,
                        classType = "text-success",
                        btnType = "btn-success",
                    )
                    
                }
            } catch (error) {
                    messageAlert(
                        title = "Form submission failed",
                        message = error.message,
                        redirectTo = false,
                        classType = "text-danger",
                        btnType = "btn-danger",
                    )

            } finally {
                // progressBar.style.display = 'none';
            }
            loadStatus(false)
        }
  
          form.classList.add('was-validated')
        }, false)
      })
      
})()



function loadStatus(status){
    let statusEl = document.getElementsByClassName('status')
    let btn = document.getElementById('btn')
    // let progressBar = document.getElementById('progressBar')

    if (status) {
        try {
            // progressBar.style.display = 'block';
            btn.classList.add('disabled')
            for (let i of statusEl){
                i.classList.remove('d-none')
                console.log("removing")
            } 
            try {
                let deleteBtn = document.querySelector('#delete')

                deleteBtn.classList.add('disabled')
                
            } catch (error) {
                
            }
            
        } catch (error) {
            
        }
        
    }
    else{
        try {
            btn.classList.remove('disabled')
            try {
                let deleteBtn = document.querySelector('#delete')
                deleteBtn.classList.remove('disabled')
            } catch (error) {
                
            }
            
            // progressBar.style.display = 'none';
            for (let i of statusEl){
                i.classList.add('d-none')
                console.log("adding")
            }
        } catch (error) {
            
        }
    }
}

async function processForm(formData, url, method) {
    
    try {
        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        return response;
    } catch (error) {
        throw new Error('Error submitting form: ' + error.message);
    }
}