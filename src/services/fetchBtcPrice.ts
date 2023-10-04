const apiUrl = 'https://api.coincap.io/v2/assets/bitcoin';

const fetchBtcPrice = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error al hacer la solicitud a la API de coincap.io');

    const data = await response.json();
    const btcPrice = data.data.priceUsd;
    return btcPrice;
  } catch (error) {
    console.error('Error al hacer la solicitud a la API de coincap.io:');
    console.error(error);
    throw error;
  }
};

export { fetchBtcPrice };
