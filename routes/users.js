var express = require('express');
var router = express.Router();
const userModel = require("../Models/userModel")

/* GET users listing. */
router.get('/', async function (req, res, next) {
  // userModel.find({/*filtrage*/},{/*projection*/});
  try {
    const userList = await userModel.find();

    if (!userList && userList.length === 0) {
      throw new Error("users not found")
    }
    console.log(userList);
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ADD userslist. */
router.post('/', async function (req, res, next) {
  try {
    const {
      name,
      age,
      address,
      moy,
    } = req.body;
    //await userModel.create(req.body);
    const user= new userModel({
      name,
      age,
      address,
      moy,
    })
    const adduser = await user.save();
  } catch (error) {

  }
});

/* Modify  userslist. */
router.put('/', function (req, res, next) {
});

/* remove userslist. */
router.post('/', function (req, res, next) {
});


module.exports = router;
