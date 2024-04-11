var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const RideDetails = function(ridedetails) {   
  this.ridemaster_id = ridedetails.ridemaster_id;
  this.pickup_address = ridedetails.pickup_address;
  this.drop_address = ridedetails.drop_address;
  this.landmark = ridedetails.landmark;
  this.ride_date = ridedetails.ride_date;
  this.ride_time = ridedetails.ride_time;
  this.statusId = ridedetails.statusId;
  this.createdById = ridedetails.createdById;
  this.creationDate = ridedetails.creationDate;
  this.modifiedById = ridedetails.modifiedById;
  this.modificationDate = ridedetails.modificationDate;
};


RideDetails.createRideDetails = function (rd, result) {  
  pool.query("INSERT INTO ridedetails SET ?", rd, function (err, res) {
      if(err) {
          console.log(err);
          result(err, null);
      }
      else{
          console.log(res.insertId);         
          result(null, {status:200,success:true,message:"Details Saved Successfully."});

      }
  });        
}

module.exports = RideDetails;