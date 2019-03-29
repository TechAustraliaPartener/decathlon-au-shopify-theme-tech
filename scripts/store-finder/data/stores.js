export default () =>
  new Promise((resolve, reject) => {
    const data = [
      {
        address_type: null,
        city: 'San Francisco',
        code: null,
        company: 'Decathlon',
        country: 'US',
        email: 'customer.service@decathlon.com',
        id: 'adr_GezSSC9M',
        is_residential: false,
        is_warehouse: false,
        name: 'San Francisco',
        phone_number: '(123) 000 0000',
        state: 'CA',
        street1: '735 Market St',
        street2: 'Open until 11:00 pm',
        validated: false,
        zip: '94103'
      },
      {
        address_type: 'destination',
        city: 'Emeryville',
        code: null,
        company: 'Decathlon',
        country: 'US',
        email: 'customer.service@decathlon.com',
        id: 'adr_K6s3Kaja',
        is_residential: false,
        is_warehouse: false,
        name: 'Ashley Benson',
        phone_number: '1234567890',
        state: 'CA',
        street1: '3938 Horton St',
        street2: 'Open until 10:00 pm',
        validated: false,
        zip: '94608'
      }
    ];

    data.length > 0
      ? resolve(data)
      : reject(new Error('Stores data array is empty.'));
  });