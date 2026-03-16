function readURL(input) {
    let reader = new FileReader();
    reader.onload = function (e) {
        $('#id_image_display')
            .attr('src', e.target.result)
    };
    reader.readAsDataURL(input.files[0]);
}

let y_top_objectEl = document.querySelectorAll('.scroll-y-top-el')
let y_down_objectEl = document.querySelectorAll('.scroll-y-down-el')
let x_top_objectEl = document.querySelectorAll('.scroll-x-top-el')
let x_down_objectEl = document.querySelectorAll('.scroll-x-down-el')

objectEl(y_top_objectEl, 'Y', '+')
objectEl(y_down_objectEl, 'Y', '-')
objectEl(x_top_objectEl, 'X', '+')
objectEl(x_down_objectEl, 'X', '-')

function objectEl(elementClass, axis, sign) {
    for (let element of elementClass) {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.style.transform = `translate${axis}(0)`
                } else {
                    element.style.transform = `translate${axis}(${sign}50%)`
                }
            })
        })

        observer.observe(element)
    }

}


// CHRISTMAS SECTION
(() => {
    const el = document.getElementById("christmas-float");
    if (!el) return;

    const STORAGE_KEY = "christmas-float-position";

    let isDragging = false;
    let startX, startY, initialX, initialY;

    /* Restore saved position */
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const { x, y } = JSON.parse(saved);
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.right = "auto";
        el.style.bottom = "auto";
    }

    /* Auto collapse after delay */
    setTimeout(() => {
        el.classList.add("collapsed");
    }, 3500);

    const startDrag = (e) => {
        isDragging = true;
        const evt = e.touches ? e.touches[0] : e;
        startX = evt.clientX;
        startY = evt.clientY;

        const rect = el.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        el.style.transition = "none";
    };

    const drag = (e) => {
        if (!isDragging) return;
        const evt = e.touches ? e.touches[0] : e;

        const dx = evt.clientX - startX;
        const dy = evt.clientY - startY;

        el.style.left = `${initialX + dx}px`;
        el.style.top = `${initialY + dy}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";
    };

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        el.style.transition = "";

        const rect = el.getBoundingClientRect();
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ x: rect.left, y: rect.top })
        );
    };

    el.addEventListener("mousedown", startDrag);
    el.addEventListener("touchstart", startDrag);

    window.addEventListener("mousemove", drag);
    window.addEventListener("touchmove", drag);

    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
})();