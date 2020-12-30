const express = require("express");
const userRoute = require("./routes/user");
const prompt = require('prompt');

 
const app = express();

// app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

global.memo = [];
memo.length = 10;
for(let i = 0;i<10;i++){
    memo[i] = false;
}

app.use("/user",userRoute);

global.file_path = "";
prompt.start();
console.log('Enter your path or press enter q if you don\'t want to give any path');
prompt.get(['path'], function (err, result) {
    if (err) { console.log(err); }
    if(result.path !== 'q'){
        file_path = result.path;
    }
    else{
        file_path = "/home/utsav/Desktop/";
    }
    // console.log(file_path);
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
});

module.exports = app;
