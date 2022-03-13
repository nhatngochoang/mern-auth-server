const jwt = require("jsonwebtoken");
// jwt.sign ➢ server sign this token

const createToken = {
   activation: (payload) => {
      return jwt.sign(payload, process.env.ACTIVATION_TOKEN,
         { expiresIn: "5m" }
         // time for user to check email or go to the link
      );
   },
   refresh: (payload) => {
      return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "24h" });
   },
   access: (payload) => {
      return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
   },
};

module.exports = createToken;