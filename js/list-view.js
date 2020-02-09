const containee = document.getElementById('api-list-container');

let request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000/api/furniture', true);
request.onload = function () {

  let data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for (let i = 0; i < data.length; i++) {
      //CARD div
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      //Item name h2
      const itemName = document.createElement('h2');
      itemName.textContent = data[i].name;
      //Item picture img
      const picture = document.createElement('img');
      picture.setAttribute('class', 'pictures');
      picture.src = data[i].imageUrl;
      //Additional info circle in the bottom of the picture
      const infoCircle = document.createElement('i')
      infoCircle.setAttribute('class', 'fas fa-question-circle')
      //Item price - separate div because of alining items
      const price = document.createElement('div');
      price.textContent = 'Price: ' + '$' + data[i].price;
      //Label for Item varnish
      const varnishLabel = document.createElement('label');
      varnishLabel.textContent = 'Pick varnish:';
      //Item varsnih select tag
      let varnish = document.createElement('select');
      varnish.setAttribute('class', 'varnish');
      //Item varnish options
      for (let j = 0; j < data[i].varnish.length; j++) {
        const option = document.createElement('option')
        option.textContent = data[i].varnish[j];
        option.value = data[i].varnish[j];
        varnish.appendChild(option);
      }
      //Card form and INPUT for amount of items
      const cardForm = document.createElement('form');
      let numberOfItems = document.createElement('input');
      numberOfItems.setAttribute('class', 'numberChosen');
      numberOfItems.setAttribute('type', 'number');
      numberOfItems.setAttribute('min', '1');
      numberOfItems.setAttribute('max', '50');
      numberOfItems.value = '1';
      //Item paragraph
      const p = document.createElement('p');
      p.textContent = data[i].description;
      //Buttons for the cards **START**
      //Separate div for alining
      const addToCartButtonDiv = document.createElement('div');
      addToCartButtonDiv.setAttribute('class', 'button-div');
      const addToCartButton = document.createElement('button');
      const removeFromCartButton = document.createElement('button');
      //Function to swap from ADD TO THE CART --> ADDED and REMOVE ITEM buttons
      function swapButtons() {
        //Change from ADD TO THE CART to ADDED button with class disabled
        addToCartButtonDiv.appendChild(addToCartButton);
        addToCartButton.setAttribute('class', 'btn btn-success disabled');
        varnish.disabled = true;
        numberOfItems.disabled = true;
        addToCartButton.textContent = 'Added';
        //Adding REMOVE ITEM button
        removeFromCartButton.setAttribute('class', 'btn btn-danger');
        addToCartButtonDiv.appendChild(removeFromCartButton);
        removeFromCartButton.textContent = 'Remove item';
      }
      //Check in Local Storage if there is same ID as from the API and set starting buttons accordingly
      if (localStorage.getItem(data[i]._id)) {
        swapButtons();
      } else {
        addToCartButtonDiv.appendChild(addToCartButton);
        addToCartButton.textContent = 'Add to the Cart';
        addToCartButton.setAttribute('class', 'btn btn-primary');
      }
      //Event listener for input field, check if amount between 1 and 50, disable button ADD TO THE CART if false
      let errorCardDiv = document.createElement('div');
      numberOfItems.addEventListener('input', () => {
        if ((numberOfItems.value < 1) || (numberOfItems.value > 50)) {
          numberOfItems.select();
          addToCartButton.disabled = true;
          addToCartButton.classList.add('disabled');
          errorCardDiv.innerHTML = 'Please enter number between 1-50';
          return false;
        } else {
          addToCartButton.disabled = false;
          addToCartButton.classList.remove('disabled');
          errorCardDiv.innerHTML = '';
        }
      });
      //Event listener for ADD TO THE CART button
      addToCartButton.addEventListener('click', () => {
        let varnishChoosen = document.getElementsByClassName('varnish')[i].value;
        let numberOfItemsChoosen = document.getElementsByClassName('numberChosen')[i].value;
        swapButtons();
        bothItem = [data[i].name, data[i].imageUrl, data[i].price, numberOfItemsChoosen, varnishChoosen];
        localStorage.setItem(data[i]._id, JSON.stringify(bothItem));
      });
      //Event listener for REMOVE ITEM button
      removeFromCartButton.addEventListener('click', () => {
        addToCartButton.setAttribute('class', 'btn btn-primary');
        addToCartButton.textContent = 'Add to the Cart';
        varnish.disabled = false;
        numberOfItems.disabled = false;
        localStorage.removeItem(data[i]._id);
        addToCartButtonDiv.removeChild(removeFromCartButton);
      });
      //Event Listener for click on picture to get personalized view
      picture.addEventListener('click', () => {
        let divOnTop = document.getElementById('divOnTop');
        divOnTop.style.display = 'block';
        let closeButton = document.createElement('span');
        closeButton.textContent = "x";
        closeButton.setAttribute('id', 'closeButton');
        divOnTop.appendChild(closeButton);
        //Event listener for the close button in onTopDiv
        closeButton.addEventListener('click', () => {
          divOnTop.removeChild(cardClone);
          divOnTop.style.display = 'none';
        });
        //Clone card with chidren and add it to the parent DIV
        cardClone = card.cloneNode(true) //true in order to clone all children, false only clone the node
        divOnTop.appendChild(cardClone);
        //Loading elements from divOnTop because cloneNode does not copy listen events
        let cardOnTop = divOnTop.getElementsByClassName('card')[0];
        let cardOnTopButtonDiv = cardOnTop.getElementsByClassName('button-div')[0];
        let addToCartButtonDivOnTop = cardOnTopButtonDiv.getElementsByClassName('btn btn-primary')[0];
        let removeFromCartButtonDivOnTop = document.createElement('button');
        //Check if there are 2 buttons present in onder to change the starting values of
        if (cardOnTopButtonDiv.children.length === 2) {
          addToCartButtonDivOnTop = document.createElement('button');
          addToCartButtonDivOnTop.setAttribute('class', 'btn btn-primary');
          removeFromCartButtonDivOnTop = document.getElementsByClassName('btn btn-danger')[0];
        }
        //Check if error message is displayed, if it is, display the message in divOnTop as well
        if (errorCardDiv.innerText != '') {
          cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].style.display = 'block';
        } else {
          cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].style.display = 'none';
        }
        //Function for ADD TO THE CART button in divOnTop
        function divOnTopButtonAddToTheCart() {
          addToCartButtonDivOnTop.addEventListener('click', () => {
            varnishChoosen = cardOnTop.getElementsByClassName('varnish')[0].value;
            numberOfItemsChoosen = cardOnTop.getElementsByClassName('numberChosen')[0].value;
            swapButtonsDivOnTop();
            swapButtons();
            bothItem = [data[i].name, data[i].imageUrl, data[i].price, numberOfItemsChoosen, varnishChoosen];
            localStorage.setItem(data[i]._id, JSON.stringify(bothItem));
          });
        }
        divOnTopButtonAddToTheCart()
        //Event listener for REMOVE ITEM button in divOnTop
        removeFromCartButtonDivOnTop.addEventListener('click', () => {
          addToCartButton.setAttribute('class', 'btn btn-primary');
          addToCartButton.textContent = 'Add to the Cart';
          addToCartButtonDiv.removeChild(removeFromCartButton);
          varnish.disabled = false;
          numberOfItems.disabled = false;
          varnishDivOnTop.disabled = false;
          numberOfItemsDivOnTop.disabled = false;
          //Check how many buttons are present because variable addToCartButtonDivOnTop needs updating
          if (cardOnTopButtonDiv.children.length === 2) {
            addToCartButtonDivOnTop = cardOnTopButtonDiv.getElementsByClassName('btn btn-success disabled')[0]
            divOnTopButtonAddToTheCart(); //Since variable was updated, event listener needs updating
          }
          addToCartButtonDivOnTop.setAttribute('class', 'btn btn-primary');
          addToCartButtonDivOnTop.textContent = 'Add to the Cart';
          localStorage.removeItem(data[i]._id);
          cardOnTopButtonDiv.removeChild(removeFromCartButtonDivOnTop);
        });
        //Function for swaping buttons in divOnTop, same as swapButtons, but different variables
        function swapButtonsDivOnTop() {
          cardOnTopButtonDiv.appendChild(addToCartButtonDivOnTop);
          addToCartButtonDivOnTop.setAttribute('class', 'btn btn-success disabled');
          addToCartButtonDivOnTop.textContent = 'Added';
          varnishDivOnTop.disabled = true;
          numberOfItemsDivOnTop.disabled = true;
          removeFromCartButtonDivOnTop.setAttribute('class', 'btn btn-danger');
          cardOnTopButtonDiv.appendChild(removeFromCartButtonDivOnTop);
          removeFromCartButtonDivOnTop.textContent = 'Remove item';
        }
        //Event listener for update of Varnish in divOnTop
        let varnishDivOnTop = cardOnTop.getElementsByClassName('varnish')[0];
        varnishDivOnTop.addEventListener('input', () => {
          varnish.value = varnishDivOnTop.value;
        });
        //Event listener for update of Amount in divOnTop
        let numberOfItemsDivOnTop = cardOnTop.getElementsByClassName('numberChosen')[0];
        numberOfItemsDivOnTop.addEventListener('input', () => {
          numberOfItems.value = numberOfItemsDivOnTop.value;
          //Check if input amount is between 1 and 50, disable ADD TO CART if false
          if ((numberOfItemsDivOnTop.value < 1) || (numberOfItemsDivOnTop.value > 50)) {
            numberOfItemsDivOnTop.select();
            addToCartButtonDivOnTop.disabled = true;
            addToCartButton.disabled = true;
            addToCartButtonDivOnTop.classList.add('disabled');
            errorCardDiv.innerHTML = 'Please enter number between 1-50';
            cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].innerHTML = 'Please enter number between 1-50';
            cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].style.display = 'block';
            return false;
          } else {
            addToCartButtonDivOnTop.disabled = false;
            addToCartButton.disabled = false;
            addToCartButtonDivOnTop.classList.remove('disabled');
            errorCardDiv.innerHTML = '';
            cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].innerHTML = '';
            cardOnTop.getElementsByTagName('form')[0].getElementsByTagName('div')[0].style.display = 'none';
          }
        });
      });
      //Buttons for the cards END
      //Put everything into place
      containee.appendChild(card);
      card.append(itemName, picture, infoCircle, p, price, cardForm, addToCartButtonDiv);
      cardForm.append(varnishLabel, varnish, numberOfItems, errorCardDiv);
    }
  } else {
    alert('Problem with connection to the API, please contact support');
  }
}
request.send();