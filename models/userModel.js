//----- MODULES -----

const {isEmail} = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//----- SCHEMA -----

const userSchema = new mongoose.Schema(
    {
        mail: {
            type: String,
            required: true,
            validate: [isEmail],
            unique: true,
            trim: true //supprime les espaces
        },
        mdp: {
            type: String,
            required: true,
            min_Length: 4
        },
        bio: {
            type: String,
            maxLength: 120
        }
    }
);

//----- FONCTIONS -----

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.mdp = await bcrypt.hash(this.mdp, salt);
    next(); 
});

userSchema.statics.login = async function(mail, mdp) {
    const user = await this.findOne({mail});
    if (user) {
        const auth = await bcrypt.compare(mdp, user.mdp);
        if (auth) return user;
        throw Error('mdp incorrect');
    }
    throw Error('mail incorrect');
};

//----- EXPORT -----

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;