const userModel = require("../Models/userModel");
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const maxAge = 2 * 60 * 60 // 2 heures

const createToken = (id) => {
  return jwt.sign({ id }, 'net StudySphere secret', {
    expiresIn: maxAge,
  })
}

const createTokenmdp = (id) => {
  return jwt.sign({ id, exp: Math.floor(Date.now() / 1000) + 120 }, 'net StudySphere secret');
};

module.exports.signupclient = async (req, res) => {
  const { email, password, name } = req.body
  const role = 'client'
  //const etat = true
  console.log(req.body)
  try {
    const user = await userModel.create({
      name, password, email, role
    })
     sendWelcomeEmail(email, name);
    const token = createToken(user._id)
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.logout = async (req, res) => {
  try {
    // const id = req.session.user._id;
    // // Utilisez findById pour trouver l'utilisateur par son ID
    // const user = await userModel.findById(id);
    // console.log(user);

    // // Utilisez findOneAndUpdate pour mettre à jour le champ statu
    // const updatedUser = await userModel.findOneAndUpdate(
    //   { _id: req.session.user._id }, // Utilisez _id pour correspondre à l'ID MongoDB
    //   { statu: false },
    //   { new: true } // Pour obtenir le document mis à jour
    // );

    //console.log(updatedUser);

    res.cookie('jwt_token', '', { httpOnly: false, maxAge: 1 });
    req.session.destroy();
    res.status(200).json({
      message: 'User successfully logged out',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.login(email, password)
    /*
    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
        $set: {
          statu: true,
          visitsCount: user.visitsCount +1 ,
        },
      }, { new: true } // Set the { new: true } option to return the updated user
    )*/
    //sendWelcomeEmail(email, nom);
    const token = createToken(user._id)
    res.cookie('jwt_token', token, { httpOnly: false, maxAge: maxAge * 1000 })
    //req.session.user = user
    // console.log(req.session);
    res.status(200).json({
      message: 'User successfully authenticated', user: user,
    })
  } catch (error) {
    res.status(400).json({
      erreur: error.message,
    })
  }
}

function sendWelcomeEmail (email, nom, id) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
      user: 'studyspheretn@gmail.com', pass: 'uqct kspi rgnt yzre',
    },
  })
  const activationLink = `http://localhost:5000/auth/validation?email=${encodeURIComponent(email)}`
  const mailOptions = {
    from: 'studyspheretn@gmail.com', to: email, subject: 'Bienvenue sur notre site', html: `
      <html>
        <head>
          <style>
            /* Add your custom styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 5px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
            }
            p {
              color: #555555;
            }
            h2 {
              color: #0000FF;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 4px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bienvenue sur notre site</h1>
            <p>Cher</p> <h2> ${nom},</h2>
            <p>Nous sommes ravis de vous accueillir parmi nous !</p>
            <p>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>
            <a href="${activationLink}" ${id} class="button">Activer mon compte</a>
            <p>Cordialement,<br>L'équipe du site</p>
          </div>
        </body>
      </html>
    `,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de bienvenue :', error)
    } else {
      console.log('E-mail de bienvenue envoyé avec succès !')
    }
  })
}

module.exports.addUser = async (req, res, next) => {
  try {
    const { name, age, address, moy } = req.body;
    const user = new userModel({
      name,
      age,
      address,
      moy,
    });
    const adduser = await user.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserid = async (req, res, next) => {
  const { id } = req.params; // Récupérer l'ID de l'URL
  try {
    const user = await userModel.findById(id); // Rechercher l'utilisateur par son ID
    if (!user) {
      // Si aucun utilisateur n'est trouvé, renvoyer une erreur 404
      return res.status(404).json({ message: "User not found" });
    }
    // Si l'utilisateur est trouvé, renvoyer l'utilisateur dans la réponse
    res.status(200).json({ user });
  } catch (error) {
    // En cas d'erreur serveur, renvoyer une erreur 500 avec le message d'erreur
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    console.log(req.session.user);
    //const userList = await userModel.find();
    const userList = await userModel.find().populate('cars');

    if (!userList && userList.length === 0) {
      throw new Error("users not found");
    }
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAuthUser = async (req, res, next) => {
  try {
    const user = req.session.user; 
    //console.log(user);
    res.status(200).json({ user });
  } catch (error) {
    // En cas d'erreur serveur, renvoyer une erreur 500 avec le message d'erreur
    res.status(500).json({ message: error.message });
  }
};


module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age, address, moy } = req.body;
    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("User not found !");
    }
    updated = await userModel.findByIdAndUpdate(
      id,
      {
        $set: { name, age, address, moy },
      },
      { new: true }
    );
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("User not found !");
    }
    await userModel.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSortedUsersByAge = async (req, res, next) => {
  try {
    const userList = await userModel.find().sort({ age: -1 }); // 1 pour tri croissant, -1 pour tri décroissant

    if (!userList || userList.length === 0) {
      throw new Error("Aucun utilisateur trouvé");
    }

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSortedUsersByAgeDes = async (req, res, next) => {
  try {
    const userList = await userModel.find().sort({ age: 1 }); // 1 pour tri croissant, -1 pour tri décroissant

    if (!userList || userList.length === 0) {
      throw new Error("Aucun utilisateur trouvé");
    }

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.searchUsersByName = async (req, res, next) => {
  try {
    const { name } = req.query; // Récupérer le nom à rechercher depuis la requête

    if (!name) {
      throw new Error("Veuillez fournir un nom pour la recherche.");
    }

    const userList = await userModel.find({
      name: { $regex: name, $options: "i" },
    });

    if (!userList || userList.length === 0) {
      throw new Error("Aucun utilisateur trouvé pour ce nom.");
    }

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserImage = async (req, res, next) => {
  try {
    const { name, age, address, moy } = req.body;
    const user = new userModel({
      name,
      age,
      address,
      moy,
    });
    const adduser = await user.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUserImage = async (req, res) => {
  console.log(req.body);
  const { filename } = req.file;
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(200).json({ message: "Email required" });
    }
    const adduser = await userModel.create({
      password,
      email,
      image_user: filename
    });
    res.status(200).json(adduser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
