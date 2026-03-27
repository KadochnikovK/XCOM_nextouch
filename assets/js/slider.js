document.addEventListener("DOMContentLoaded", function () {


    const speakersSwiper = new Swiper(".speakers__slider", {
        slidesPerView: "auto",
        spaceBetween: 60,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        simulateTouch: true,
        grabCursor: true,

        touchRatio: 0.6,
        touchAngle: 45,

        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 2,
            momentumBounce: true,
            momentumBounceRatio: 1,
            momentumVelocityRatio: 2,
            sticky: true,
        },

        speed: 600,
        resistanceRatio: 0.6,

        breakpoints: {
            320: {
                slidesPerView: 1,
                freeMode: {
                    enabled: true,
                    momentum: true,
                    momentumRatio: 3,
                    sticky: true,
                },
                speed: 800,
            },
            

        },
    });

})