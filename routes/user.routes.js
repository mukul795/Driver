const express = require('express');
const router = express.Router();
const {body,validationResult} = require('express-validator')
const userModels = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



router.get('/login',(req,res) => {
  res.render('login')
})

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {username,password} = req.body;
    const user = await userModels.findOne({
      username:username,
    })
    if(!user){
      return res.status(400).json({
        message:"The username and password is incorrect"
      })
    }

    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch){
      return res.status(400).json({
        message:"user or password is incorrect"
      })
    }

    const token = jwt.sign({
      userId : user._id,
      email: user.email,
      username:user.username
    },
  process.env.SECRET_KEY)
  res.cookie('token',token)
  res.send("logged in")


    
  });












router.get('/register',(req,res) => {
    res.render('register');
})

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {username,email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10)


    const newUser = await userModels.create({
      username:username,
      email:email,
      password:hashPassword
  
    })
    res.json(newUser)


    
  });


module.exports = router;

  
