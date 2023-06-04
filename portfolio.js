/*----------------Scroll Section Active Link Updation----------------*/

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () =>{
    sections.forEach(sec =>{
        let top = window.scrollY;
        let offset = sec.offsetTop-150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset+height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            })
        }
    })

/*----------------Sticky Navbar----------------*/

let header = document.querySelector('header');
header.classList.toggle('sticky', window.scrollY > 100);

/*----------------Removing toggle icon and navbar when clicked on navbar link(scroll)----------------*/

menuIcon.classList.remove('bx-x');
navbar.classList.remove('active');
}

/*----------------Toggle Icon navbar----------------*/

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

/*----------------Scroll Reveal----------------*/

ScrollReveal({
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
})

ScrollReveal().reveal('.home-content, .heading', { origin: 'top'});
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom'});
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left'});
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right'});

/*----------------Typed JS----------------*/

const typed = new Typed('.multiple-text', {
    strings: ['Engineering Student','Web Developer', 'Wanderlust', 'Gamer', 'REVAite'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

/*----------------Validation---------------- */

// Email validation function
function validateEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
// Mobile number validation function
function validatePhoneNumber(mobileNumber) {
    var mobilePattern = /^[6-9]\d{9}$/; 
    return mobilePattern.test(mobileNumber);
}

function validateForm() {
    var emailInput = document.getElementById("email");
    var mobileNumberInput = document.getElementById("mobileNumber");
  
    if (!validateEmail(emailInput.value)) {
      alert("Invalid email address!");
      return false;
    }
  
    if (!validatePhoneNumber(mobileNumberInput.value)) {
      alert("Invalid mobile number!");
      return false;
    }
  
    // If both email and mobile number inputs are valid, allow form submission
    return true;
}
  
  
