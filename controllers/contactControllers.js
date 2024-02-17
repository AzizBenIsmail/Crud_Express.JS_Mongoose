const contactModel=require("../Models/contact");
const addContact=async(req,res,next)=>{
    try {
        const {fullName,phone}=req.body;
        console.log(req.body);  
        const contact=new contactModel({fullName,phone});
        const addedContact = await contact.save();
        res.status(200).json(addedContact);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const getContactsid = async (req, res, next) => {
    const { id } = req.params; // Récupérer l'ID de l'URL
    try {
        const contact = await contactModel.findById(id); // Rechercher l'utilisateur par son ID
        if (!contact) {
            // Si aucun utilisateur n'est trouvé, renvoyer une erreur 404
            return res.status(404).json({ message: 'User not found' });
        }
        // Si l'utilisateur est trouvé, renvoyer l'utilisateur dans la réponse
        res.status(200).json({ contact });
    } catch (error) {
        // En cas d'erreur serveur, renvoyer une erreur 500 avec le message d'erreur
        res.status(500).json({ message: error.message });
    }
};


const getContacts=async(req,res,next)=>{
    try {
        const contacts = await contactModel.find();
        if(!contacts||contacts.length===0){
            throw new Error('Contacts not found !')
        }
        res.status(200).json({contacts});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
    
};
const updateContact=async(req,res,next)=>{
    try {
        const {id} = req.params;
        const {fullName,phone}=req.body;
        const checkIfContactExists=await contactModel.findById(id);
        if(!checkIfContactExists){
            throw new Error("Contact not found !");
        }
        updated=await contactModel.findByIdAndUpdate(
            id,{
                $set:{fullName,phone}
            },{new:true}
        );
        res.status(200).json({updated});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const deleteContact=async(req,res,next)=>{
    try {
        const {id} = req.params;
        const checkIfContactExists=await contactModel.findById(id);
        if(!checkIfContactExists){
            throw new Error("Contact not found !");
        }
        await contactModel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
module.exports={
    addContact,
    getContacts,
    deleteContact,
    updateContact,
    getContactsid
}
