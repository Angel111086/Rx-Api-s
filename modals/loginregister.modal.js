var mysql = require('mysql');
const pool = require('../authorization/pool');

const LoginRegister = function(login) {   
    this.registeredusername = login.registeredusername;
    this.contact_number = login.contact_number;
    this.statusId = login.statusId;
    this.createdById = login.createdById;  
    this.creationDate = login.creationDate;
    this.modifiedById = login.modifiedById;
    this.modificationDate = login.modificationDate;
};

LoginRegister.createLogin = function (login, result) {  
    console.log('Login Details', login);

    pool.query(`select contact_number from login_register where contact_number = ${login.contact_number}`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{               
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Mobile Number already exists."}) ;
                }
                else{
                   
                    pool.query("INSERT INTO login_register SET ?", login, function (err, res) {
                    if(err) {
                        result(err, null);
                    }                
                    else{
                        result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});
                    }
                    });
                }
            }catch(e){console.log(e)}
        }
    });         
};


LoginRegister.updateUsername = function (id, login, result) {  
    var query = `update login_register set registeredusername='${login.registeredusername}' 
                where login_registerid = ${id}`;
    pool.query(query, function(err, res){
        if(err) {
            console.log(err);
            result(err, null);
        }
        else{
            console.log('Detail Query', query);        
            result(null, {status:200,success:true,message:"Details Updated Successfully."});
        }
    });

}

LoginRegister.getAllUsers = function (result) {       
    pool.query(`select * from login_register where statusId=1 
                order by login_registerid DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};

LoginRegister.getUserById = function (id,result) {       
    pool.query(`select * from login_register where statusId=1 
                and login_registerid=${id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};


LoginRegister.searchUser = function (name,result) {       
    pool.query(`select * from login_register where statusId=1 
                and registeredusername LIKE '%${name}%' || contact_number LIKE '${name}'`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};





module.exports = LoginRegister;