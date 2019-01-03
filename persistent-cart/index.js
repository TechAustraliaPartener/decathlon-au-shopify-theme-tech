import gql from 'nanographql';

console.log('persistent cart');

const makeRequest = (query, data) =>
  fetch('http://localhost:8080/shopify/graphql', {
    body: query(data),
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  })
    .then(d => d.json())
    .then(d => {
      if (d.error) throw d.error;
      return d.data;
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

const setCartCookie = cartId => {
  document.cookie = `cart=${cartId}; path=/`;
};

const deleteCartCookie = () => {
  document.cookie = `cart=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

const customerLoginForm = document.querySelector('#CustomerLoginForm > form');

if (customerLoginForm) {
  customerLoginForm.addEventListener('submit', () => {
    setCartCookie('d3b0b5de56274bea158ddf8e348802be');
  });
}

const logoutLink = document.querySelector('.accountLogout-link');

if (logoutLink) {
  logoutLink.addEventListener('click', deleteCartCookie);
}
