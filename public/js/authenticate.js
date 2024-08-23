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
              const response = await authenticate(formDataObj, url);
              const result = await response.json();
        
              if (response.ok) {
                console.log(result.isAdmin)
                if(result.isAdmin === true){
                  alert('authentication successful: You are about to loggin as an admin', );
                  window.location.href = "/admin"
                }
                else if (result.isAdmin == undefined || result.isAdmin == false || result.isAdmin == null){
                  alert('authentication successful!');
                  window.location.href = "/"
                }
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
                  displayError.insertAdjacentHTML(
                    'beforeend',
                    `<li>${result.message}</li>`
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


async function authenticate(data, url) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
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