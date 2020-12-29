let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server'); 


chai.should();
chai.use(chaiHttp);

describe('Testing API\'s',()=>{

    const user_file0_without_ttl = {
        "key" : "1e234b1212gg1e234b1212gg1e234b12",
        "value" : {"name" : "hello0"} 
    }

    const user_file7_with_ttl = {
        "key" : "1e234b1212gg1e234b1212gg1e234b19",
        "value" : {"name" : "hello7"},
        "ttl" : 5 
    }
    
    const user_file0_key_greaterthan_32 = {
        "key" : "1e234b1212gg1e234b1212gg1e234b123c",
        "value" : {"name" : "hello"} 
    }


    /**
     * Test the Create Route
     */

     describe("POST /user/create",()=>{
        it("It should post a new key without ttl",(done) => {
            chai.request(server)
            .post("/user/create")
            .send(user_file0_without_ttl)
            .end((err,res)=>{
                res.should.have.status(201);
                res.body.should.eql(user_file0_without_ttl);
            done();
            })
        })
     })

     describe("POST /user/create",()=>{
        it("It should post a new key with ttl",(done) => {
            chai.request(server)
            .post("/user/create")
            .send(user_file7_with_ttl)
            .end((err,res)=>{
                res.should.have.status(201);
                res.body.should.eql({"key" : user_file7_with_ttl.key,"value" : user_file7_with_ttl.value});
            done();
            })
        })
     })


    describe("POST /user/create",()=>{
        it("Key should be less than or equal to 32chars",(done) => {
            chai.request(server)
            .post("/user/create")
            .send(user_file0_key_greaterthan_32)
            .end((err,res)=>{
                res.should.have.status(405);
                res.text.should.eql("Key should be of less than or equal to 32 characters")
            done();
            })
        })
     })

     describe("POST /user/create",()=>{
        it("Key should be unique",(done) => {
            chai.request(server)
            .post("/user/create")
            .send(user_file0_without_ttl)
            .end((err,res)=>{
                res.should.have.status(405);
                res.text.should.eql("Key is already exist")
            done();
            })
        })
     })

     /**
     * Test the Read Route
     */

    const key_exist = "1e234b1212gg1e234b1212gg1e234b12";
    const key_doesnot_exist = "1e234b1010mg1e234b1212gg1e234b38";
    const key_expired = "1e234b1212gg1e234b1212gg1e234b19";
    const file_not_exist_key = "1e234b1212gg1e234b1212gg1e234b10";


    describe("GET /user/read/:key",()=>{
        it("Should get the value by key",(done) => {
            chai.request(server)
            .get("/user/read/" + key_exist)
            .end((err,res)=>{
                res.should.have.status(201);
                res.body.should.eql({"value" : {"name" : "hello0"} });
            done();
            })
        })
     })

     describe("GET /user/read/:key",()=>{
        it("should get 405 if the key does not exist",(done) => {
            chai.request(server)
            .get("/user/read/" + key_doesnot_exist)
            .end((err,res)=>{
                res.should.have.status(405);
                res.text.should.eql("Key doesn't exist");
            done();
            })
        })
     })

     describe("GET /user/read/:key",()=>{
        it("should get 405 if the key is expired",(done) => {
            setTimeout(function(){
                chai.request(server)
                .get("/user/read/" + key_expired)
                .end((err,res)=>{
                    res.should.have.status(405);
                    res.text.should.eql("Key is expired");
                })
            }, 6000);
            done();
        })
     })

     describe("GET /user/read/:key",()=>{
        it("should get 405 if the file is not exist",(done) => {
            chai.request(server)
            .get("/user/read/" + file_not_exist_key)
            .end((err,res)=>{
                res.should.have.status(405);
                res.text.should.eql("File doesn't exist");
                done();
            })  
        })
     })


     /**
     * Test the Delete Route
     */


     const key_doesnot_exist_for_deletion = "1e234b1212gg1e214b1313gg1e234b12";
     const key_exist_for_deletion = "1e234b1212gg1e234b1212gg1e234b12";
     const key_expired_for_deletion = "1e234b1212gg1e234b1212gg1e234b19";

    describe("DELETE /user/delete/:key",()=>{
        it("should get 405 if the key does not exist for deletion",(done) => {
            chai.request(server)
            .delete("/user/delete/" + key_doesnot_exist_for_deletion)
            .end((err,res)=>{
                res.should.have.status(405);
                res.text.should.eql("Key doesn't exist");
            done();
            })
        })
     })

     describe("DELETE /user/delete/:key",()=>{
        it("should get 200 if the key is successfully deleted",(done) => {
            chai.request(server)
            .delete("/user/delete/" + key_exist_for_deletion)
            .end((err,res)=>{
                res.should.have.status(200);
                res.text.should.eql("Key is deleted successfully");
            done();
            })
        })
     })

     describe("DELETE /user/delete/:key",()=>{
        it("should get 405 if the key is expired for deletion",(done) => {
            setTimeout(function(){
                chai.request(server)
                .delete("/user/delete/" + key_expired)
                .end((err,res)=>{
                    res.should.have.status(405);
                    res.text.should.eql("Key is expired");
                })
            }, 7000);
            done();
        })
     })
});