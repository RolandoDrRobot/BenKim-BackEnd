import { fetchBtcPrice } from './fetchBtcPrice';
import { calculateCost } from './calculateCost';
import { run } from './firebase';
const database = run();
const purchasesDB = database.collection('Purchases');

const createPurchase = async (amount: number, userID: string) => {
  const when = new Date();
  const btcPrice = await fetchBtcPrice();
  const cost = await calculateCost(amount, btcPrice);
  let createPurchaseStatus = { status: 'no created' };
  const purchaseID = userID + when.toString() + amount;

  try {
    const newPurchase = await purchasesDB.doc(purchaseID).get();
    if (!newPurchase.exists) {
      purchasesDB.doc(purchaseID).set({
        when: when,
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

const removePurchase = async (when: Date) => {
  let status = { status: 'no removed' };
  try {
    const purchase = await purchasesDB.doc(when).get();
    purchase.exists ? status.status = 'removed' : status.status = 'The Purchase does not exist';
  } catch (e) {
    status.status = 'There was an error with the request: ' + e;
  }
  return status;
}

const getPurchases = async (userID: string) => {
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
    const valueCostComparison = {
      percentage: ((currentValue - item.cost) / item.cost) * 100,
      money: currentValue - item.cost
    }
    const purchase = {
      when: item.when,
      purchasePrice: item.purchasePrice,
      amount: item.amount,
      cost: item.cost,
      currentValue: currentValue,
      valueCostComparison: valueCostComparison
    }
    if(item.userID === userID) {
      totalAmount = totalAmount + (item.amount - 0);
      totalPurchasePrice = totalPurchasePrice + (item.purchasePrice - 0);
      totalCost = totalCost + (item.cost - 0);
      totalCurrentValue = totalCurrentValue + (currentValue - 0);
      totalValueCostComparison.percentage = totalValueCostComparison.percentage + (valueCostComparison.percentage - 0);
      totalValueCostComparison.money = totalValueCostComparison.money + (valueCostComparison.money - 0);
      purchasesList.push(purchase);
    }
  });

  let totals = {
    totalAmount: totalAmount,
    totalPurchasePrice: totalPurchasePrice / purchasesList.length,
    totalCost: totalCost,
    totalCurrentValue: totalCurrentValue,
    totalValueCostComparison: {
      percentge: totalValueCostComparison.percentage,
      money: totalValueCostComparison.money
    }
  }

  purchases.purchases = purchasesList.reverse();
  purchases.totals = totals;

  return purchases;
}


export { getPurchases, createPurchase, removePurchase };
