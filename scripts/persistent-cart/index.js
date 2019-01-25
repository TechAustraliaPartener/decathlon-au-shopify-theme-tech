import gql from 'nanographql';

// TODO: Temporary, to confirm that the script is running
console.log('Persistent Cart: JS Loaded');

const apiURL = `${process.env.DECATHLON_PERSISTENT_CART_URL ||
  'http://localhost:8080'}/shopify/graphql`;

const makeRequest = (query, data) =>
  fetch(apiURL, {
    body: query(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw data.error;
      return data.data;
    });

makeRequest(
  gql`
    {
      customer(id: 2) {
        cart {
          id
        }
      }
    }
  `
).then(({ customer }) => console.log(customer.cart.id));

// TODO: Does this need an expiration?
const setCartCookie = cartId => {
  document.cookie = `cart=${cartId}; path=/`;
};

const deleteCartCookie = () => {
  document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

const customerLoginForm = document.querySelector('#CustomerLoginForm > form');

if (customerLoginForm) {
  customerLoginForm.addEventListener('submit', () => {
    // TODO: temporary hardcoded value
    setCartCookie('d3b0b5de56274bea158ddf8e348802be');
  });
}

const logoutLink = document.querySelector('.accountLogout-link');

if (logoutLink) {
  logoutLink.addEventListener('click', deleteCartCookie);
}
