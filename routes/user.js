const express = require('express');
const router = express.Router();

//import controller
const {login, signup} = require('../controllers/Auth');
const {auth, isStudent, isAdmin} = require('../middlewares/authentication');

//Mapping route
router.post('/login', login);
router.post('/signup', signup);

//testing route
router.get("/test", auth, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for TEST"
    })
})

//protected route
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for Students"
    })
});

router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for Admin"
    })
})

//export
module.exports = router; 