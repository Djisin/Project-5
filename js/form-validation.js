function formValidation() {
  // Make quick references to our fields.
  let firstname = document.getElementById('firstName');
  let lastname = document.getElementById('lastName');
  let email = document.getElementById('email');
  let address = document.getElementById('address');
  let city = document.getElementById('city');
  
  // To check empty form fields.
  if (firstname.value.length == 0){
    document.getElementById('error-info').innerText = "* Correct first name is required *";
    firstname.focus();
    return false;
  }
  if (lastname.value.length == 0){
    document.getElementById('error-info').innerText = "* Correct last name is required *";
    lastname.focus();
    return false;
  }
  if (email.value.length == 0){
    document.getElementById('error-info').innerText = "* Correct email is required *";
    email.focus();
    return false;
  }
  if (city.value.length == 0){
    document.getElementById('error-info').innerText = "* Correct city name is required *";
    city.focus();
    return false;
  }
  if (address.value.length == 0){
    document.getElementById('error-info').innerText = "* Correct address is required *";
    address.focus();
    return false;
  }
 
  // Check each input in the order that it appears in the form.
  if (inputAlphabet(firstname, "* For your first name please use alphabets only *")) {
    if (inputAlphabet(lastname, "* For your last name please use alphabets only *")) {
      if (emailValidation(email, "* Please enter a valid email address *")) {
        if (inputAlphabet(city, "* Please enter a valid City name *")) {
          if (textAlphanumeric(address, "* For Address please use numbers and letters *")) {
            return true;
          }
        }  
      }
    }
  }
  return false;
}
// Function that checks whether input text is an alphabetic character or not.
function inputAlphabet(inputtext, alertMsg) {
  let alphaExp = /^(?=^[A-Za-z]+\s?[A-Za-z]+\s?[A-Za-z]+$).{3,30}$/;
  if (inputtext.value.match(alphaExp)) {
    return true;
  } else {
    document.getElementById('error-info').innerText = alertMsg;
    inputtext.value = '';
    inputtext.focus();
    return false;
  }
}
// Function that checks whether input text includes alphabetic and numeric characters.
function textAlphanumeric(inputtext, alertMsg) {
  let alphaExp = /[\w',-\\/.\s]/;
  if (inputtext.value.match(alphaExp)) {
    return true;
  } else {
    document.getElementById('error-info').innerText = alertMsg; // This segment displays the validation rule for address.
    inputtext.value = '';
    inputtext.focus();
    return false;
  }
}
// Function that checks whether an user entered valid email address or not and displays alert message on wrong email address format.
function emailValidation(inputtext, alertMsg) {
  let emailExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (inputtext.value.match(emailExp)) {
    return true;
  } else {
    document.getElementById('error-info').innerText = alertMsg; // This segment displays the validation rule for email.
    inputtext.focus();
    inputtext.value = '';
    return false;
  }
}