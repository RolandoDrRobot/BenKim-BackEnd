const ccxt = require ('ccxt');

const fetchBtcPrice = async () => {
  const binanceInstance:any = ccxt['binance'];
  const binance  = new binanceInstance();
  const binanceBtcTicker = await binance.fetchTickers(['BTC/USDT']);
  return binanceBtcTicker
}

export { fetchBtcPrice };
