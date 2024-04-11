const pool = require('../authorization/pool');

module.exports.aboutUs = function(req,res){
    pool.query('select * from aboutus where about_id=1', function(err, data){
        if(err){
            console.log(err);
            res.json({ status: 401, success: false, error: "Something Went Worng." });
        }
        else{
            res.send({status:200, success: true,message:"Successful",data:data });
        }
    });
}

module.exports.googleLink = function(req,res){
    pool.query('select * from aboutus where about_id=2', function(err, data){
        if(err){
            console.log(err);
            res.json({ status: 401, success: false, error: "Something Went Worng." });
        }
        else{
            res.send({status:200, success: true,message:"Successful",data:data });
        }
    });
}