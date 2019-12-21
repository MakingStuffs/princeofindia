(linkListener = () => {
  // Get all the links
  let links = document.querySelectorAll('.nav-link');
  // Iterate them
  links.forEach( link => {
    // Add an event listener to each link
    link.addEventListener('click', () => {
      // Check to see if the nav bar is in responsive mode & visible
      if( ulElem.style.display === 'block' )
        // If it is then hide it
        ulElem.style.display = 'none';
    });
  });
})();
// Responsive section
// Get the icon button
const iconBtn = document.querySelector('.nav-icon');
// Get the ul element
const ulElem = document.querySelector('#ulNav');
// Add an event listener
iconBtn.addEventListener('click', () =>  ( ulElem.style.display === 'block' ) ? ulElem.style.display = 'none' : ulElem.style.display = 'block' );
// Make the callback
const scrollHandler = () => {
  const head = document.querySelector('header');
  const nav = document.querySelector('nav');
  const main = document.querySelector('main');
  return window.pageYOffset >= head.offsetHeight ?
    ( nav.classList.add('fixed-top'),
    main.style.paddingTop = `${ nav.offsetHeight }px` ) :
    ( nav.classList.remove('fixed-top'),
    main.style.paddingTop = '0px');
}
// Make a throttler which takes a function and interval as arguments
function throttler (func, interval) {
  // Initialise timeout variable
  let timeout;
  // Return a function
  return () => {
    // Define the context and arguments
    let context = this, args = arguments;
    // Make anonymous function to call after timeout
    const later = () => {
      // Set timeout to false
      timeout = false;
    };
    // Check if the timeout is running
    if(!timeout){
      // execute the passed function
      func.apply(context, args);
      // set timeout to true
      timeout = true;
      // Create a timeout
      setTimeout(later, interval || 200);
    }
  };
};
// Watch for the nav bar to reach top of the page
document.addEventListener('scroll', throttler(scrollHandler), { capture: false, passive: true });

// Call ponyfill for CSS vars
cssVars({
  onlyLegacy: true
});