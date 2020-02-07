const cartItemsList = document.getElementById('cart-items-list');

let request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000/api/furniture', true);
request.onload = function () {
  // Begin accessing JSON data here
  let data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for (let i = 0; i < data.length; i++) {
      const idNumber = data[i]._id;
      function getItemsfromLocalStorage() {
        if (localStorage.getItem(idNumber) != null) {
          let itemFromLocalStorage = localStorage.getItem(idNumber);
          itemFromLocalStorage = JSON.parse(itemFromLocalStorage);
          //Cart line div
          const cartItem = document.createElement('div');
          cartItem.setAttribute('class', 'cartItem');
          //Item name stored in local storage
          const itemName = document.createElement('h2');
          itemName.textContent = itemFromLocalStorage[0];
          //Item picture stored in local storage
          const picture = document.createElement('img');
          picture.src = itemFromLocalStorage[1];
          //Item price stored in local storage
          const price = document.createElement('span');
          price.setAttribute('class', 'price-per-item')
          price.textContent = '$' + itemFromLocalStorage[2] + ' x';
          price.value = itemFromLocalStorage[2];
          //Item amount stored in local storage
          const numberOfItemsChoosen = document.createElement('input');
          numberOfItemsChoosen.value = itemFromLocalStorage[3];
          numberOfItemsChoosen.setAttribute('class', 'numberChosen');
          numberOfItemsChoosen.setAttribute('type', 'number');
          numberOfItemsChoosen.setAttribute('min', '1');
          numberOfItemsChoosen.setAttribute('max', '50');
          //Item varnish stored in local storage
          const varnishChoosen = document.createElement('span');
          varnishChoosen.textContent = itemFromLocalStorage[4];
          //Item total cost PRICE * AMOUNT
          const itemTotal = document.createElement('span');
          itemTotal.setAttribute('class', 'total-price-per-item')
          itemTotal.textContent = '$' + itemFromLocalStorage[2] * itemFromLocalStorage[3];
          itemTotal.value = itemFromLocalStorage[2] * itemFromLocalStorage[3];
          //Add remove button to each div and assign id value to it
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.setAttribute('class', 'btn btn-danger');
          removeButton.value = idNumber;
          //Append everything to the cart and cart item
          cartItemsList.appendChild(cartItem);
          cartItem.append(itemName, picture, varnishChoosen, price, numberOfItemsChoosen, itemTotal, removeButton);
        }
      }
      getItemsfromLocalStorage(); //Execute the function for getting items
    }
  } else {
    alert('There is an error with the cart, please contact support');
  }
  removeFromCart(); //Activate event listeners for the remove buttons
}
request.send();
//Function for buttons removing from the cart
function removeFromCart() {
  let removeFromTheCartButton = document.getElementsByClassName('btn-danger');
  for (let i = 0; i < removeFromTheCartButton.length; i++) {
    let button = removeFromTheCartButton[i];
    button.addEventListener('click', ($event) => {
      let buttonClicked = $event.target.value;
      localStorage.removeItem(buttonClicked);
      location.reload();
    })
  }
  //Listen for item amount changes and updating cart total
  let inputAmount = document.getElementsByClassName('numberChosen');
  for (let i = 0; i < inputAmount.length; i++) {
    let input = inputAmount[i];
    input.addEventListener('change', () => {
      if (input.value < 1) {
        input.value = 1;
      } else if (input.value > 50) {
        input.value = 50;
      }
      updateCartTotal();
    })
  }
  updateCartTotal();
}
//Update both cart and total for each item
function updateCartTotal() {
  let cartItemRows = document.getElementById('cart-items-list').getElementsByClassName('cartItem');
  let total = 0;
  let totalPerItem = 0;
  for (let i = 0; i < cartItemRows.length; i++) {
    cartItemRow = cartItemRows[i];
    let itemPrice = cartItemRow.getElementsByClassName('price-per-item')[0].value;
    let itemAmount = cartItemRow.getElementsByClassName('numberChosen')[0].value;
    totalPerItem = itemPrice * itemAmount;
    total = total + (itemPrice * itemAmount);
    document.getElementsByClassName('total-price-per-item')[i].innerText = '$' + totalPerItem;
  }
  document.getElementById('total-payment').innerText = '$' + total;
}
//Get contact info into the required object
function getContactInfo() {
  firstName = document.getElementById('firstName').value;
  lastName = document.getElementById('lastName').value;
  email = document.getElementById('email').value;
  city = document.getElementById('city').value;
  address = document.getElementById('address').value;
  contact = { firstName, lastName, email, city, address }
  return contact
}
//Required submit object for the "/order" end point
let submit = {};
submitButton = document.getElementById('submit-order');
submitButton.addEventListener('click', ($event) => {
  $event.preventDefault();
  let sendingIdsElement = document.getElementsByClassName('btn-danger');
  let sendingIds = []; //Array for item ids
  for (let i = 0; i < sendingIdsElement.length; i++) {
    sendingIds.push(sendingIdsElement[i].value);
  }
  //Check how many items in the cart
  if (sendingIdsElement.length >= 1) {
    getContactInfo();
    //Check if all contact input fields meet the criteria
    if (formValidation()) {
      //Add to submit object
      submit = {
        contact: contact,
        products: sendingIds
      };
    } else {
      return false;
    }
    submitFormData(submit);
  } else {
    document.getElementById('error-info').innerText = 'Your cart is empty!'
    return false;
  }
});
// POST request
function makeRequest(submit) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('POST', api + '/order');
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 400) {
          resolve(request.response);
        } else {
          reject(request.response);
        }
      }
    };
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(submit));
  });
}
async function submitFormData(submit) {
  try {
    const requestPromise = makeRequest(submit);
    const response = await requestPromise;
    responseId = (JSON.parse(response));
    localStorage.clear();
    localStorage.setItem('orderId', responseId.orderId);
    document.getElementById("customer-info").reset();
    window.location.replace("order-confirmation.html");
  }
  catch (errorResponse) {
    alert(errorResponse.error);
  };
}