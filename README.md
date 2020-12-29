# FreshworksAssignment
Build a file-based key-value data store
## Table fo Contents

1. **[Create user key](#createuserkey)**<br>
2. **[Read user key](#readuserkey)**<br>
3. **[Delete user key](#deleteuserkey)**<br>
4. **[Commands Available](#commandsavailable)**<br>



<a name = "createuserkey"></a>

1. ## Create User Key
    #### POST &nbsp; /user/create
    
    ```
    Request Body : {
        "key" : "1e234b1212gg1e234b1212gg1e234b12",  // Any key which is always a string and capped at 32 chars.
        "value" : {
                    "name" : "hello",       
                    "batch" : "A",                   // Any value which is always a JSON object and capped at 16KB.
                        .
                        .
                        .
                  },
        "ttl" : "10",                               // Time-To-Live property(in seconds) is optional, by default the value of ttl is -1.
        "createdOn" : "1609250866.56"               // denotes the current time in seconds (use (Date.now()/1000)).
    }
    
    Response : {
        "key" : "1e234b1212gg1e234b1212gg1e234b12",
        "value" : {
                    "name" : "hello",       
                    "batch" : "A",                   
                        .
                        .
                        .
                  },
    }
    ```

<a name = "readuserkey"></a>

2. ## Read User Key
    #### GET &nbsp; /user/read/:key
    
    ```    
    Response : {
        "value" : {
                    "name" : "hello",       
                    "batch" : "A",                   
                        .
                        .
                        .
                  }
    }
    ```

<a name = "deleteuserkey"></a>

3. ## Delete User Key
    #### DELETE &nbsp; /user/delete/:key
    
    ```   
    Response : {
        "message" : "Key is successfully deleted"
    }
    ```
    
    
<a name = "commandsavailable"></a>

4. ## Commands Available
   
   ```
   node server.js or nodemon  // to run the node server
   npm test                  // for checking Unit Tests
   ```
    



