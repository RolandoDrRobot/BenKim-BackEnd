const calculateCost = async (amount: number, btcPrice: any) => {
  const cost = amount * btcPrice;
  return cost
}

export { calculateCost };
