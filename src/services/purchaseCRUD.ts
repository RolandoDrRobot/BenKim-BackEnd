import { fetchBtcPrice } from './fetchBtcPrice';
import { calculateCost } from './calculateCost';
import { run } from './firebase';
const database = run();
const purchasesDB = database.collection('Purchases');

const createPurchase = async (amount: number, userID: string) => {
  const when = new Date();
  const tickers = await fetchBtcPrice();
  let purchasePrice = 0;
  for (const ticker in tickers) { purchasePrice = tickers[ticker].bid }
  const cost = await calculateCost(amount, purchasePrice);
  let createPurchaseStatus = { status: 'no created' };

  const purchaseID = userID + when.toString() + amount;

  try {
    const newPurchase = await purchasesDB.doc(purchaseID).get();
    if (!newPurchase.exists) {
      purchasesDB.doc(purchaseID).set({
        when: when,
        purchasePrice: purchasePrice,
        amount: amount,
        cost: cost,
        purchaseID: purchaseID
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

const getPurchases = async (purchasesDB:any, purchaseID: string) => {
  let purchases:Array<any> = [];
  const snapshot = await purchasesDB.get();
  const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allDocuments.forEach(function (item:any, index:any) {
    if(item.purchaseID === purchaseID) purchases.push(item);
  });

  return purchases;
}


export { getPurchases, createPurchase, removePurchase };
