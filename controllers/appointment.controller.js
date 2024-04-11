var Appointment = require('../modals/appointment.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
const LoginRegister = require('../modals/loginregister.modal');

//Insert Api..
//For User creating appointment
// module.exports.insertAppointment = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){ 
//         console.log('Appoint Controller', req.body);
//         var appointment = new Appointment(req.body, req.body.ridedetail); 
//         if( user[0].login_registerid == null){
//             appointment.login_registerid = 0;
//         }
//         else{
//             appointment.login_registerid = user[0].login_registerid;
//         }
        
//         if(!appointment.fullname)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Fullname.' });        
//         }
//         if(!appointment.age)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Age.' });        
//         }
//         if(!appointment.gender)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Gender.' });        
//         }
//         if(!appointment.contact_number)
//         {
//             return res.status(400).send({ error:true, message: 'Please Provide Contact Number.' });        
//         }
//         //appointment.appointment_date = new Date;
//         appointment.statusId=1;
//         appointment.createdById = user[0].login_registerid;
//         appointment.creationDate = new Date;
//         Appointment.createAppointment(appointment, req.body.ridedetail,function(err, data) 
//         {
//             if(err)
//             {
//                 res.send({status:400,success:false,message:"Details Not Saved."});
//             }
//             else{
//                 res.send({status:200,success:true,message:data.message, pateint_id:data.id});
//             }
//         }); 
//         }
//     })(req,res,next);
// }


//------------------------------
//Revised insert Appointment Api.
module.exports.insertAppointment = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user)
        {
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
        console.log("User", user);
        var admin_logid = "";
        //if(user[0].id != null)
        if(user[0].login_registerid != null || user[0].id != null)
        {
        userLogin(req.body.contact_number).then(response=>{//start
    var appointment = new Appointment(req.body, req.body.ridedetail);
    if(user[0].login_registerid != null){
        appointment.login_registerid = user[0].login_registerid;
        appointment.createdById = user[0].login_registerid;
    }
    else{
        appointment.login_registerid = response.id;
        appointment.createdById = response.id;
    }
    if(!appointment.fullname)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Fullname.' });
    }
    if(!appointment.age)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Age.' });
    }
    if(!appointment.gender)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Gender.' });
    }
    if(!appointment.contact_number)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Contact Number.' });
    }
    //appointment.appointment_date = new Date;
    appointment.statusId=1;
    
    appointment.creationDate = new Date;
    console.log("2")
    Appointment.createAppointment(appointment, req.body.ridedetail,function(err, data)
    {
        if(err)
        {
            res.send({status:400,success:false,message:"Details Not Saved."});
        }
        else{
            res.send({status:200,success:true,message:data.message, pateint_id:data.id});
        }
    });
})//end
}
}
})(req,res,next);
}

