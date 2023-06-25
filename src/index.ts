const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';
import { getPurchases, createPurchase, removePurchase } from './services/purchaseCRUD'

// Initialize server
const benKimServer = express();
benKimServer.use(cors());
benKimServer.use(express.json());
benKimServer.use(express.urlencoded({ extended: false }));
benKimServer.listen(443, () => {
  console.log(`Server on port 443`);
});

// Server APIs
benKimServer.post('/createPurchase', (req: Request, res: Response) => {
  createPurchase(req.body.amount, req.body.owner)
    .then((result) => { res.json(result); });
});

// benKimServer.post('/removeVault', (req: Request, res: Response) => {
//   removePurchase(req.body.amount, req.body.amount)
//     .then((result) => { res.json(result); });
// });

// benKimServer.post('/getVaults', (req: Request, res: Response) => {
//   getPurchases(req.body.owner).then(function(result:any){
//     res.json(result);
//   });
// });
