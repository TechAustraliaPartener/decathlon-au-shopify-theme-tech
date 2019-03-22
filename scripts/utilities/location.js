/**
 * Get user's current location from ipStack
 * @returns Promise
 */
export const getCurrentLocation = fetch('https://api.ipstack.com/check?access_key=23cb2745b5ee35580d6f00373f14f868&legacy=1').then(res => res.json());
