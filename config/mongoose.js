//----- MODULES -----

require('dotenv').config({path: './config/.env'});
const mongoose = require('mongoose');

//----- CONNECTION -----

mongoose.connect('mongodb+srv://'+process.env.DB_USER_PASS+'@backend.rawgvzf.mongodb.net/mernProject')
.then(() => console.log("-> Serveur connecté à mongoDB !"))
.catch((err) => console.log("-> La connection à mongoDB a échoué !"));



