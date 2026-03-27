const hamburger = document.querySelector(".header__hamburger");
const menu = document.querySelector(".header__menu");
const offerContent = document.querySelector(".offer__content");


menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
offerContent.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

hamburger.addEventListener("click", function () {
    this.classList.toggle("active");

    if (menu.classList.contains("active")) {

        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';

        offerContent.style.opacity = '1';
        offerContent.style.visibility = 'visible';


        setTimeout(() => {
            menu.classList.remove("active");
            offerContent.classList.remove("active");
        }, 300);
    } else {

        offerContent.style.opacity = '0';
        offerContent.style.visibility = 'hidden';

        menu.style.opacity = '1';
        menu.style.visibility = 'visible';


        menu.classList.add("active");
        offerContent.classList.add("active");
    }

});

const menuLinks = document.querySelectorAll(".header__link");
menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
        hamburger.classList.remove("active");


        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';

        offerContent.style.opacity = '1';
        offerContent.style.visibility = 'visible';


        setTimeout(() => {
            menu.classList.remove("active");
            offerContent.classList.remove("active");
        }, 300);


    });
});