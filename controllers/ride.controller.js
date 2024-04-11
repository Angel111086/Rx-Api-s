var RideMaster = require('../modals/ridemaster.modal');
var RideDetails = require('../modals/ridedetails.modal');
const pool = require('../authorization/pool');
const passport = require('passport');


module.exports.insertRideMaster = function(req,res){
    console.log('Ride Controller', req.body);
        var rm = new RideMaster(req.body);                
        rm.statusId=1;
        //category.createdById = user[0].id;
        rm.creationDate = new Date;
        RideMaster.createRideMaster(rm,function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Details Not Saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message, pateint_id:data.id});
                insertRideDetail(data.id, rm.appointmentcaseId,req.body.ridedetails,res)
            }
        }); 
}

function insertRideDetail(rm_id, caseid,ridedetails, res){
 
    var rd = new RideDetails(ridedetails);
    rd.ridemaster_id = rm_id;
    rd.statusId = 1;
    rd.createdById = caseid;
    rd.creationDate = new Date();

    RideDetails.createRideDetails(rd, function(err, data){
        if(err){
            res.send({status:400,success:false,message:"Details Not Saved."});
        }
        else{
            res.send({status:200,success:true,message:data.message});
        }
    });

}


// module.exports.getRideDetails = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){ 
//             pool.query(`select rm.ridemaster_id,appcase.appointmentcaseId, pres.prescription_id,
//             app.appointment_id, app.fullname, app.age, 
//             app.gender, app.contact_number, app.appointment_time, app.appointment_status,
//             app.appointment_statusdescription, driver.drivername,
//             dm.doctor_address, dm.doctorname,
//             rd.pickup_address, rd.drop_address, rd.ride_date, rd.ride_time,
//             rm.ride_status, rm.ride_status_description
//             from ridedetails rd 
//             LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
//             LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
//             LEFT JOIN appointmentcases as appcase ON(rm.appointmentcaseId = appcase.appointmentcaseId)
//             LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
//             LEFT JOIN doctormaster as dm ON(dm.doctorcategory_id = app.doctorcategory_id)
//             LEFT JOIN prescription as pres ON(pres.prescription_id = appcase.prescription_id)
//             where rd.statusId=1 and rm.statusId=1 and 
//             (rm.ride_status = 'Ride Pending' || rm.ride_status = 'Driver Assigned for Home pickup' 
//             || rm.ride_status = 'Picked from Home' ||  rm.ride_status = 'Dropped at clinic'
//             || rm.ride_status = 'Driver Assigned for clinic pickup' || rm.ride_status = 'Picked from Clinic' 
//             || rm.ride_status = 'Dropped at Home' || rm.ride_status = 'Appointment Cancelled' 
//             || rm.ride_status = 'Appointment Rescheduled' || rm.ride_status = 'Ride Cancelled' 
//             || rm.ride_status = 'Ride Rescheduled' || rm.ride_status = 'Appointment & Ride Cancelled'
//             || rm.ride_status = 'Appointment & Ride Rescheduled' || rm.ride_status = 'Ride Breached' 
//             || rm.ride_status = 'Ride Not Taken')
//             group by rm.ridemaster_id`,function(err,data){
//                 if(err){
//                     res.send({status:400,success:false,message:"No Detail Found" + err});
//                 }
//                 else if(data.length==0){
//                     res.send({status:200,success:true,message:"No Detail Available"});
//                 }
//                 else{
//                     res.send({status:200,success:true,message:
//                     "Detail Found", data:data});
//                 }
//             });
//        }
//   })(req,res,next)
// }


