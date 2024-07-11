function Footer(){
    let el = `
        <div class="container">
            <div class="ft-upper text-center fw-bold" style="color: var(--yellow);">Get in Touch</div>
            <div class="row pb-3 align-items-center text-md-start text-center">
                <div class="col-md-4">
                    <div class="fs-1 fw-bold">
                        Don't Hesitate,
                    </div>
                    <div>
                        <a class="text-color-blue text-decoration-none fs-1 fw-bold" href="#">Contact Us</a>
                    </div>
                </div>
                <div class="col-md-4 d-grid d-md-flex align-items-center">
                    <div class="mx-2">
                        <img src="static/img/icon/location.png" width="30" alt="location">
                    </div>
                    <p>
                        Sheraton Hotel, Opposite
                        Benue State House of Assembly
                        Makurdi, Benue State, Nigeria
                    </p>
                </div>
                <div class="col-md-4">
                
                    <div class="d-grid">
                        <div class="my-1 d-sm-flex align-items-center"><img src="static/img/icon/email.png" width="30" alt="email"> <a class="nav-link fw-light fs-6 mx-1" href="mailto:glorycarriersministryint’l@gmail.com">glorycarriersministryint’l@gmail.com</a></div>
                        <div class="my-1 d-sm-flex align-items-center justify-content-center">
                            <img class="" src="static/img/icon/phone.png" width="30" alt="phone"> 
                            <div class="d-sm-flex mx-1">
                                <a class="nav-link fw-light fs-6" href="tel:+234 000 000 000">+234 000 000 000, </a>
                                <a class="nav-link fw-light fs-6" href="tel:+234 000 000 000">+234 000 000 000</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row" style="border: .3px solid var(--blue);">
            <div class="rounded-5" style="border: 1px solid var(--blue);"></div>
            </div>

            <div class="row align-items-start text-sm-start text-center mt-4 mb-5">
                <div class="col-sm-4">
                    <div class="fs-1 fw-light">
                        Quick Link
                    </div>
                    <ul class="ft-upper">
                        <li><a href="giving.html">Give</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="media.html">Media</a></li>
                    </ul>
                </div>
                <div class="col-sm-4">
                    <div class="fs-1 fw-bold">
                        Connect
                    </div>
                    <ul class="ft-upper fw-normal fs-5">
                        <li><a href="event.html">Event</a></li>
                        <li><a href="join_department.html">Join a Department Us</a></li>
                        <li><a href="">Testimonies</a></li>
                    </ul>
                </div>
                <div class="col-sm-4">
                    <div class="container">
                        <img src="static/img/logo.png" width="100%" alt="gcmi logo">
                    </div>
                    <p>
                        Sheraton Hotel, Opposite
                        Benue State House of Assembly
                        Makurdi, Benue State, Nigeria
                    </p>
                </div>
            
            </div>                
        </div>
        <div class="row mt-5 justify-content-center text-center" style="background-color: var(--white); color: var(--black);">
            <div class="p-3">
                © 2024 Glory Carriers Ministry Int’l. All Rights Reserved.
            </div>
        </div>
    `
    return el
}

export {Footer, }