function Header(){
    let el = `
        <div class="container">
            <a class="navbar-brand" href="index">
                <img src="static/img/logo.png" width="200" alt="GCMI lOGO">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="navbarsExample04">
                <ul class="navbar-nav ml-auto" style="text-transform: uppercase;">
                    <li class="nav-item">
                        <a class="nav-link" href="index">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About Us</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="event.html">Event</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="#">Giving</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="media.html">Media</a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="#">Contact Us</a>
                    </li> 
                </ul>
                
            </div>
        </div>
    `
    return el
}

export {Header,}