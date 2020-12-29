const fs = require('fs');
const { HashedString } =  require('../ConvertHashed');
var memo = require('../server');

class CreateItem{
    handleRequest(req,res){

        const key = req.body.key;
        const value = req.body.value;
        const ttl = req.body.ttl === undefined ? -1 : req.body.ttl;
        const createdOn = Date.now()/1000;
    
        if(key.length !== 32){
            return res.status(400).send("Key should be of 32 characters");
        }

        let hashedNumber = HashedString(key);
        const path = "file" + hashedNumber + ".json";

        if(memo[hashedNumber]){
            return res.status(200).send("File is already in use");
        }

        memo[hashedNumber] = true;


        let user = { 
            "key" : key,
            "value" : value,
            "ttl" : ttl,
            "createdOn" : createdOn,
        };

        try {
            if (fs.existsSync(path)) {
                let rawdata = fs.readFileSync(path);
                let userData = JSON.parse(rawdata);

                let found = userData.find((ele)=>{return (ele.key === key)}); 

                if(found === undefined){
                    userData.push(user);
                    let json_data = JSON.stringify(userData);
                    fs.writeFileSync(path, json_data);
                    memo[hashedNumber] = false;
                    return res.status(200).json({"data" : user});
                }
                else{
                    memo[hashedNumber] = false;
                    return res.status(200).send("Key is already exist");
                }
            }
            else{
                fs.open(path, 'w', function (err, file) {
                    console.log(file);
                    console.log("file" + hashedNumber + " is created");
                });
                 
                let data = [];
                data.push(user);
                let json_data = JSON.stringify(data);
                fs.writeFileSync(path, json_data);
                memo[hashedNumber] = false;
                return res.status(200).json({"data" : user});
            }
        } catch(err) {
            memo[hashedNumber] = false;
            console.log(err);
        }
    }
};

module.exports = {CreateItem : CreateItem};