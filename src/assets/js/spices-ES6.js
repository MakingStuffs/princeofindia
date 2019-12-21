// Get the spice list items
const spiceList = document.querySelectorAll('.spice-name');
// Add an event listener to each
spiceList.forEach( function(spice) {
    spice.addEventListener('click', changeSlide);
});
// Function to change slides
function changeSlide () {
    // Get all slides
    const slides = Array.from(document.querySelectorAll('.spice-slide'));
    // Get the image of the next slide
    let image = this.dataset.image;
    // Set the background of the slide section
    document.querySelector('.spice-section').style = `background-image: url('${image}')`;
    // Get active slide
    let activeSlide = slides.filter(slide => slide.classList.contains('active'))[0];
    // Get desired slide
    let newSlide = slides.filter(slide => slide.dataset.name === this.dataset.name)[0];
    // Kill the active slide
    activeSlide.classList.replace('active', 'kill');
    activeSlide.classList.add('hide');
    // Wake the new slide
    newSlide.classList.replace('kill', 'active');
    newSlide.classList.remove('hide');
}