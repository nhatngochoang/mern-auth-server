const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes.js')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
require("dotenv").config();

const opts = {
   useCreateIndex: true,
   useFindAndModify: false,
   useNewUrlParser: true,
   useUnifiedTopology: true,
}

// db
mongoose.connect(
   process.env.MONGO_URL,
   // opts,
   (err) => {
      if (err) throw err;
      console.log("db connected")
      // dont start server untill db connected
      // routes
      const PORT = 8000
      app.listen(PORT, () => {
         console.log('Server listening on port ' + PORT)
      })
   }
);


// mw
app.use(express.json())
express.urlencoded({ extended: true })
app.use(cookieParser());

//routes
app.use(userRoutes)
