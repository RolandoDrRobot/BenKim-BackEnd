// APP
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Firebase and Database
const { run } = require('./services/firebase');
const database = run();
const usersDB = database.collection('Users');
const purchasesDB = database.collection('Purchases');
const { createUser } = require('./services/usersCRUD');
const { createPurchase, getPurchases, removePurchase } = require('./services/purchaseCRUD');


// Authentication
require('./services/auth');
let user:any = {}
const session = require('express-session');
const passport = require('passport');
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/api/user', (req:any, res:any) => { user ? res.json(user) : res.status(401).json({ error: 'No se ha autenticado ningún usuario' })});
app.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
app.get('/auth/google/failure', (req: any, res: any) => { res.send('Failed to authenticate..')});
app.get('/auth/google/callback', (req:any, res:any, next:any) => {
  passport.authenticate('google', (err:any, userGoogle:any) => {
    if (err) return next(err);
    if (!userGoogle) return res.redirect('/auth/google/failure');
    user = userGoogle;
    createUser(user, usersDB);
    return res.redirect('http://localhost:3000/dashboard');
  })(req, res, next);
});


// Websocket Server
const WS = require('ws');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: 'http://localhost:3000', methods: ["GET","POST"] }});

const bitcoinWsURL = 'wss://ws.coincap.io/prices?assets=bitcoin';
const bitcoinSocket = new WS(bitcoinWsURL);
bitcoinSocket.on('message', (data:any) => {
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

server.listen(3001, () => { console.log(`Server HTTP on port 3001`) });


// Server APIs
const { Req, Res } = require('express');

app.post('/createPurchase', (req: typeof Req, res: typeof Res) => {
  createPurchase(req.body.amount, req.body.when, req.body.price, req.body.userID, purchasesDB)
    .then((result:any) => { res.json(result); });
});

app.post('/removePurchase', (req: typeof Req, res: typeof Res) => {
  removePurchase(req.body.purchaseID, purchasesDB)
    .then((result:any) => { res.json(result); });
});

app.post('/getPurcharses', (req: typeof Req, res: typeof Res) => {
  getPurchases(req.body.userID, purchasesDB)
    .then((result:any) => { res.json(result); });
});

app.listen(443, () => {
  console.log(`Server on port 443`);
});
