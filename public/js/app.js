let y_top_objectEl = document.querySelectorAll('.scroll-y-top-el')
let y_down_objectEl = document.querySelectorAll('.scroll-down-top-el')
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