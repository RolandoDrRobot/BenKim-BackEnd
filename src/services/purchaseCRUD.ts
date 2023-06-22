import { fetchBtcPrice } from './fetchBtcPrice';
import { calculateCost } from './calculateCost';
import { run } from './firebase';
const database = run();
const purchasesDB = database.collection('Purchases');

const getPurchases = async (vaultsDB:any, address: string) => {
  let purchases:Array<any> = [];
  const snapshot = await vaultsDB.get();
  const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allDocuments.forEach(function (item:any, index:any) {
    if(item.owner === address) purchases.push(item);
  });
  
  return purchases;
}

const createPurchase = async (amount: number, owner: string) => {
  let createPurchaseStatus = { status: 'no created' };
  const date = new Date();
  const when = date.getDate();
  const purchasePrice = await fetchBtcPrice();
  const cost = calculateCost(amount, purchasePrice);

  try {
    const newPurchase = await purchasesDB.doc(when).get();
    if (!newPurchase.exists) {
      purchasesDB.doc(when).set({
        when: when,
        purchasePrice: purchasePrice,
        amount: amount,
        cost: cost,
        owner: owner
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