require('dotenv').config()
const Users = require('../Model/User');
const OTP = require('../Model/OTP');
const express = require('express');
const Path = express.Router()
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
let nodemailer = require('nodemailer');
let FROM = process.env.EMAIL
let PASSWORD = process.env.PASSWORD
let Secret = process.env.SEC

//Check
Path.get('/', (req, res) => {
    res.send('<h1>Never Give Up..!</h1>')
})

//User registration;
Path.post('/Register', async (req, res) => {
    try {

        let { Name, Age, Gender, Email, Password } = req.body

        let Match = req.body.Email;
        let mail = await Users.findOne({ Email: Match });

        if (mail === Match) {
            res.status(403).json({ Message: "User Already Exists" });
        } else {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(Password, salt)
            Password = hash

            let inward = new Users({
                Name,
                Age,
                Gender,
                Email,
                Password
            });

            inward.save().then((data) => {
                let token = JWT.sign({ _id: data._id }, Secret, { expiresIn: '5m' });
                sendOTP(data, res, token)
            })

        }
    } catch (error) {
        console.log(error);
    }
})

const sendOTP = async ({ _id, Email }, res, token) => {
    try {
        let OTPGen = `${Math.floor(100000 + Math.random() * 900000)}`

        console.log(OTPGen);

        let otpSalt = await bcrypt.genSalt(10);
        let otpHash = await bcrypt.hash(OTPGen, otpSalt)

        let Auth = new OTP({
            UserID: _id,
            OTP: otpHash,
            Created: Date.now(),
        });

        Auth.save().then((data) => {
            console.log(data);
        })


        //  Send a link Via mail;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:FROM,
                pass: PASSWORD
            }
        });

        var mailOptions = {
            from:FROM,
            to: Email,
            subject: 'Account Verification',
            html: `Your OTP is <b>${OTPGen}</b>.<br/>This OTP validity is 1hr`,

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });

        res.status(201).json({ data: { UserID: _id, Email, Token: token } })

    } catch (error) {
        res.status(501).send(error)
    }
}


Path.post('/Verification/:Id/:Token', async (req, res) => {
    try {
        const UID = req.params.Id
        const Token = req.params.Token

        let  data= req.body.userOTP
        // let Data = userOTP.toString()
        // console.log(req.body);
            let userOTP = Object.values(data).join('').toString()

        const UserOTP = await OTP.findOne({ UserID: UID })
        if (UserOTP === null) {
            res.status(404).json({ Message: "User not found!" })
        }

        let compare = JWT.verify(Token, Secret);
        if (!compare) {
            res.status(440).json({ Message: "OTP Expired" })
        }

        let Verify = await bcrypt.compare(userOTP, UserOTP.OTP);

        if (Verify === true) {
            await Users.findOneAndUpdate({ _id: UID }, { $set: { Verified: true } }, { new: true });
            res.status(200).json({ Message: "Welcome",id:UID})
        } else {
            res.status(401).json({ Message: "Sorry Unauthorized" })
        }
    } catch (error) {
        res.status(501).send(error)
    }
})

//All data;
Path.get('/Data/:id',async(req,res)=>{
    try {
        let userID = req.params.id;
        let verify =await Users.findOne({_id: userID })
        if(verify.Verified === false){
            res.status(404).json({Message:"Please Active your Account"})
        }
        Users.find().then((data)=>{
            res.send(data)
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = Path;