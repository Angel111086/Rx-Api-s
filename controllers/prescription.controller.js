const Prescription = require('../modals/prescription.modal');
const passport = require('passport');
var jimp = require("jimp");


//User Token
module.exports.insertPrescription = function(req,res, next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        try{
    
            var file1 = (typeof req.files.prescription_img1 !== "undefined") ? req.files.prescription_img1[0].filename : '';
            console.log('filename1 ',file1 == '');
            if(file1 == ''){
                res.status(400).send({ success:false, message: 'Please Provide Prescription Image.' }); 
            }
            else{
                file1 = './public/prescription/' + req.files.prescription_img1[0].filename;
                jimp.read(file1, function (err, img) {
                if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/prescription/' + file1) // save
                    file1 = './public/prescription/' + file1;
                    console.log('Resized !!', file1);              
                });
            }

            var file2 = (typeof req.files.prescription_img2 !== "undefined") ? req.files.prescription_img2[0].filename : '';
            console.log('filename2 ',file2 == '');
            if(file2 == ''){
                //res.status(400).send({ success:false, message: 'Please Provide Prescription Image.' }); 
                file2='';
            }
            else{
                file2 = './public/prescription/' + req.files.prescription_img2[0].filename;
                jimp.read(file2, function (err, img) {
                if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/prescription/' + file2) // save
                    console.log('Resized !!')              
                });
            }

            var file3 = (typeof req.files.prescription_img3 !== "undefined") ? req.files.prescription_img3[0].filename : '';
            console.log('filename3 ',file3 == '');
            if(file3 == ''){
                //res.status(400).send({ success:false, message: 'Please Provide Prescription Image.' }); 
                file3='';
            }
            else{
                file3 = './public/prescription/' + req.files.prescription_img3[0].filename;
                jimp.read(file3, function (err, img) {
                if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/prescription/' + file3) // save
                    console.log('Resized !!')              
                });
            }

            var file4 = (typeof req.files.prescription_img4 !== "undefined") ? req.files.prescription_img4[0].filename : '';
            console.log('filename4 ',file4 == '');
            if(file4 == ''){
                //res.status(400).send({ success:false, message: 'Please Provide Prescription Image.' }); 
                file4 = '';
            }
            else{
                file4 = './public/prescription/' + req.files.prescription_img4[0].filename;
                jimp.read(file4, function (err, img) {
                if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/prescription/' + file4) // save
                    console.log('Resized !!')              
                });
            }
            var prescription = new Prescription(req.body, file1,file2,file3,file4);
            if(user[0].login_registerid == null){
                prescription.login_registerid = 0;
            }
            else{
                prescription.login_registerid = user[0].login_registerid;
            }
            
            if(!prescription.appointment_id){
                return res.status(400).send({ success:false, message: 'Please Provide Appointment Name.' });        
            }
            prescription.prescription_uploaddate = new Date;
            prescription.statusId=1;
            prescription.createdById = prescription.appointment_id;
            prescription.creationDate = new Date;

            var ridedetails = {
                "pickup_address": req.body.pickup_address,
                "drop_address": req.body.drop_address,
                "landmark": req.body.landmark,
                "ride_date": req.body.ride_date,
                "ride_time": req.body.ride_time,
                "ride_status": req.body.ride_status,
                "ride_status_description": req.body.ride_status_description
            }
            Prescription.createPrescription(prescription,ridedetails,function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    res.send({status:200,success:true,message:data.message});
                }
            });
//    }    
}catch(e){ console.log("catch",e);   }  
}
    })(req,res,next)
}

module.exports.getAllPrescription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.getAllPrescription(function(err,data){
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
//List of All Prescription

module.exports.getListOfAllPrescription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.getListOfAllPrescription(function(err,data){
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



module.exports.getPrescriptionById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.getPrescriptionById(req.query.prescription_id,function(err,data){
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

module.exports.updatePrescription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var prescription = new Prescription(req.body); 
        prescription.modifiedById = user[0].id;
        prescription.modificationDate = new Date;
        Prescription.updatePrescriptionStatus(req.body.prescription_id,prescription,function(err, data) 
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

module.exports.checkPrescriptionStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.checkImageStatus(req.query.prescription_id,req.query.appointment_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data.message});
                }
            });
       }
  })(req,res,next)
}





module.exports.checkPrescriptionImageStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.checkPrescriptionImageStatus(req.query.appointment_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    if(data.message == 'No Data Found.'){
                        res.send({status:200,success:true,message: data.message});
                    }
                    else{
                        res.send({status:200,success:true,message:"Detail Found", data:data.message});
                    }
                    
                }
            });
       }
  })(req,res,next)
}


module.exports.getPrescriptionByStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Prescription.getPrescriptionByStatus(req.query.prescription_status,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message: "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
