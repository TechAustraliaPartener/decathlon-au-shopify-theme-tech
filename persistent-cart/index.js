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
      message
    }
  `
).then(({ message }) => console.log(message));

makeRequest(
  gql`
    {
      name
    }
  `
);
