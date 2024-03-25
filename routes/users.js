var express = require('express');
var router = express.Router();
const userModel = require("../Models/userModel")
const Auth = require("../controllers/AuthController");
const upload = require("../middlewares/uploadImagesUsers");
const {requireAuthUser} = require("../middlewares/authMiddleware")
const authLogMiddleware = require("../middlewares/authLogMiddleware")
const { userValidation } = require("../middlewares/userValidation");


/* GET users listing. */
router.get('/',requireAuthUser,authLogMiddleware,Auth.getUsers)

router.get('/getUserAuth',requireAuthUser, Auth.getAuthUser);

router.get('/logout',requireAuthUser,Auth.logout)

router.post('/signupclient',userValidation,Auth.signupclient)

router.post('/login',Auth.login_post)



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

/* ajouter image */
router.post('/addClient',upload.single("image_user"),Auth.addUserImage)

/* Modify  userslist. */
router.put('/:id',Auth.updateUser);

/* remove userslist. */
router.delete('/:id',Auth.deleteUser);


module.exports = router;
