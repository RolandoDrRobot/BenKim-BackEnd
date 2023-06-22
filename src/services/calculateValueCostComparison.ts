const calculateValueCostComparison = async (cost: number, currentValue: number) => {
  const valueCostComparison = {
    percentage: ((currentValue - cost) / cost) * 100,
    money: currentValue - cost
  }
  return valueCostComparison
}

export { calculateValueCostComparison };
