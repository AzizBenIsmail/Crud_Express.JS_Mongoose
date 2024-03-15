const userModel = require("../Models/userModel");

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
    //const userList = await userModel.find();
    const userList = await userModel.find().populate('cars');

    if (!userList && userList.length === 0) {
      throw new Error("users not found");
    }
    console.log(userList);
    res.status(200).json(userList);
  } catch (error) {
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
