const fs = require('fs');
const { HashedString } =  require('../ConvertHashed');
const { memo } = require('../server');

class ReadItem{
    handleRequest(req,res){
        const key = req.params.key;

        if(key.length !== 32){
            return res.status(400).send("Key should be of 32 characters");
        }
        
        let hashedNumber = HashedString(key);
        const path = "file" + hashedNumber + ".json";

        if(memo[hashedNumber]){
            return res.status(200).send("File is already in use");
        }
        memo[hashedNumber] = true;

        try {
            if (fs.existsSync(path)) {
                let rawdata = fs.readFileSync(path);
                let userData = JSON.parse(rawdata);

                let found = userData.find((ele)=>{return (ele.key === key)}); 

                if(found === undefined){
                    memo[hashedNumber] = false;
                    return res.status(200).send("Key doesn't exist");
                }
                else{
                    if((found.ttl === -1) || (((Date.now()/1000)-found.createdOn) < found.ttl)){
                        memo[hashedNumber] = false;
                        return res.status(200).json({"key" : found.key,"value":found.value});
                    }
                    else{
                        userData.splice(userData.findIndex(ele => ele.key === key) , 1);
                        let json_data = JSON.stringify(userData);
                        fs.writeFileSync(path, json_data);
                        memo[hashedNumber] = false;
                        return res.status(200).json({"data" : user});
                    }
                }
            }
            else{
                memo[hashedNumber] = false;
                return res.status(200).send("File doesn't exist");
            }
        } catch(err) {
            memo[hashedNumber] = false;
            console.log(err);
        }
    }
};

module.exports = {ReadItem : ReadItem};