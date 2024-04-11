const DoctorMaster = require('../modals/doctormaster.modal')
const DoctorTimeSlot = require('../modals/doctortimeslot.modal')
const pool = require('../authorization/pool')
const passport = require('passport');
var jimp = require("jimp");


module.exports.insertDoctorMaster = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
            try{
                if(!req.file){
                    res.status(400).send({ success:false, message: 'Please Provide Profile Image.' });        
                }
                else{ 
                    var fn = './public/doctorprofile/' + req.file.filename;                  
                     jimp.read(fn, function (err, img) {
                     if (err) 
                        throw err;
                        img.resize(250, 250)            // resize
                        .quality(100)              // set JPEG quality       
                        .write('./public/doctorprofile/' + fn) // save
                        console.log('Resized !!')              
                });  
                var master = new DoctorMaster(req.body, fn);                
                if(!master.doctorcategory_id)
                {
                    return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
                }       
                if(!master.doctorname)
                {
                    return res.status(400).send({ error:true, message: 'Please Provide Doctor Name.' });        
                }
                if(!master.doctor_address)
                {
                    return res.status(400).send({ error:true, message: 'Please Provide Doctor Address.' });        
                }
                master.statusId=1;
                master.createdById = user[0].id;
                master.creationDate = new Date;
                DoctorMaster.createDoctorMaster(master, function(err, data) 
                {
                    if(err)
                    {
                        res.send({status:400,success:false,message:'Details Not Inserted.'});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});                       
                            insertTimeSlot(data.id);
                    }
                }); 
            }
    }catch(e){console.log('Exception', e)}
    }
})(req,res,next);
}

function insertTimeSlot(doctormaster_id){
    pool.query(`select * from doctormaster where doctormaster_id=${doctormaster_id}`, function(err, data){
        if(err){
            console.log('Select ', err);
        }
        else{
            console.log('Doctor Master Data', data);
            console.log("From Time", data[0].fromtime);
            console.log("To Time", data[0].totime);

            //Code to be tested.
            // var dt = data[0].totime;
            // var hours = dt.getHours()
            // minute = dt.getMinutes();
            // hours = (hours % 12) || 12;
            // console.log("End Time is - " + hours + ":" + minute);

            
            var et = subtractMinutes(data[0].totime,"30");
            console.log('ET', et);
            var ts = timeSlot(data[0].fromtime,et);

            for(var i=0;i<ts.length;i++){
                console.log('TS I',i + ':' +ts[i]);
                // var query = `INSERT INTO doctortimeslot (doctormaster_id, timeslot,statusId,createdById,creationDate) 
                // VALUES ( ${doctormaster_id} ,'${ts[i]}', ${1}, ${doctormaster_id}, now() )`;                
                pool.query(`INSERT INTO doctortimeslot (doctormaster_id, timeslot,statusId,createdById,creationDate) 
                VALUES ( ${doctormaster_id} ,'${ts[i]}', ${1}, ${doctormaster_id}, now() )`, function(err, data){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Time Slot Data Inserted.')
                }
            });
        }
            
        }
    });
}


  


module.exports.updateDoctorMaster = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            try{
                if(!req.file)
                {
                    var master = new DoctorMaster(req.body);                
                    master.statusId=1;
                    master.modifiedById = user[0].id;
                    master.modificationDate = new Date;
                    DoctorMaster.updateDoctorMaster(req.body.doctormaster_id,master, function(err, data) 
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
                else{
                    var fn = './public/doctorprofile/' + req.file.filename;  
                    //let newfileName = req.file.filename + ".png"
                    jimp.read(fn, function (err, img) {
                    if (err) 
                        throw err;
                        img.resize(250, 250)            // resize
                        .quality(100)              // set JPEG quality       
                        .write('./public/doctorprofile/' + fn) // save
                        console.log('Resized !!')              
                    });  
                    var master = new DoctorMaster(req.body, fn);                
                    master.statusId=1;
                    master.modifiedById = user[0].id;
                    master.modificationDate = new Date;
                    DoctorMaster.updateDoctorMaster(req.body.doctormaster_id,master, function(err, data) 
                    {
                        if(err)
                        {
                            res.send({status:400,success:false,message:'Details not Updated.'});
                        }
                        else{
                            res.send({status:200,success:true,message:data.message});
                        }
                    });
                }
            }catch(e){console.log('Exception', e)} 
    }
})(req,res,next);
}

module.exports.updateTimeSlot = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            try{
                var qu = `update doctortimeslot set statusId=${req.query.statusId} where 
                doctormaster_id=${req.query.doctormaster_id} and timeslot = '${req.query.timeSlot}'`
                console.log('Query', qu);
                pool.query(qu,function(err, result)
                {
                    if(err)
                    {
                        res.send({status:400,success:false,message:'Details not Updated.' + err});
                    }
                    else
                    {
                        res.send({status:200,success:true,message:'Details Updated Successfully.'});
                    }
                });
            }catch(e){console.log(e)}
    }
})(req,res,next);
}



