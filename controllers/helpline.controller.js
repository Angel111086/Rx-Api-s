const pool = require("../authorization/pool")

module.exports.getHelpLineNumber = function(req,res){
    query = `select * from helplinenumber where statusId=1`;

    pool.query(query,function(err, data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length == 0){
            res.send({status:400,success:false,message:"No Detail Available"});
        }
        else{
            res.send({status:400,success:false,message:"Detail Found", data: data});
        }
    });
}