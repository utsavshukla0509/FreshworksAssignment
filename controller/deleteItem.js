const fs = require('fs');
const { HashedString } =  require('../ConvertHashed');

class DeleteItem{
    handleRequest(req,res){
        const key = req.params.key;

        if(key.length > 32){
            return res.status(405).send("Key should be of 32 characters");
        }

        let hashedNumber = HashedString(key);
        const path = file_path + "file" + hashedNumber + ".json";

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
                    return res.status(405).send("Key doesn't exist");
                }
                else{

                    if((found.ttl === -1) || (((Date.now()/1000)-found.createdOn) < found.ttl)){
                        userData.splice(userData.findIndex(ele => ele.key === key) , 1);
                        let json_data = JSON.stringify(userData);
                        fs.writeFileSync(path, json_data);
                        memo[hashedNumber] = false;
                        return res.status(200).send("Key is deleted successfully");
                    }
                    else{
                        memo[hashedNumber] = false;
                        res.status(405).send("Key is expired");
                    }
                }
            }
            else{
                memo[hashedNumber] = false;
                return res.status(405).send("File doesn't exist");
            }
        } catch(err) {
            memo[hashedNumber] = false;
            console.log(err);
        }
    }
};

module.exports = {DeleteItem : DeleteItem};