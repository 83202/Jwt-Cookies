const User = require("../model/Users");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

require("dotenv").config();

//Install bcrypt library in terminal using.. npm i bcrypt-nodejs

//Signup route handler

exports.signup = async (req, res) => {
    try {
        //get data
        const { name, email, password, role } = req.body;
        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        //secure pasword
        try {
            hashedPassword = await bcryptjs.hash(password, 10);
        }
        //if cann't hash then...
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password",
            });
        }

        //create entry for User
        const user = await User.create({
            name, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
        });

    }

    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot registered, please try again later",
        });
    }
}

//LOGIN handler

exports.login = async (req, res) => {
    try {
        //data fetch
        const { email, password } = req.body;

        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        //check for registered user
        let user = await User.findOne({ email })

        //if not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        //verify password and generate a JWT token

        const payload = {
            email: user.email,
            id: user._id, //id assigned hoi chhe
            role: user.role,
        };

        if (await bcryptjs.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                });

            user = user.toObject();    
            user.token = token; //doubt chee ama...not clear
            console.log(user);
            user.password = undefined;
            console.log(user);

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully"
            })

            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "User Logged in successfully"
            // })

        }
        else {
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            successs: false,
            message: "Login Failed"
        });
    }
}
 