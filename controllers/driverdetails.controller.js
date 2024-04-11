var Driver = require('../modals/driverdetails.modal');
const pool = require('../authorization/pool');
var jwt = require('jsonwebtoken');
const passport = require('passport');

//Insert Api..Admin

module.exports.insertDriverDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
        var driver = new Driver(req.body);                
        if(!driver.drivername)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Driver Name.' });        
        }
        if(!driver.drivercontact_number)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Driver Contact Number.' });        
        }
        if(!driver.vehicle_number)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Vehicle Number.' });        
        }
        if(!driver.vehicle_make)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Vehicle Make.' });        
        }
        driver.driver_status = 'available';
        driver.statusId=1;
        driver.createdById = user[0].id;
        driver.creationDate = new Date;
        Driver.createDriver(driver, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:data.message});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
    }
})(req,res,next);
}

//Update Api..Admin

module.exports.updateDriverDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
        var driver = new Driver(req.body);                
        if(!driver.drivercontact_number)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Driver Contact Number.' });        
        }
        if(!driver.vehicle_number)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Vehicle Number.' });        
        }
        if(!driver.vehicle_make)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Vehicle Make.' });        
        }
        driver.statusId=1;
        driver.modifiedById = user[0].id;
        driver.modificationDate = new Date;
        Driver.updateDriver(req.body.driverdetails_id,driver, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:data.message});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
    }
})(req,res,next);
}

module.exports.getAllDrivers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Driver.getAllDrivers(function(err,data){
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

module.exports.getDriverById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Driver.getDriverById(req.query.driverdetails_id,function(err,data){
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

module.exports.getDriverByStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Driver.getDriverByStatus(req.query.driver_status,function(err,data){
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

//Login Api Driver

module.exports.driverLogin = function(req,res)
{    
    var drivercontact_number = req.body.drivercontact_number;  
    var driverpin = req.body.driverpin;  
    var query= `select * from driverdetails where drivercontact_number=${drivercontact_number}`;
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
            if(user.length == 0){
                    return res.json({ status: 401, success: false, message: "Mobile Number does not Exists." });
            }             
            else if(user.length > 0)
            {                 
                 if(user[0].driverpin == driverpin)
                 {
                    //console.log("working", user[0].adminpassword);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'driver', _id: user[0].driverdetails_id, drivercontact_number: user[0].drivercontact_number};
                                              token = jwt.sign(secret, 'rxaushadi', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,message:"Login Successful",token:token });
                }
                else{
                        res.send({status:200, success: false, message:"Pin Mismatch"});
                    }
                }         
                else
                {
                    res.send({status:401, success: false, message:"Invalid Mobile Number"});
                }
            }
            
        });  
}


//Driver User Api
module.exports.getDriverRide = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            pool.query(`select appcase.appointmentcaseId,rm.ridemaster_id,app.fullname, app.age, app.gender, app.contact_number, 
                dm.doctorname, app.appointment_time, 
                rd.pickup_address, rd.drop_address, 
                DATE_FORMAT(rd.ride_date, '%d-%m-%Y') as ride_date, rd.ride_time from ridedetails rd                 
                LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
                LEFT JOIN appointmentcases as appcase ON(appcase.appointmentcaseId = rm.appointmentcaseId)
                LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
                LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
                LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
                where rd.statusId=1 and rm.statusId=1 and rm.driver_id=${user[0].driverdetails_id}`,function(err,data){
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

module.exports.getDriverRideById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var qu = `select appcase.appointmentcaseId,pres.prescription_id, rm.ridemaster_id, rm.ride_status, rm.ride_status_description,
            app.fullname, app.age, app.gender, app.contact_number, dm.doctorname, app.appointment_time, 
            rd.pickup_address, rd.drop_address, DATE_FORMAT(rd.ride_date, '%d-%m-%Y') as ride_date, 
            rd.ride_time from ridedetails rd 
            LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
            LEFT JOIN appointmentcases as appcase ON(appcase.appointmentcaseId = rm.appointmentcaseId)
            LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
            LEFT JOIN prescription as pres ON(pres.prescription_id = rm.prescription_id)
            LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
            LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
            where rd.statusId=1 and rm.statusId=1 and 
            (rm.ride_status='Driver Assigned for Home pickup' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Picked from Home' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Dropped at Clinic' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Driver Assigned for Clinic pickup' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received')
            || (rm.ride_status='Picked from Clinic' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received')
            || (rm.ride_status='Dropped at Home' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received') 
            || driver.driverdetails_id=${user[0].driverdetails_id}`
            console.log('Query',qu);
            pool.query(qu,function(err,data){
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
