document.addEventListener("DOMContentLoaded", function(event) {
   
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('mouseover', ()=>{
    // show navbar
    nav.classList.add('show')
    // change icon
    toggle.classList.add('bx-x')
    // add padding to body
    bodypd.classList.add('body-pd')
    // add padding to header
    headerpd.classList.add('body-pd')
    })
    }

    if(toggle && nav && bodypd && headerpd){
        document.getElementsByClassName('l-navbar')[0].addEventListener('mouseleave', ()=>{
        // show navbar
        nav.classList.remove('show')
        // change icon
        toggle.classList.remove('bx-x')
        // add padding to body
        bodypd.classList.remove('body-pd')
        // add padding to header
        headerpd.classList.remove('body-pd')
        })
        }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    // const linkColor = document.querySelectorAll('.nav_link')
    
    // function colorLink(){
    // if(linkColor){
    // linkColor.forEach(l=> l.classList.remove('active'))
    // this.classList.add('active')
    // }
    // }
    // linkColor.forEach(l=> l.addEventListener('click', colorLink))
    });