module.exports.getRideDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            pool.query(`select rm.ridemaster_id,appcase.appointmentcaseId, pres.prescription_id,
            app.appointment_id, app.fullname, app.age, 
            app.gender, app.contact_number, app.appointment_time, app.appointment_status,
            app.appointment_statusdescription, driver.drivername,
            dm.doctor_address, dm.doctorname, rd.ridedetails_id,
            rd.pickup_address, rd.drop_address, rd.ride_date, rd.ride_time,
            rm.ride_status, rm.ride_status_description
            from ridedetails rd 
            LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
            LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
            LEFT JOIN appointmentcases as appcase ON(rm.appointmentcaseId = appcase.appointmentcaseId)
            LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
            LEFT JOIN doctormaster as dm ON(dm.doctorcategory_id = app.doctorcategory_id)
            LEFT JOIN prescription as pres ON(pres.prescription_id = appcase.prescription_id)
            where rd.statusId=1 and rm.statusId=1 and          
            (rm.ride_status='Ride Pending' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Driver Assigned for Home pickup' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Picked from Home' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Dropped at Clinic' and app.appointment_status='Appointment Confirmed')
            || (rm.ride_status='Driver Assigned for Clinic pickup' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received')
            || (rm.ride_status='Picked from Clinic' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received')
            || (rm.ride_status='Dropped at Home' and app.appointment_status='Appointment Confirmed' and pres.prescription_status='Prescription received') 
            group by rm.ridemaster_id`,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found" + err});
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



//User Panel
module.exports.getRideDetailById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var id = req.query.ridedetails_id;
            var query = `select rm.ridemaster_id,appcase.appointmentcaseId, 
            app.appointment_id, app.fullname, app.age, 
            app.gender, app.contact_number, app.appointment_time, app.appointment_status,
            app.appointment_statusdescription, driver.drivername, dm.doctorname,
            rd.pickup_address, rd.drop_address, rd.ride_date, rd.ride_time from ridedetails rd 
            LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
            LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
            LEFT JOIN appointmentcases as appcase ON(rm.appointmentcaseId = appcase.appointmentcaseId)
            LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
            LEFT JOIN doctormaster as dm ON(dm.doctorcategory_id = app.doctorcategory_id)         
            where rd.statusId=1 and rm.statusId=1 and rd.ridedetails_id=${id} and 
            app.appointment_status='Driver Assigned'`;

            console.log('Id Query', query);
            pool.query(query,function(err,data){
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


module.exports.getRideDetailByIdAdmin = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var id = req.query.ridedetails_id;
            var query = `select rm.ridemaster_id,appcase.appointmentcaseId, 
            app.appointment_id, app.fullname, app.age, 
            app.gender, app.contact_number, dm.doctorname, dm.doctor_address,
            app.appointment_time, app.appointment_status,
            app.appointment_statusdescription, driver.drivername,
            rm.ride_status, rm.ride_status_description,
            rd.pickup_address, rd.drop_address, rd.ride_date, rd.ridedetails_id,
            rd.ride_time from ridedetails rd 
            LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
            LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
            LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
            LEFT JOIN appointmentcases as appcase ON(rm.appointmentcaseId = appcase.appointmentcaseId)
            LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)            
            where rd.statusId=1 and rm.statusId=1 and rd.ridedetails_id=${id}`;
            console.log('Id Query', query);
            pool.query(query,function(err,data){
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


module.exports.updateStatusDetails = function(req, res, next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            pool.query(`update appointment set appointment_status='${req.body.appointment_status}',
            appointment_statusdescription='${req.body.appointment_statusdescription}' where 
            appointment_id=${req.body.appointment_id}`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"Details Not Updated." + err});
                }
                else{
                    res.send({status:200,success:true,message:"Details Updated Successfully."});
                }
            });
        }   
    })(req, res, next)
}

module.exports.updateDriverDetailsInRideMaster = function(req, res, next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            pool.query(`update ridemaster set driver_id=${req.body.driver_id}
            where ridemaster_id=${req.body.ridemaster_id}`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"Details Not Updated." + err});
                }
                else{
                    res.send({status:200,success:true,message:"Details Updated Successfully."});
                }
            });
        }   
    })(req, res, next)
}

module.exports.updateRideStatus = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var rm = new RideMaster(req.body); 
        rm.modifiedById = user[0].id;
        rm.modificationDate = new Date;
        RideMaster.updateRideStatus(req.body.ridemaster_id,rm,function(err, data) 
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


//Admin Api
module.exports.getRideByRideFilter = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
        RideMaster.getRideMasterByRideStatus(req.query.ride_status,function(err,data){
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

//Search Api Admin 
module.exports.searchRideMaster = function (req, res, next) 
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {  
            var name = req.query.name;    
            var search_query;
            if(name)
            {      
                search_query = `select rm.ridemaster_id,appcase.appointmentcaseId, pres.prescription_id,
                app.appointment_id, app.fullname, app.age, 
                app.gender, app.contact_number, app.appointment_time, app.appointment_status,
                app.appointment_statusdescription, driver.drivername,
                dm.doctor_address, dm.doctorname,
                rd.pickup_address, rd.drop_address, rd.ride_date, rd.ride_time,
                rm.ride_status, rm.ride_status_description
                from ridedetails rd 
                LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = rd.ridemaster_id)
                LEFT JOIN appointment as app ON(rm.appointment_id = app.appointment_id)
                LEFT JOIN appointmentcases as appcase ON(rm.appointmentcaseId = appcase.appointmentcaseId)
                LEFT JOIN driverdetails as driver ON(rm.driver_id = driver.driverdetails_id)
                LEFT JOIN doctormaster as dm ON(dm.doctorcategory_id = app.doctorcategory_id)
                LEFT JOIN prescription as pres ON(pres.prescription_id = appcase.prescription_id)
                where rd.statusId=1 and rm.statusId=1 and  
                (app.fullname LIKE '%${name}%' || app.contact_number LIKE '%${name}%' ||
                rm.ride_status LIKE '%${name}%' || rm.ride_status_description LIKE '%${name}%')        
                `

            }
            console.log('Query', search_query);
            pool.query(search_query, function(err,data){
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
    })(req,res,next);
}


