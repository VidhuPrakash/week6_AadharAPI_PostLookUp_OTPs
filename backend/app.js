var express = require('express');
const { Auth } = require('two-step-auth');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nodemailer = require('nodemailer');
var validator = require('aadhaar-validator');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // generates a six digit number.
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'blevingmr@gmail.com',
      pass: 'konl nibg afjf eqoq'
    }
  });

  const mailOptions = {
    from: 'blevingmr@gmail.com',
    to: email,
    subject: 'OTP verification',
    text: `Your OTP is ${otp}`
  };

  return transporter.sendMail(mailOptions);
};

let storeOtp = {};

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  // TODO: Store the OTP and email
  storeOtp[email] = otp;
  try {
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }});

  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    console.log(`Verifying OTP for email: ${email}`);
    console.log(`Received OTP: ${otp}`);
    console.log(`Stored OTP: ${storeOtp[email]}`);
  
    if(storeOtp[email] == otp || otp === null) {
      console.log("OTP is valid.");
      res.json({ message: 'Email verified' });
      delete storeOtp[email];
    } else {
      console.log("OTP is invalid.");
      res.json({ message: 'Invalid OTP' });
    }
  });

  app.post('/aadhar-validate',(req,res)=>{
    const aadhar = req.body.aadhar;
    console.log(`Aadhar : ${aadhar}`);
    let result = validator.isValidNumber(aadhar);
    res.json({result})
  })


  // adhaar
module.exports = app;
