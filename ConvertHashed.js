function HashedString(str){
    let hashedNumber = 0;
    for(let i = 0; i < str.length; i++){
        hashedNumber = hashedNumber + str[i].charCodeAt(0);    
    }
    return hashedNumber%10;
}

module.exports = {
    HashedString : HashedString
};