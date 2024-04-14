//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        //extract jwt token
        //Pending....other ways to fetch token..3 ways to fetch token..

        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        //sconsole.log("header", req.header("Authorization"));

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }

        //next middleware par java mate
        next();

    }

    catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong wrong while verifying the token"
        })
    }
}

exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is not a Protected route for Student"
            })
        }

        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User is not matching"
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is not a Protected route for Admin"
            })
        }

        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User is not matching"
        })
    }
}