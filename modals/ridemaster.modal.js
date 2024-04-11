var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const RideMaster = function(ridemaster) {   
  this.appointmentcaseId = ridemaster.appointmentcaseId;
  this.appointment_id = ridemaster.appointment_id;
  this.driver_id = ridemaster.driver_id;  
  this.login_registerid = ridemaster.login_registerid;  
  this.ride_status = ridemaster.ride_status;  
  this.ride_status_description = ridemaster.ride_status_description;  
  this.statusId = ridemaster.statusId;
  this.createdById = ridemaster.createdById;
  this.creationDate = ridemaster.creationDate;
  this.modifiedById = ridemaster.modifiedById;
  this.modificationDate = ridemaster.modificationDate;
};

RideMaster.createRideMaster = function (rm, result) {  
    pool.query("INSERT INTO ridemaster SET ?", rm, function (err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        }
        else{
            console.log(res.insertId);         
            result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});
        }
    });        
}

RideMaster.updateRideMaster = function (id,rm,result) {       
    pool.query(`update ridemaster SET pickup_address=?, drop_address,ride_date,ride_time,
    modifiedById=?, modificationDate=? where ridemaster_id=?`, 
    [rm.pickup_address, rm.drop_address, rm.ride_date, rm.ride_time, rm.modifiedById, rm.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};




RideMaster.getAllRides = function (result) {       
    pool.query("select * from ridemaster where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

RideMaster.getRideMasterById = function (id,result) {       
    pool.query(`select * from ridemaster where ridemaster_id=${id} and statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

RideMaster.updateRideStatus = function (id,rm, result) {
    var query = `update ridemaster SET ride_status=?, ride_status_description=?,modifiedById=?, modificationDate=? where 
    ridemaster_id=?`;  
    var values = [rm.ride_status, rm.ride_status_description,rm.modifiedById,rm.modificationDate, id];
    
        pool.query(query,values, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log('Detail Query', query);        
                result(null, {status:200,success:true,message:"Details Updated Successfully."});
            }
        });          
  };



RideMaster.getRideMasterByRideStatus = function (name,result) {       
    pool.query(`select * from ridemaster where ride_status='${name}' and statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


module.exports = RideMaster;