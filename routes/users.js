var express = require('express');
var router = express.Router();
const userModel = require("../Models/userModel")
const Auth = require("../controllers/AuthController");
const upload = require("../middlewares/uploadImagesUsers");

/* GET users listing. */
router.get('/',Auth.getUsers)
//router.get('/', async function (req, res, next) {
  // userModel.find({/*filtrage*/},{/*projection*/});
  // try {
  //   const userList = await userModel.find();

  //   if (!userList && userList.length === 0) {
  //     throw new Error("users not found")
  //   }
  //   console.log(userList);
  //   res.status(200).json(userList);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
//});

/*http://localhost:5000/users/search?name=hamadi*/
router.get('/search', Auth.searchUsersByName);

/* sort userslist. */
router.get('/SortedUsersByAge', Auth.getSortedUsersByAge); 

/* sort userslist. */
router.get('/SortedUsersByAgeDes', Auth.getSortedUsersByAgeDes); 



/* Get Uesrs By ID */
router.get('/:id',Auth.getUserid)

/* ADD userslist. */
router.post('/addUser',Auth.addUser)
//router.post('/', async function (req, res, next) {
  // try {
  //   const {
  //     name,
  //     age,
  //     address,
  //     moy,
  //   } = req.body;
  //   //await userModel.create(req.body);
  //   const user= new userModel({
  //     name,
  //     age,
  //     address,
  //     moy,
  //   })
  //   const adduser = await user.save();
  //   res.status(200).json(adduser);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
//});

/* ajouter image */
router.post('/addClient',upload.single("image_user"),Auth.addUserImage)

/* Modify  userslist. */
router.put('/:id',Auth.updateUser);

/* remove userslist. */
router.delete('/:id',Auth.deleteUser);


module.exports = router;
