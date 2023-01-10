//----- MODULES -----

require('dotenv').config({path: './config/.env'});
require('./config/mongoose.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes.js');
const {checkUser, requireAuth} = require('./middlewares/authMiddleware.js');

//----- MIDDLEWARES -----
app.use(express.json());
app.use(cookieParser());

app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

app.use('/user', userRoutes);
//----- PORT -----

app.listen(process.env.PORT, () => console.log("-> Serveur accessible sur le port", process.env.PORT));
