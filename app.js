const express = require('express');
const app = express();


const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const cookie = require('cookie-parser')

const dotenv = require('dotenv')
dotenv.config();
const connectToDB = require('./config/db')
connectToDB();


const userRouter = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/user',userRouter);


app.set('view engine','ejs');



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
