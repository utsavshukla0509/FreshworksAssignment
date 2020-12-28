const express = require("express");
const router = express.Router();

const {CreateItem} = require('../controller/createItem');
const {ReadItem} = require('../controller/readItem');
const {DeleteItem} = require('../controller/deleteItem');

const createItem = new CreateItem();
// const readItem = new ReadItem();
// const deleteItem = new DeleteItem();

router.post("/create", (req,res) => {
    createItem.handleRequest(req,res);
});

// router.get("/read", (req,res) => {
//     readItem.handleRequest(req,res);
// });

// router.delete("/delete", (req,res) => {
//     deleteItem.handleRequest(req,res);
// });


module.exports = router;