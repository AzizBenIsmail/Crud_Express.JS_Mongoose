const express = require('express');
const { getContacts, addContact, updateContact, deleteContact } = require('../controllers/contactControllers');
const router=express.Router();

/* GET home page. */
router.get('/',getContacts);
router.post('/',addContact);
router.put('/:id',updateContact);
router.delete('/:id',deleteContact);

module.exports=router;
