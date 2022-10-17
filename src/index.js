const express = require('express');
const session = require('express-session');
const fs = require('fs');

const app = express();

const phones = require('./items.json');

const phone = {
    name: 'some smart phone',
    price: 0.25,
    description: 'a smart phone',
    quantity: 1
};

phones['flag'] = {
    name: 'flag',
    price: 10000,
    description: fs.readFileSync('flag.txt', 'utf8').trim(),
    quantity: 1
};

app.use(express.json({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    if (req.session.money !== undefined)
        return next();

    req.session.money = 5;

    if (req.ip == '127.0.0.1') {
        req.session.admin = true;
    }

    next();
});

app.get('/', (req, res) => {
    res.render('index', { phones, money: req.session.money });
});

app.post('/sell', (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (key === 'flag' && !req.session.admin) {
            continue;
        }

        if (!phones[key]) {
            phones[key] = JSON.parse(JSON.stringify(phone));
        }

        for (const [k, v] of Object.entries(value)) {
            if (k === 'quantity') {
                phones[key][k] += v;
            } else {
                phones[key][k] = v;
            }
        }
    }

    res.send('Sell successful');
});

app.post('/buy', (req, res) => {
    const { phone, quantity } = req.body;

    if (typeof phone === 'undefined' || typeof quantity !== 'number' || quantity <= 0 || !phones[phone]) {
        return res.status(400).send('Invalid request');
    }

    if (phones[phone].quantity >= quantity) {
        if (req.session.money >= phones[phone].price * quantity) {
            phones[phone].quantity -= quantity;
            req.session.money -= phones[phone].price * quantity;
            res.json(phones[phone]);
        } else {
            res.status(402).send('Not enough money');
        }
    } else {
        res.status(451).send('Not enough phone');
    }
});

app.post('/money', (req, res) => {
    if (req.session.admin) {
        req.session.money += req.body.money;
        res.send('Money added');
    } else {
        res.status(403).send('Not admin');
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
