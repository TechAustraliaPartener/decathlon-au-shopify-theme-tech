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
        name: 'Emeryville',
        phone_number: '1234567890',
        state: 'CA',
        street1: '3938 Horton St',
        street2: 'Grand Opening April 12th 9am',
        validated: false,
        zip: '94608'
      },
      {
        address_type: null,
        city: 'San Francisco',
        code: null,
        company: 'Decathlon',
        country: 'US',
        email: 'customer.service@decathlon.com',
        id: 'adr_sfpotrero',
        is_residential: false,
        is_warehouse: false,
        name: 'SF Potrero',
        phone_number: '1234567890',
        state: 'CA',
        street1: '2300 16th St',
        street2: 'Opening November 2019',
        validated: false,
        zip: '94103'
      }
    ];

    data.length > 0
      ? resolve(data)
      : reject(new Error('Stores data array is empty.'));
  });
