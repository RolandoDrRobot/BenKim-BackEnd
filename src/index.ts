const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./services/auth');

import { Request, Response } from 'express';
import { createPurchase, getPurchases } from './services/purchaseCRUD'

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

let user:any = {}
benKimServer.get('/auth/google/callback', (req:any, res:any, next:any) => {
  passport.authenticate('google', (err:any, userGoogle:any) => {
    if (err) return next(err);
    if (!userGoogle) return res.redirect('/auth/google/failure');
    user = userGoogle;
    return res.redirect('http://localhost:3000/dashboard');
  })(req, res, next);
});

benKimServer.get('/api/user', (req:any, res:any) => {
  user ? res.json(user) : res.status(401).json({ error: 'No se ha autenticado ningún usuario' });
});

benKimServer.get('/auth/google/failure', (req: any, res: any) => {
  res.send('Failed to authenticate..');
});

// Server APIs
benKimServer.post('/createPurchase', (req: Request, res: Response) => {
  createPurchase(req.body.amount, req.body.userID)
    .then((result) => { res.json(result); });
});

benKimServer.post('/getPurcharses', (req: Request, res: Response) => {
  getPurchases(req.body.userID)
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
