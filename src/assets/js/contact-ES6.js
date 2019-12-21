// Get select drop down
const dropdown = document.querySelector('select');
// Get select container
const selectCont = document.querySelector('#selectCont');
// Hide original dropdown
dropdown.classList.add('kill');
// Make a div for the new active option
const selectedDiv = document.createElement('div');
// Add a class to the new div so it can act as the holder for selected items
selectedDiv.classList.add('cs-selected', 'selector');
// Set its data-value
selectedDiv.dataset.value = dropdown[0].value;
// Set its content to match the first dropdown option
selectedDiv.innerHTML = dropdown[0].innerHTML;
// Set the selected div's name
selectedDiv.setAttribute('name', dropdown.name);
// Append it to the container
selectCont.append(selectedDiv);
// Add an event listener to open the options container
selectedDiv.addEventListener('click', () => {
  // Toggle this element's style
  selectedDiv.classList.toggle('open');
  // Toggle option container's style
  optionCont.classList.toggle('open-options');
  // Toggle the kill class
  optionCont.classList.toggle('kill');
});
// Make a div to hold the options
const optionCont = document.createElement('div');
// Add its class
optionCont.classList.add('selector', 'cs-options', 'kill');
// Append it
selectCont.append(optionCont);
// Cycle through options and create a div for each
for( let i = 0; i < dropdown.length; i++) {
  // Make a new div for each option
  let newDiv = document.createElement('div');
  // Set its class
  newDiv.classList.add('cs-option');
  // Set a dataset value
  newDiv.dataset.value = dropdown[i].value;
  // Set its HTML content
  newDiv.innerHTML = dropdown[i].innerHTML;
  // Append it to the option list
  optionCont.append(newDiv);
  // Add an event listener to each option
  newDiv.addEventListener('click', function() {
    // Set the content of the main selector div
    selectedDiv.innerHTML = this.innerHTML;
    // Set the value of the actual selector
    dropdown.value = this.dataset.value;
    // Set the active dataset value
    selectedDiv.dataset.value = this.dataset.value;
    // Hide the option container
    optionCont.classList.add('kill');
    // Toggle this element's style
    selectedDiv.classList.toggle('open');
    // Toggle option container's style
    optionCont.classList.toggle('open-options');
  });
}
// function to close selector if clicked outside of it
const closeAll = (e) => {
  if(e.target !== selectedDiv) {
    // Hide the option container
    optionCont.classList.add('kill');
    // Toggle this element's style
    selectedDiv.classList.remove('open');
    // Toggle option container's style
    optionCont.classList.remove('open-options');
  }
};
// Event listener to close menu if clicked outside of it
document.addEventListener('click', closeAll);
// Set the minimum and maximum values of the date input if it exists
// Wait till the document is loaded
document.addEventListener('DOMContentLoaded', () => {
// Get date element
let dateSelect = document.querySelector('input[name="date"]');
// Check it isn't null
if(dateSelect !== null) {
  // Set it's minimum to today
  dateSelect.min = new Date().toISOString().split('T')[0];
  // Make it show today as a default
  dateSelect.value = new Date().toISOString().split('T')[0];
}
});
// Get the form and its input elements
const form = document.querySelector('form'),
  email = document.querySelector('input[name="email"]'),
  phone = document.querySelector('input[name="phone"]'),
  subject = document.querySelector('div[name="subject"]'),
  guests = document.querySelector('div[name="guests"]'),
  time = document.querySelector('input[name="time"]'),
  date = document.querySelector('input[name="date"]'),
  message = document.querySelector('textarea[name="message"]'),
  firstName = document.querySelector('input[name="first-name"]'),
  lastName = document.querySelector('input[name="last-name"]'),
  subscribe = document.querySelector('input[name="mailList"]');
// Listen for the submit event
form.onsubmit = (e) => formValidator(e);

