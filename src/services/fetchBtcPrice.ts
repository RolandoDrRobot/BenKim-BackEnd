const axios = require('axios');
const apiUrl = 'https://api.coincap.io/v2/assets/bitcoin';

const fetchBtcPrice = async () => {
  try {
    const response = await axios.get(apiUrl);
    const btcPrice = response.data.data.priceUsd;
    return btcPrice;
  } catch (error) {
    console.error('Error al hacer la solicitud a la API de coincap.io:');
    console.error(error);
    throw error;
  }
};

export { fetchBtcPrice };
