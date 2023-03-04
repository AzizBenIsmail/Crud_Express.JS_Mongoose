const contactModel=require("../model/contact");
const addContact=async(req,res,next)=>{
    try {
        const {fullName,phone}=req.body;
        const contact=new contactModel({fullName,phone});
        const addedContact = await contact.save();
        res.status(200).json(addedContact);
    } catch (error) {
        res.status(500).json({message:error.message});
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
        const {fullName,phone}=res.body;
        const checkIfContactExists=await contactModel.findById(id);
        if(!checkIfContactExists){
            throw new Error("Contact not found !");
        }
        updatedContact=await contactModel.findByIdAndUpdate(
            id,{
                $set:{fullName,phone}
            },{new:true}
        );
    
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
const deleteContact=async(req,res,next)=>{
    try {
        const {id} = req.params;
        const {fullName,phone}=res.body;
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
    updateContact
}