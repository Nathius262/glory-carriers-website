let y_top_objectEl = document.querySelectorAll('.scroll-y-top-el')
let y_down_objectEl = document.querySelectorAll('.scroll-y-down-el')
let x_top_objectEl = document.querySelectorAll('.scroll-x-top-el')
let x_down_objectEl = document.querySelectorAll('.scroll-x-down-el')

objectEl(y_top_objectEl, 'Y', '+')
objectEl(y_down_objectEl, 'Y', '-')
objectEl(x_top_objectEl, 'X', '+')
objectEl(x_down_objectEl, 'X', '-')

function objectEl(elementClass, axis, sign){
    for (let element of elementClass){
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting){
                    element.style.transform = `translate${axis}(0)`
                }else{
                    element.style.transform = `translate${axis}(${sign}50%)`
                }
            })
        })
        
        observer.observe(element)
    }
    
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()