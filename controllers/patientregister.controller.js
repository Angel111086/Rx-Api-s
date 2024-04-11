var Patient = require('../modals/patientregister.modal');
const pool = require('../authorization/pool');
const passport = require('passport');

module.exports.insertPatient = function(req,res)
{
        var patient = new Patient(req.body);               
        patient.statusId=1;
        //category.createdById = user[0].id;
        patient.creationDate = new Date;
        Patient.createPatient(patient, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Details Not Saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message, patient_id: data.id});
            }
        }); 
      
}


module.exports.getAllPatients = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Patient.getAllPatient(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getTotalPatients = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Patient.getTotalPatient(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.searchPatients = function (req, res) { 
    var name = req.query.name;    
     var search_query;
     if(name)
     {
         search_query = `SELECT * from patient_register where patientname LIKE '%${name}%' and statusId=1`
    }
    console.log('Query', search_query);
    pool.query(search_query, function(err,data)
    {
         if(err) {
             console.log(err)
             response = {status:400,success:false,message:"Error fetching data"};
         } 
         else if(data.length == 0){
           response = {status: 200, success : false, message : "No Data Found"};
         }
         else {
             response = {status: 200, success : true, message : "Data Found", "SearchData": data};
         }
         res.json(response);
     });
}