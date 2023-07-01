const ccxt = require ('ccxt');

const fetchBtcPrice = async () => {
  const binanceInstance:any = ccxt['binance'];
  const binance  = new binanceInstance();
  const tickers = await binance.fetchTickers(['BTC/USDT']);
  let btcPrice = 0;
  for (const ticker in tickers) { btcPrice = tickers[ticker].bid }
  return btcPrice
}

export { fetchBtcPrice };
