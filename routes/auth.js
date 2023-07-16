const express = require('express');
const router = express.Router()
const User = require('../modules/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser =require('../middleware/fetchuser')

const JWT_SECRET = "this@inote$book"

// route 1 POST requst end point : /api/auth

router.post('/createuser',
  body('name', "Plese Enter Valid Name").trim().isLength({ min: 2 }),
  body('email', "Plese Enter Valid Email").trim().isEmail(),
  body('password', "Password Must Be Atlist 5 Characters").trim().isLength({ min: 5 })
  , async (req, res) => {
    let success = false
    const result = validationResult(req);
    // if present the error then send error message and bad request
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      // check user enter email is alrady present or not

      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email alrady exist " })
      }

      const salt = await bcrypt.genSalt(10)
      let userPassword = await bcrypt.hash(req.body.password, salt);


      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: userPassword

      })

      const data = {
        user: { id: user.id }
      }

      const authtoken = jwt.sign(data, JWT_SECRET)
       success = true
      res.json({ success, authtoken })

    } catch (error) {
      console.error({ error: error.message })
      res.status(500).json("Internal Server Error")
    }

  })


//  route 2 : authenticate and user login  /api/auth/login


router.post('/login',
  body('email', "Plese Enter Valid Email").trim().isEmail(),
  body('password', "Plese Enter Valid Password").trim().exists()
  , async (req, res) => {
    const result = validationResult(req);
    // if present the error then send error message and bad request
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      let success = false

      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "plese enter valid details" })
      }

      const passwordCompair = await bcrypt.compare(password, user.password)
      if (!passwordCompair) {
        return res.status(400).json({ error: "plese enter valid details" })
      }

      const data = {
        user: { id: user.id }
      }

      const authtoken = jwt.sign(data, JWT_SECRET)
      success = true
      res.json({ success, authtoken })

    } catch (error) {
      console.error({ error: error.message })
      res.status(500).json("Internal Server Error")
    }
  })

  // route 3 : get user post /api/auth/getuser

  router.post('/getuser',fetchuser,async (req,res)=>{

    try {
      userId = req.user.id
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error({ error: error.message })
      res.status(500).json("Internal Server Error")
    }
  })

module.exports = router