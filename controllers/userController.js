//----- MODULES ----- 

const UserModel = require('../models/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

const maxAge = 3*24*60*60*1000;
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: maxAge});
}

//----- CONTROLLERS -----

// GET ALL USERS
module.exports.getUsersList = async (req, res) => {
    const users = await UserModel.find().select(/*'-mdp */); //pour masquer mdp dans la response
    res.status(200).json(users);
}

// GET USER BY ID
module.exports.getUser = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send(req.params.id+" n'existe pas !");
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown : "+err);
    }).select(/*'-mdp'*/) //pour masquer mdp dans la response
}

// SIGNUP
module.exports.signup = async (req, res) => {
    const {mail, mdp, bio} = req.body
    try{
        const user = await UserModel.create({mail, mdp, bio});
        res.status(201).json({user: user.mail});
    } catch(err) {
        res.status(200).send({err});
    }
}

//LOGIN
module.exports.login = async (req, res) => {
    const {mail, mdp} = req.body;
    try {
        const user = await UserModel.login(mail, mdp);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge});
        res.status(200).json({user: user.mail});
    } catch (err) {
        res.status(200).send({message: err});
    }
}

// LOGOUT
module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.send("Vous venez de vous déconnecter. A bientôt !");
    res.redirect('/');
}

//DELETE
module.exports.delete = async (req, res) => {
    try {        
        await UserModel.deleteOne({_id: res.locals.user._id}).exec();
        res.cookie("jwt", "", {maxAge:1});
        res. status(200).send("Votre profil viens d'être supprimé");
    } catch (err) {
        return res.status(400).send("impossible de supprimer votre profil. Veuilez réessayer plus tard.");
    }
}