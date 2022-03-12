const jwt = require("jsonwebtoken");

const createToken = {
   activation: (payload) => {
      return jwt.sign(payload, process.env.ACTIVATION_TOKEN,
         { expiresIn: "5m" }
         // time for user to check email or go to the link
      );
   },
};

module.exports = createToken;