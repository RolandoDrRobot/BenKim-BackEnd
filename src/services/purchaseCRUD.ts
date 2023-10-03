const { fetchBtcPrice } = require('./fetchBtcPrice');

const calculateCost = async (amount: number, btcPrice: any) => {
  const cost = amount * btcPrice;
  return cost
}

const createPurchase = async (amount: number, when: any, price: number, userID: string, purchasesDB:any) => {
  // Sum a day for custom Date
  const customDate = Date.parse(when);
  const updatedCustomDate = customDate + (24 * 60 * 60 * 1000);
  const newCustomDate = new Date(updatedCustomDate);
  // Today
  const today = new Date();
  // Set date
  const whenDate = newCustomDate.getTime() || today.getTime();
  const parsedDate = whenDate;
  const btcPrice = price || await fetchBtcPrice();
  const cost = await calculateCost(amount, btcPrice);
  let createPurchaseStatus = { status: 'no created' };
  const purchaseID = userID + parsedDate.toString() + amount;

  try {
    const newPurchase = await purchasesDB.doc(purchaseID).get();
    if (!newPurchase.exists) {
      purchasesDB.doc(purchaseID).set({
        when: parsedDate,
        purchasePrice: btcPrice,
        amount: amount,
        cost: cost,
        purchaseID: purchaseID,
        userID: userID
      });
      createPurchaseStatus.status = 'Purchase created';
    } else { createPurchaseStatus.status = 'The Purchase already exist!'; }
  }
  catch (e) {
    createPurchaseStatus.status = 'There was an error creating the Purchase. Please make sure you have a valid infromation';
  }
  return createPurchaseStatus;
}

const removePurchase = async (purchasesID:number, purchasesDB:any) => {
  let status = { status: 'no removed' };
  try {
    await purchasesDB.doc(purchasesID).delete().then(() => { status.status = 'Purchase removed' });
  } catch (e) {
    status.status = 'There was an error with the request: ' + e;
  }
  return status;
}

const getPurchases = async (userID: string, purchasesDB:any) => {
  const btcPrice = await fetchBtcPrice();
  let purchases:any = { purchases: [], totals: {}};
  let totalPurchasePrice:any = 0;
  let totalAmount:any = 0;
  let totalCost:any = 0;
  let totalCurrentValue:any = 0;
  let totalValueCostComparison:any = {
    percentage: 0,
    money: 0
  };
  let purchasesList:Array<any> = [];

  const snapshot = await purchasesDB.get();
  const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allDocuments.forEach(function (item:any, index:any) {
    const currentValue = btcPrice * item.amount;
    const purchase = {
      when: item.when,
      purchaseID: item.purchaseID,
      purchasePrice: item.purchasePrice,
      amount: item.amount,
      cost: item.cost,
      currentValue: currentValue,
      valueCostComparison: {
        percentage: ((currentValue - item.cost) / item.cost) * 100,
        money: currentValue - item.cost
      }
    }
    if(item.userID === userID) {
      totalAmount = totalAmount + (item.amount - 0);
      totalPurchasePrice = totalPurchasePrice + (item.purchasePrice - 0);
      totalCost = totalCost + (item.cost - 0);
      totalCurrentValue = totalCurrentValue + (currentValue - 0);
      totalValueCostComparison.money = totalValueCostComparison.money + (purchase.valueCostComparison.money - 0);
      purchasesList.push(purchase);
    }
  });

  let totals = {
    totalAmount: totalAmount || 0,
    totalPurchasePrice: totalPurchasePrice / purchasesList.length || 0,
    totalCost: totalCost || 0,
    totalCurrentValue: totalCurrentValue || 0,
    totalValueCostComparison: {
      percentge: ((totalCurrentValue - totalCost) / totalCost) * 100 || 0,
      money: totalValueCostComparison.money || 0
    }
  }

  purchases.purchases = purchasesList.reverse();
  purchases.totals = totals;

  return purchases;
}

export { getPurchases, createPurchase, removePurchase };
