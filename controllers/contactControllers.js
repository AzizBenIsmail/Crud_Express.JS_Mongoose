const contactModel=require("../models/contact");
const addContact = async (req, res) => {
    try {
        const {fullName,phone}= req.body;
        const contact=new contactModel({fullName,phone});
        const addedContact= await contact.save();
        res.status(200).json(addedContact);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const getContacts = async (req, res) => {
    try {
        const contacts= await contactModel.find();
        if(!contacts||contacts.length===0){
            throw new Error('contacts not found');
        }
        res.status(200).json(contacts);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};  
const updateContact =async (req, res) => {
    try {
        const {id}=req.params;
        const {fullName,phone}= req.body;
        const checkContactExist=await contactModel.findById(id);
        if(! checkContactExist){
            throw new Error('contacts not found');
        }
        const updatedContact= await contactModel.findByIdAndUpdate(
            id,
            {
                $set:{fullName,phone}
            },{new:true}
        );
        res.status(200).json(updatedContact);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const deleteContact =async (req, res) => {
    try {
        const {id}=req.params;
        const checkContactExist=await contactModel.findById(id);
        if(! checkContactExist){
            throw new Error('contacts not found');
        }
        await contactModel.findByIdAndDelete(id);
        res.status(200).json("delete with succ");

    } catch (error) {
        res.status(500).json({message:error.message});
    }

};
module.exports={
    addContact,
    getContacts,
    updateContact,
    deleteContact
}