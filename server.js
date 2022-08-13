const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes.js')
const uploadRoutes = require("./routes/uploadRoutes");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors') // Import cors

// Begin Cors Setup
var corsOptions = {
   origin: ['http://localhost:3000'],
   // origin: 'https://m2-ecommerce-shop-tahn-0102.vercel.app',
   credentials: true,
   exposedHeaders: ["set-cookie"],
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.use(cors(corsOptions))
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
app.use(uploadRoutes);