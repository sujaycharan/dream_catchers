let currentIndex = 0;
const slides = document.querySelectorAll('.slide');

function moveSlide(n) {
    currentIndex += n;

    // Wrap around when reaching the end
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    }

    // Update the position of the slides
    const slideWidth = slides[0].clientWidth;
    document.querySelector('.slides').style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}
setInterval(() => {
    moveSlide(1);
}, 3000);