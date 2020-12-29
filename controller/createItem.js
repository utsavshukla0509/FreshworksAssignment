const fs = require('fs');
const { HashedString } =  require('../ConvertHashed');
var util= require('util');

class CreateItem{
    handleRequest(req,res){

        const key = req.body.key;
        const value = req.body.value;
        const ttl = req.body.ttl === undefined ? -1 : req.body.ttl;
        const createdOn = Date.now()/1000;
    
        if(key.length > 32){                       //32 chars
            return res.status(405).send("Key should be of less than or equal to 32 characters");
        }
        const size = new util.TextEncoder().encode(JSON.stringify(value)).length
        const kiloBytes = size / 1024;


        if(kiloBytes > 16){                               //16KB
            return res.status(405).send("Value should less than or equal to 16KB");
        }

        let hashedNumber = HashedString(key);
        const path = "file" + hashedNumber + ".json";
        
        if(memo[hashedNumber] === true){
            return res.status(405).send("Given file is already in use");
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
                    return res.status(201).json({"data" : user});
                }
                else{

                    if((found.ttl === -1) || (((Date.now()/1000)-found.createdOn) < found.ttl)){
                        memo[hashedNumber] = false;
                        return res.status(405).send("Key is already exist");
                    }
                    else{
                        userData.splice(userData.findIndex(ele => ele.key === key) , 1);
                        userData.push(user);
                        let json_data = JSON.stringify(userData);
                        fs.writeFileSync(path, json_data);
                        memo[hashedNumber] = false;
                        return res.status(200).json({"data" : found});
                    }
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
                return res.status(201).json({"key" : user.key,"value" : user.value});
            }
        } catch(err) {
            memo[hashedNumber] = false;
            console.log(err);
        }
    }
};

module.exports = {CreateItem : CreateItem};