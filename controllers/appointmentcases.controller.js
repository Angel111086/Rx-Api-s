var AppointmentCases = require('../modals/appointmentcases.modal');
const pool = require('../authorization/pool');
const passport = require('passport');


module.exports.getAllAppointmentCases = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getAllCases(function(err,data){
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

// Medicine Page, listing all medicine details
module.exports.getAllMedicineStatusData = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getAllMedcineCases(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//Get By Id
module.exports.getAllMedicineStatusDataById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getAllMedcineCaseById(req.query.appointmentcaseId,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}





module.exports.getAllTotalCases = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getTotalCases(function(err,data){
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

module.exports.getCaseDescription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getCaseDescription(function(err,data){
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

module.exports.updateAppointmentCase = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var ac = new AppointmentCases(req.body); 
        ac.modifiedById = user[0].id;
        ac.modificationDate = new Date;
        AppointmentCases.updateAppointmentCaseStatus(req.body.appointmentcaseId,ac,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not updated."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}


module.exports.updateAppointmentMedicineCase = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var ac = new AppointmentCases(req.body); 
        ac.modifiedById = user[0].id;
        ac.modificationDate = new Date;
        AppointmentCases.updateMedicineStatus(req.body.appointmentcaseId,ac,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not updated."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}


module.exports.getAppointmentCaseById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getCaseById(req.query.appointmentcaseId,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

module.exports.getAppointmentCaseByStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getCaseByStatus(req.query.medicine_status,function(err,data){
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


//Admin api, specific for a user
module.exports.getUserAllCaseById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getUserAllCaseById(req.query.login_registerid,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}


module.exports.getUserCaseDescriptionByCaseId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            AppointmentCases.getUserCaseDescriptionByCaseId(req.query.appointmentcaseId,req.query.login_registerid,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found" + err});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}


//filter Appointment Cases

module.exports.getCaseByStatus = function(req,res,next)
{
    AppointmentCases.getCaseByStatus(req.query.status,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found" + err});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        }
        else{
            res.send({status:200,success:true,message:"Detail Found", data:data});
        }
   });
}
 
//Search Cases
module.exports.searchCases = function(req,res,next)
{
    AppointmentCases.searchCases(req.query.name,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found" + err});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        }
        else{
            res.send({status:200,success:true,message:"Detail Found", data:data});
        }
   });
}
 