export default () =>
  new Promise((resolve, reject) => {
    const data = [
      {
        address_type: null,
        city: 'Tempe',
        cityWithSuffix: 'Tempe',
        code: null,
        company: 'Decathlon',
        country: 'AU',
        email: 'customer.service@decathlon.com',
        id: 'adr_T6s3Kaja',
        is_residential: false,
        is_warehouse: false,
        name: 'Tempe',
        phone_number: '(02) 9157 5799',
        state: 'NSW',
        street1: '634-726 Princes Hwy',
        street2: 'Open 7am-11pm',
        validated: false,
        zip: '2044'
      },
      {
        address_type: 'destination',
        city: 'Auburn',
        cityWithSuffix: 'Auburn',
        code: null,
        company: 'Decathlon',
        country: 'AU',
        email: 'customer.service@decathlon.com',
        id: 'adr_A6s3Kaja',
        is_residential: false,
        is_warehouse: false,
        name: 'Auburn',
        phone_number: '(02) 9157 5799',
        state: 'NSW',
        street1: '300 Parramatta Rd',
        street2: 'Open 8am-10pm',
        validated: false,
        zip: '2144'
      },
      {
        address_type: 'destination',
        city: 'Knoxfield',
        cityWithSuffix: 'Knoxfield',
        code: null,
        company: 'Decathlon',
        country: 'AU',
        email: 'customer.service@decathlon.com',
        id: 'adr_F6s3Kaja',
        is_residential: false,
        is_warehouse: false,
        name: 'Knoxfield',
        phone_number: '(02) 9157 5799',
        state: 'VIC',
        street1: '1464 Ferntree Gully Rd',
        street2: 'Open 9am-9pm',
        validated: false,
        zip: '3180'
      },
      {
        address_type: 'destination',
        city: 'Box Hill',
        cityWithSuffix: 'Box Hill',
        code: null,
        company: 'Decathlon',
        country: 'AU',
        email: 'customer.service@decathlon.com',
        id: 'adr_B6s3Kaja',
        is_residential: false,
        is_warehouse: false,
        name: 'Box Hill',
        phone_number: '(02) 9157 5799',
        state: 'VIC',
        street1: '249 Middleborough Rd',
        street2: 'Open 9am-9pm',
        validated: false,
        zip: '3128'
      },
      {
        address_type: 'destination',
        city: 'Moorabbin',
        cityWithSuffix: 'Moorabbin DFO Click & Collect',
        code: null,
        company: 'Decathlon',
        country: 'AU',
        email: 'customer.service@decathlon.com',
        id: 'adr_17930001',
        is_residential: false,
        is_warehouse: false,
        name: 'Moorabbin',
        phone_number: '(02) 9157 5799',
        state: 'VIC',
        street1: '250 Centre Dandenong Rd',
        street2: 'Open 10am-6pm',
        validated: false,
        zip: '3194'
      }
    ];

    data.length > 0
      ? resolve(data)
      : reject(new Error('Stores data array is empty.'));
  });
