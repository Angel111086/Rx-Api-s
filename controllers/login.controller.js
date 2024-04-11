const pool = require('../authorization/pool');
var jwt = require('jsonwebtoken');
const passport = require('passport');
const LoginRegister = require('../modals/loginregister.modal');


module.exports.userLogin = function(req,res)
{    
    
    var usercontact_number = req.body.contact_number;  
    var query= `select * from login_register where contact_number = ${usercontact_number}`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            res.json({ status: 401, success: false, error: "Something Went Worng." });
        }
        else{     
            console.log('The solution is: ', user);
            console.log('Length', user.length);
            if(user.length == 0)
            {
                    //return res.json({ status: 401, success: false, message: "Username does not Exists." });
                    
                    console.log('Cond', usercontact_number.length < 10);
                    if(usercontact_number.length < 10){
                        return res.json({ status: 401, success: false, message: "Mobile Number should be of 10 digits." });
                    }
                    else{
                        var username;    
                        var login = new LoginRegister(req.body);
                        login.statusId = 1
                        login.creationDate = new Date;
                        LoginRegister.createLogin(login, function(err, data){
                            if(err){
                                console.log('Error', err);
                                return res.json({ status: 401, success: false, message: "Something Went Wrong." });
                            }
                            else{
                                var token = "";
                                var secret = "";
                                secret = {type: 'user',  contact_number: usercontact_number};
                                                          token = jwt.sign(secret, 'rxaushadi', {
                                                              expiresIn: 31557600000
                                            });
                                console.log("Demo=" + token);

                                //to get username
                                pool.query(`select * from login_register where login_registerid = ${data.id}`,function(err,namedata){
                                    if(err){
                                        console.log("Select If",err);
                                
                                    }
                                    else{
                                        username = namedata[0].registeredusername;
                                        console.log('Unregistered UN', username);
                                        res.send({status:200, success: true,message:"Login Successful",id: data.id, 
                                        username: username, token:token });
                                    }
                                });

                               
                            }
                    
                    });
                }
            }             
            else if(user.length > 0)
            {                 
                if(user[0].contact_number == usercontact_number)
                {
                    console.log("working", user[0].contact_number);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'user', contact_number: user[0].contact_number};
                                              token = jwt.sign(secret, 'rxaushadi', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,message:"Login Successful",
                    id: user[0].login_registerid,  username: user[0].registeredusername,token:token });
                }
                else{
                        res.send({status:200, success: false, message:"Contact Number Mismatch"});
                    }
            }
        }
            
        });  
}


module.exports.updateUser = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var login = new LoginRegister(req.body);                 
        if(!user[0].login_registerid)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Id.' });        
        }
        else if(!login.registeredusername)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Name.' });        
        }        
        login.modifiedById = user[0].login_registerid;
        login.modificationDate = new Date;
        LoginRegister.updateUsername(user[0].login_registerid,login,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Admin Api
module.exports.getAllUsers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
            LoginRegister.getAllUsers(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    console.log('All App Data', data);
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getUserById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
            LoginRegister.getUserById(user[0].login_registerid,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    console.log('All App Data', data);
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}


module.exports.searchUser = function(req,res)
{
    LoginRegister.searchUser(req.query.name,function(err,data){
    if(err){
        res.send({status:400,success:false,message:"No Detail Found"});
    }
    else if(data.length==0){
        res.send({status:200,success:true,message:"No Detail Available"});
    }
    else{
           console.log('All App Data', data);
           res.send({status:200,success:true,message:"Detail Found", data:data});
    }
    });
}

