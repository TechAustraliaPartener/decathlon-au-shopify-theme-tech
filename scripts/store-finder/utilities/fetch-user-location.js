export default async function() {
  try {
    const url =
      'https://api.ipstack.com/check?access_key=23cb2745b5ee35580d6f00373f14f868&legacy=1';
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetch stores: ', error);
    throw error;
  }
}