module.exports.disableDoctorMaster = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){          
        DoctorMaster.disableMaster(req.body.doctormaster_id,req.body.statusId, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Category Not Disabled."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
    }
})(req,res,next);
}


module.exports.getAllDoctorMasters = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            DoctorMaster.getAllDM(function(err,data){
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
//        }
//   })(req,res,next)
}

module.exports.getDoctorMasterById = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            DoctorMaster.getDMById(req.query.doctormaster_id,function(err,data){
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
//        }
//   })(req,res,next)
}

//User
module.exports.getDoctorMasterByCategoryName = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            DoctorMaster.getDMByCN(req.query.category_name,function(err,data){
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

//User 
module.exports.getDoctorMasterBySlot = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var doctormaster_id = req.query.doctormaster_id;
            DoctorMaster.getDMBySlot(req.query.doctorcategory_id,doctormaster_id,function(err,data){
            if(err){
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length==0){
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
             var completeData = [];
             var jsonData = {};
            

            // completeData.push({
            //     "doctordetails":data,
            //     "timeslots": ts
            // });
            // jsonData = completeData;

            pool.query(`select timeslot from doctortimeslot where doctormaster_id = ${doctormaster_id} and statusId=1`, function(err, ts){
                if(err){

                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    
                    
                     completeData.push({
                        "doctordetails":data,
                        "timeslots": ts
                    });
                    jsonData = completeData;
                    res.send({status:200,success:true,message:"Detail Found", data:jsonData});
                }
            });
        }
    });
}
    })(req,res,next)
}


function subtractMinutes(time, minutes) {
    var date = new Date(new Date('01/01/2022 ' + time).getTime() - minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
      ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
      ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
  }



function addMinutes(time, minutes) {
    var date = new Date(new Date('01/01/2022 ' + time).getTime() + minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
      ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
      ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
  }
  
  function timeSlot(st,et){
    var starttime = st;
    var interval = "30";
    
    var endtime = et;
    var timeslots = [starttime];
  
    while (starttime != endtime) {
      
        starttime = addMinutes(starttime, interval);
        timeslots.push(starttime);
    }
    console.log('In TimeSlot', timeslots);
   
    var updated_time = [];

    // Convert time into AM/PM
    for(var i=0; i<timeslots.length; i++)
    {
        console.log('Single Time', timeslots[i])
        var single_time = timeslots[i];
        var hourEnd = timeslots[i].indexOf(":");
        var H = +timeslots[i].substr(0, hourEnd);
        var h = H % 12 || 12;
        var ampm = (H < 12 || H === 24) ? " AM" : " PM";
        single_time = h + timeslots[i].substr(hourEnd, 3) + ampm;       
        updated_time.push(single_time)
    }
    console.log('Updated Time', updated_time)
    return updated_time;
}


//User Token
module.exports.searchDoctor = function (req, res, next) { 
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var name = req.query.name;    
            var search_query;
            if(name)
            {
                search_query = `SELECT dm.*, category.category_name, category.category_image from 
                doctormaster dm LEFT JOIN doctorcategory as category ON (category.doctorcategory_id = dm.doctorcategory_id) 
                where dm.doctorname LIKE '%${name}%' || category.category_name LIKE '%${name}%' and dm.statusId=1
                Order By dm.doctorname DESC`
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
})(req,res, next)
}

//User Token
module.exports.getDoctorMasterByCategoryId = function(req,res, next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            DoctorMaster.getDMByCID(req.query.doctorcategory_id,function(err,data){
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

//User Token
module.exports.countTimeSlotAvailable = function (req, res, next) 
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
         search_query = `SELECT count(*) as Total from doctortimeslot where statusId=1`
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
             response = {status: 200, success : true, message : "Data Found", data: data};
         }
         res.json(response);
     });
    }
})(req,res,next)
}

//User Token
module.exports.searchDoctorMaster = function (req, res,next) 
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){   
            var name = req.query.name;    
            var search_query;
            if(name)
            {
                search_query = `SELECT dm.*, category.category_name from 
                doctormaster dm LEFT JOIN doctorcategory as category ON (category.doctorcategory_id = dm.doctorcategory_id) 
                where dm.statusId=1 and (dm.doctorname LIKE '%${name}%' || category.category_name LIKE '%${name}%') 
                Order By dm.doctorname DESC`
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
})(req, res, next)
}

module.exports.getDoctorTimeSlot = function(req,res, next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            DoctorTimeSlot.getTimeSlot(req.query.doctormaster_id,function(err,data){
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