//For Admin Side Registration
function userLogin(contact_number, callback){
    return new Promise((resolve,reject)=>{
        var usercontact_number = contact_number;
        var query= `select * from login_register where contact_number = ${usercontact_number}`;
        pool.query(query,function(err, user){
            if(err)
            {
                //res.json({ status: 401, success: false, error: "Something Went Worng." });
            }
            else{
                if(user.length == 0)
                {
                        if(usercontact_number.length < 10){
                            //return res.json({ status: 401, success: false, message: "Mobile Number should be of 10 digits." });
                        }
                        else{
                            var username;
                            var login = new LoginRegister(usercontact_number);
                    login.contact_number = usercontact_number;
                            login.statusId = 1
                            login.creationDate = new Date;
                            LoginRegister.createLogin(login, function(err, data){
                                if(err){
                                    //return res.json({ status: 401, success: false, message: "Something Went Wrong." });
                                }
                                else{
                                    //to get username
                                    pool.query(`select * from login_register where login_registerid = ${data.id}`,function(err,namedata){
                                        if(err){
                                        }
                                        else{
                                            username = namedata[0].registeredusername;
                                            //res.send({status:200, success: true,message:"Login Successful",id: data.id, username: username, token:token });
                                var message = {message:"Login Successful",id: data.id};
                                callback(message);
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
                        //res.send({status:200, success: true,message:"Login Successful", id: user[0].login_registerid,  username: user[0].registeredusername,token:token });
                        var message = {message:"Login Successful",id: user[0].login_registerid};
                        resolve(message);
                    }
                    else{
                            //res.send({status:200, success: false, message:"Contact Number Mismatch"});
                        }
                }
            }
            });
    })
}

//-----------------------------------------------------------------------------



//Update Appointment
//For Admin 
module.exports.updateAppointment = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var appointment = new Appointment(req.body);                 
        if(!req.body.appointment_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Appointment Id.' });        
        }
        else if(!appointment.appointment_time)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Appointment Time.' });        
        }        
        appointment.modifiedById = user[0].id;
        appointment.modificationDate = new Date;
        Appointment.updateAppointment(req.body.appointment_id,appointment,function(err, data) 
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


//Get All Appointment Admin

module.exports.getAllAppointments = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
            Appointment.getAllAppointment(function(err,data){
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

module.exports.getAppointmentById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Appointment.getAppointmentById(req.query.appointment_id,function(err,data){
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

module.exports.getAppointmentByStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Appointment.getAppointmentByStatus(req.query.appointment_status,function(err,data){
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

module.exports.getAppointmentByContactNumber = function(req,res)
{
    Appointment.getAppointmentByCN(req.query.contact_number,function(err,data){
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

// module.exports.getAppointmentByPatientId = function(req,res)
// {
//     Appointment.getAllAppointmentByPI(req.query.patient_registerid,function(err,data){
//     if(err){
//         res.send({status:400,success:false,message:"No Detail Found"});
//     }
//     else if(data.length==0){
//         res.send({status:200,success:true,message:"No Detail Available"});
//     }
//     else{
//         res.send({status:200,success:true,message:"Detail Found", data:data});
//     }
//     });
// }


//Time Slot

module.exports.getDoctorAppointmentsByTimeSlot = function (req,res) {       
    //pool.query(`select * from appointment where patient_registerid='${p_id}'`, function (err, res) {
    pool.query(`select app.*, ts.timeslot,ts.appointment_status,cat.category_name from appointment app 
                LEFT JOIN patientappointmenttimeslot as ts ON(ts.appointment_id = app.appointment_id) 
                LEFT JOIN doctorcategory as cat ON(cat.doctorcategory_id = app.doctorcategory_id) 
                where app.statusId=1`, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length==0){
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{                       
                res.send({status:200,success:true,message:"Detail Found", data:data});
            }
        });           
};

module.exports.getDoctorAppointmentsByTimeSlotAndId = function (req,res) {       
    //pool.query(`select * from appointment where patient_registerid='${p_id}'`, function (err, res) {
    pool.query(`select app.*, ts.timeslot,ts.appointment_status, cat.category_name from appointment app 
                LEFT JOIN patientappointmenttimeslot as ts ON(ts.appointment_id = app.appointment_id) 
                LEFT JOIN doctorcategory as cat ON(cat.doctorcategory_id = app.doctorcategory_id)
                where app.statusId=1 and app.appointment_id=${req.query.appointment_id}`, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found" });
            }
            else if(data.length==0){
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{                       
                res.send({status:200,success:true,message:"Detail Found", data:data});
            }
        });           
};

//Patient is used for user.
// module.exports.getAppointmentByPatientId = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){ 
//             Appointment.getAllAppointmentByPI(user[0].login_registerid,function(err,data){
//             if(err){
//                 res.send({status:400,success:false,message:"No Detail Found"});
//             }
//             else if(data.length==0){
//                 res.send({status:200,success:true,message:"No Detail Available"});
//             }
//             else{
//                 res.send({status:200,success:true,message:"Detail Found", data:data});
//             }
//         });
//     }
// })(req,res,next);
// }

module.exports.getAppointmentByLoginId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Appointment.getAllAppointmentByPI(user[0].login_registerid,function(err,data){
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
})(req,res,next);
}


//Admin Api Dashboard

module.exports.getTodaysAppointments = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
            Appointment.getTodaysAppointment(function(err,data){
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