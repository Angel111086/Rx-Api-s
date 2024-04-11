var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const DoctorTimeSlot = function(timeslot) {   
  this.doctoraster_id = timeslot.doctormaster_id;
  this.appointment_id = timeslot.appointment_id;
  this.timeslot = timeslot.timeslot;
  this.slot_status = timeslot.slot_status;
  this.statusId = timeslot.statusId;
  this.createdById = timeslot.createdById;  
  this.creationDate = timeslot.creationDate;
  this.modifiedById = timeslot.modifiedById;
  this.modificationDate = timeslot.modificationDate;
};

DoctorTimeSlot.createTimeSlot = function(ts, result){
    pool.query(`insert into doctortimeslot SET ?`, ts, function(err,res){
        if(err) {
                console.log(err);
                result(err, null);
            }
            else{
            console.log(res.insertId);         
            result(null, {status:200,success:true,message:"Details Saved Successfully."});         
        }
    });         
};


DoctorTimeSlot.getTimeSlot = function(id, result){
        pool.query(`select * from doctortimeslot where doctormaster_id=${id}`, function (err, res) {
                if(err) {
                    console.log(err);
                    result(err, null);
                }
                else{                       
                    result(null, res);
    
                }
            });           
};      


module.exports = DoctorTimeSlot;