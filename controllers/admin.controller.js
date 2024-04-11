const pool = require('../authorization/pool');
var jwt = require('jsonwebtoken');
const passport = require('passport');


module.exports.adminLogin = function(req,res)
{    
    var username = req.body.username;  
    var password = req.body.password;
    var query= `select * from adminlogin where adminname='${username}'`;
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
            console.log('Password',password);
            if(user.length == 0){
                    return res.json({ status: 401, success: false, message: "Username does not Exists." });
            }             
            else if(user.length > 0)
            {                 
                if(user[0].adminpassword == password)
                {
                    console.log("working", user[0].adminpassword);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'admin', _id: user[0].id, password: user[0].adminpassword};
                                              token = jwt.sign(secret, 'rxaushadi', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,message:"Login Successful",token:token });
                }
                else{
                        res.send({status:200, success: false, message:"Password Mismatch"});
                    }
                }         
                else
                {
                    res.send({status:401, success: false, message:"Invalid Username and Password"});
                }
            }
            
        });  
}