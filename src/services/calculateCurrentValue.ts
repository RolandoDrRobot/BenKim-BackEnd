const calculateCurrentValue = async (btcPrice: number, amount: number) => {
  const currentValue = btcPrice * amount;
  return currentValue
}

export { calculateCurrentValue };
