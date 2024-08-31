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
          }

          else{
            event.preventDefault()
            event.stopPropagation()

            //loading status
            let status = document.getElementById('status')
            let btn = document.getElementById('btn')
            let displayError = document.querySelector('#error')

            status.classList.remove('d-none')
            btn.classList.add('disabled')
            displayError.innerHTML = ""

            const form = event.target;
            const formData = new FormData(form);
            const url = form.action;
            const formDataObj = JSON.stringify(Object.fromEntries(formData))

            try {

              let method;

              if (form.id == "update-user-form"){
                method = "PUT";
                console.log("updating user...")
              }else{
                method = "POST";
                console.log("creating user...")
              };
              
              const response = await authenticate(formDataObj, url, method);
              const result = await response.json();
        
              if (response.ok) {
                alert('SUCCESS');
                if(result.redirectTo){
                  window.location.href = result.redirectTo
                }
                //window.location.reload()
                
              } 
              else {
                try {
                  for(let i of result.errors){
                    displayError.insertAdjacentHTML(
                      'beforeend',
                      `<li>${i.msg}</li>`
                      
                    )
                    console.log(i.msg)
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
            } 
            catch (error) {
              console.log(error)
              alert('authentication error:', error);
            } 
            finally {
            }
            status.classList.add('d-none')
            btn.classList.remove('disabled')
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})()


async function authenticate(data, url, method) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body:data,
    }).then(response => {
        return {
            ok: response.ok,
            status: response.status,
            json: () => response.json()
        };
    }).catch(error => {
        throw new Error('Network error: ', error);
    });
}