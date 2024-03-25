const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Car = require("./carModel"); // Importez le modèle de voiture

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    moy: Number,
    address: {
        street: String,
        pays: String
    },
    email: String,  // Rendre le champ email unique
    password: String,
    image_user: { type: String, required: false ,  },
    role: {
        type: String,
        enum: ['client', 'centre', 'moderateur', 'admin', 'formateur'],
      },
      cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }] // Tableau de références vers les voitures

}, { timestamps: true });


userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved')
    next()
  })
  
  //avant la creation
  userSchema.pre('save', async function (next) {
    try {
      //cryptage password + statu + createdAt et updatedAt
      const salt = await bcrypt.genSalt()
      const User = this
      User.password = await bcrypt.hash(User.password, salt)
      User.createdAt = new Date()
      User.updatedAt = new Date()  
      next()
    } catch (error) {
      next(error)
    }
  })
  
  //static method to login user
  userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
      const auth = await bcrypt.compare(password, user.password)
      if (auth) {
       // if (user.etat === true) { 
         return user
        /*} else {
          throw new Error('compte desactive')
        }*/
      }
      throw new Error('incorrect password')
    }
    throw Error('incorrect email')
  }


const User = mongoose.model("User", userSchema);

module.exports = User;
