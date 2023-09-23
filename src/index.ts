// Firebase
import { run } from './services/firebase';
const database = run();
const purchasesDB = database.collection('Purchases');
const usersDB = database.collection('Users');
import { createPurchase, getPurchases, removePurchase } from './services/purchaseCRUD';
import { createUser } from './services/usersCRUD';
import { fetchBtcPrice } from './services/fetchBtcPrice';

// Server and authentication
import { Request, Response, json } from 'express';
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./services/auth');

// Authentication
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] })
);

let user:any = {}
app.get('/auth/google/callback', (req:any, res:any, next:any) => {
  passport.authenticate('google', (err:any, userGoogle:any) => {
    if (err) return next(err);
    if (!userGoogle) return res.redirect('/auth/google/failure');
    user = userGoogle;
    createUser(user, usersDB);
    return res.redirect('http://localhost:3000/dashboard');
  })(req, res, next);
});

app.get('/api/user', (req:any, res:any) => {
  user ? res.json(user) : res.status(401).json({ error: 'No se ha autenticado ningún usuario' });
});

app.get('/auth/google/failure', (req: any, res: any) => {
  res.send('Failed to authenticate..');
});

// Websocket Server
const http = require('http');
const { Server } = require('socket.io');
import WebSocket from 'ws';
const server = http.createServer(app);
const io  = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET","POST"],
  },
});

const wsURL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin';
const externalWebSocket = new WebSocket(wsURL);

externalWebSocket.on('message', (data:any) => {
  const buffer = Buffer.from(data);
  const dataString = buffer.toString('utf8');
  const jsonData = JSON.parse(dataString);
  io.emit('receive_btc_price', jsonData.bitcoin);
});

io.on('connection', (socket:any) => {
  console.log('Un cliente se ha conectado');

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});


// Server APIs
app.post('/createPurchase', (req: Request, res: Response) => {
  createPurchase(req.body.amount, req.body.when, req.body.price, req.body.userID, purchasesDB)
    .then((result) => { res.json(result); });
});

app.post('/removePurchase', (req: Request, res: Response) => {
  removePurchase(req.body.purchaseID, purchasesDB)
    .then((result) => { res.json(result); });
});

app.post('/getPurcharses', (req: Request, res: Response) => {
  getPurchases(req.body.userID, purchasesDB)
    .then((result) => { res.json(result); });
});

server.listen(3001, () => {
  console.log(`Server HTTP on port 3001`);
});

app.listen(443, () => {
  console.log(`Server on port 443`);
});
