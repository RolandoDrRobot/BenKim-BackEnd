const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./services/auth');

import { Request, Response } from 'express';
import { createPurchase } from './services/purchaseCRUD'

// Authentication
const benKimServer = express();
benKimServer.use(cors());
benKimServer.use(express.json());
benKimServer.use(express.urlencoded({ extended: false }));
benKimServer.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
benKimServer.use(passport.initialize());
benKimServer.use(passport.session());

benKimServer.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] })
);

benKimServer.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: '/auth/google/failure'
  })
);

benKimServer.get('/logout', (req: any, res: any) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!'); 
});

benKimServer.get('/auth/google/failure', (req: any, res: any) => {
  res.send('Failed to authenticate..');
});

// Server APIs
benKimServer.post('/createPurchase', (req: Request, res: Response) => {
  createPurchase(req.body.amount, req.body.owner)
    .then((result) => { res.json(result); });
});

benKimServer.listen(443, () => {
  console.log(`Server on port 443`);
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
