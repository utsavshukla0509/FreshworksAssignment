const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require("express");
const userRoute = require("./routes/user");
const { builtinModules } = require('module');

 
const app = express();

// app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

var memo = [];
memo.length = 10;
for(let i = 0;i<10;i++){
    memo[i] = false;
}



app.use("/user",userRoute);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = {memo : memo};