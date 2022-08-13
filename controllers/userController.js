const bcrypt = require("bcryptjs");
const validateEmail = require("../helpers/validateEmail");
const createToken = require("../helpers/createToken");
const sendMail = require("../helpers/sendMail");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userController = {
   register: async (req, res) => {
      try {
         // get info
         const { name, email, password } = req.body;

         // check fields
         if (!name || !email || !password)
            return res.status(400).json({ msg: "Please fill in all fields." });

         // check email
         if (!validateEmail(email))
            return res
               .status(400)
               .json({ msg: "Please enter a valid email address." });

         // check user
         const user = await User.findOne({ email });
         if (user)
            return res
               .status(400)
               .json({ msg: "This email is already registered in our system." });

         // check password
         if (password.length < 6)
            return res
               .status(400)
               .json({ msg: "Password must be at least 6 characters." });

         // hash password
         const salt = await bcrypt.genSalt();
         const hashPassword = await bcrypt.hash(password, salt);

         // create token
         const newUser = { name, email, password: hashPassword };
         const activation_token = createToken.activation(newUser);
         console.log(activation_token)

         // send emailconst
         const url = `http://localhost:3000/api/auth/activate/${activation_token}`;
         sendMail.sendEmailRegister(email, url, "Verify your email");

         // registration success
         res.status(200).json({ msg: "Welcome! Please check your email." });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   activate: async (req, res) => {
      try {
         // get token
         const { activation_token } = req.body;

         // verify token
         const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
         const { name, email, password } = user;

         // double check user
         const check = await User.findOne({ email });
         if (check)
            return res
               .status(400)
               .json({ msg: "This email is already registered." });

         // add user to DB
         const newUser = new User({
            name,
            email,
            password,
         });
         await newUser.save();

         // activation success
         res
            .status(200)
            .json({ msg: "Your account has been activated, you can now sign in." });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   signing: async (req, res) => {
      try {
         // get cred(email && password)
         const { email, password } = req.body;

         // check email
         const user = await User.findOne({ email });
         if (!user)
            return res
               .status(400)
               .json({ msg: "This email is not registered in our system." });

         // check password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch)
            return res.status(400).json({ msg: "This password is incorrect." });

         // refresh token - credential(like a door) - store in cookie, user use it to obtain access token 
         const rf_token = createToken.refresh({ id: user._id }); //id in DB
         res.cookie("_apprftoken", rf_token, {
            httpOnly: true, // not allow people to handle token cookie
            path: "/api/auth/access", // place store token cookie
            maxAage: 24 * 60 * 60 * 1000, // 24h
         });

         // signing success
         res.status(200).json({ msg: "Signing success" });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   access: async (req, res) => {
      try {
         // rf token from server to sign user
         const rf_token = req.cookies._apprftoken;
         if (!rf_token) return res.status(400).json({ msg: "Please sign in." });

         // validate
         jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) return res.status(400).json({ msg: "Please sign in again." });
            // create access token
            const ac_token = createToken.access({ id: user.id }); //id from cookie
            // access success
            return res.status(200).json({ ac_token });
         });
      } catch (err) {
         return res.status(500).json({ msg: err.message });
      }
   },
   forgot: async (req, res) => {
      try {
         // get email
         const { email } = req.body;

         // check email
         const user = await User.findOne({ email });
         if (!user)
            return res
               .status(400)
               .json({ msg: "This email is not registered in our system." });

         // create ac token
         const ac_token = createToken.access({ id: user.id });

         // send email
         const url = `http://localhost:3000/auth/reset-password/${ac_token}`;
         console.log(url)
         const name = user.name;
         sendMail.sendEmailReset(email, url, "Reset your password", name);

         // success
         res
            .status(200)
            .json({ msg: "Re-send the password, please check your email." });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   reset: async (req, res) => {
      try {
         // get new password
         const { password } = req.body;

         // hash password
         const salt = await bcrypt.genSalt();
         const hashPassword = await bcrypt.hash(password, salt);

         // update password in DB
         await User.findOneAndUpdate(
            { _id: req.user.id },
            { password: hashPassword }
         );

         // reset success
         res.status(200).json({ msg: "Password was updated successfully." });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   info: async (req, res) => {
      try {
         // get info -password
         const user = await User.findById(req.user.id).select("-password");
         // return user
         res.status(200).json({ user });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
   update: async (req, res) => {
      try {
         // get info
         const { name, avatar } = req.body;

         // update
         await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
         // success
         res.status(200).json({ msg: "Update success." });
      } catch (err) {
         res.status(500).json({ msg: err.message });
      }
   },
};

module.exports = userController;