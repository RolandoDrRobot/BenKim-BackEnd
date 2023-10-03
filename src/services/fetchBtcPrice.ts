const axios = require('axios');
const apiUrl = 'https://api.coincap.io/v2/assets/bitcoin';

const fetchBtcPrice = async () => {
  let btcPrice = 0
  await axios.get(apiUrl).then((response:any) => {
    btcPrice = response.data.data.priceUsd;
  }).catch((error:Error) => {
    console.error('Error al hacer la solicitud a la API a coincap.io:');
    console.error(error);
  });
  return btcPrice
}

export { fetchBtcPrice };