// Form validator
const formValidator = (e) => {
  // Get the loader
  const loader = document.querySelector('.loader');
  // Make the loader exist in the DOM
  loader.classList.remove('kill');
  // Make the loader fade in
  loader.classList.remove('hide');
  // Get the form fields element
  const formFields = document.querySelector('#formFields');
  // Hide it
  formFields.classList.add('hide');
  // Stop it from redirecting to the php page
  e.preventDefault();
  const regex = new RegExp('[{}<>[]\^]+', 'gi');
  if( regex.test( firstName.value ) || regex.test( lastName.value )) {
    let errMsg = 'It looks like you\'ve used illegal characters in your name. You\'re not allowed to use any of the following characters: "{ } [ ] < > ^';
    return responseMessage(null, errMsg);
  } else if( regex.test( message.value )) {
    let errMsg = 'It looks like you\'ve used illegal characters in your message. You\'re not allowed to use any of the following characters: "{ } [ ] < > ^';
    return responseMessage(null, errMsg);
  } else if( !!guests && guests.dataset.value === '0' ) {
    let errMsg = 'It looks like you haven\'t selected the number of guests you wish to book a table for. Please select from the dropdown menu.';
    return responseMessage(null, errMsg);
  } else if( !!subject && subject.dataset.value === '0' ) {
    let errMsg = 'It looks like you haven\'t selected a subject for your query, Please select one from the drop down menu.';
    return responseMessage(null, errMsg);
  } else {
    return submitHandler(e);
  }
};

// Submit the data
const submitHandler = () => {
  // Make a form data object - formats the data to that of a php post request
  let data = new FormData(form);
  // Send the form data to the php mailer script
  fetch('./assets/php/contact.php', {
    method: "POST",
    body: data
  })
  // Then Check if there was an error
  .then(res => responseMessage(res))
  .catch(err => console.error(err));
};

// Make the response message callback 
const responseMessage = (res = null, err = null) => {
  // Make the close button
  const closeBtn = document.createElement('a');
  closeBtn.setAttribute('id', 'closeBtn');
  closeBtn.setAttribute('class', 'pos-rel bg-blue button');
  closeBtn.setAttribute('title', 'Close this message');
  closeBtn.addEventListener('click', closeMsg);
  closeBtn.textContent = 'Close';
  // Get the loader
  const loader = document.querySelector('.loader');
  // Get the response container
  const resContainer = document.querySelector('#form-response');
  if(res !== null && res.ok ) {
    // Remove the error class if it has been attached.
    if(resContainer.classList.contains('error'))
      resContainer.classList.remove('error');
    // Set the HTML content of the response holder.
    resContainer.innerHTML = `
    <h4 class="txt-25rem india-font">Message Sent!</h4>
    <p class="txt-15rem">Your message has been sent and someone will respond ASAP</p>
    <a class="pos-rel bg-blue button" href="./" title="Prince of India homepage" rel="internal">Return Home</a>
    `;
    // Kill the loader
    loader.classList.add('hide');
    loader.classList.add('kill');
    // Wake the response message
    resContainer.classList.remove('kill', 'hide');
    // Append the close button to the container 
    resContainer.appendChild(closeBtn);
    // Reset the form fields.
    form.reset();
  } else {
    // Add the error class to the response
    resContainer.classList.add('error');
    // Set the html
    resContainer.innerHTML = `
    <h4 class="txt-25rem india-font">Sending Failed...</h4>
    <p class="txt-15rem">${err}</p>
    <a class="pos-rel bg-blue button" href="./" title="Prince of India homepage">Return Home</a>
    `;
    // Kill the loader
    loader.classList.add('hide');
    loader.classList.add('kill');
    // Show the response message
    resContainer.classList.remove('kill', 'hide');
    // Append the close button to the container 
    resContainer.appendChild(closeBtn);
  }
};

function closeMsg () {
  // Get the container
  const resContainer = document.querySelector('#form-response'),
    // GEt the form fields
    formFields = document.querySelector('#formFields');
  // Check if the fields are hidden
  if(formFields.classList.contains('hide')) {
    // Show them if they are
    formFields.classList.remove('hide');
    // Reset the content of the custom dropdown
    selectedDiv.innerHTML = dropdown[0].innerHTML;
    // Kill the response message.
    resContainer.classList.add('kill', 'hide');
  } else {
    resContainer.classList.add('kill');
  }
}