var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Driver = function(driver) {   
  this.drivername = driver.drivername;   
  this.drivercontact_number = driver.drivercontact_number;
  this.driverpin = driver.driverpin;
  this.vehicle_number = driver.vehicle_number;
  this.vehicle_make = driver.vehicle_make;
  this.driver_status = driver.driver_status;
  this.statusId = driver.statusId;
  this.createdById = driver.createdById;
  this.creationDate = driver.creationDate;
  this.modifiedById = driver.modifiedById;
  this.modificationDate = driver.modificationDate;
};

Driver.createDriver = function (driver, result) {  
    pool.query(`select drivercontact_number from driverdetails where drivercontact_number = '${driver.drivercontact_number}'`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{               
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Mobile Number is already exists."}) ;
                }
                else{
                    pool.query("INSERT INTO driverdetails SET ?", driver, function (err, res) {
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
            }catch(e){console.log(e)}
        }
    });  
           
};

Driver.updateDriver = function (id, driver, result) {
  var query = `update driverdetails SET drivercontact_number=?, vehicle_number=?,vehicle_make=?,
  driver_status=?, modifiedById=?, modificationDate=? where driverdetails_id=?`;  
  var values = [driver.drivercontact_number, driver.vehicle_number,
    driver.vehicle_make,driver.driver_status,driver.modifiedById,driver.modificationDate, id];
  
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

Driver.getAllDrivers = function (result) {       
  pool.query(`select * from driverdetails where statusId = 1 order by driverdetails_id DESC`, function (err, res) {
          if(err) {
              console.log(err);
              result(err, null);
          }
          else{                       
              result(null, res);

          }
      });           
};

Driver.getDriverById = function (id,result) {       
  pool.query(`select * from driverdetails where driverdetails_id=${id}`, function (err, res) {
          if(err) {
              console.log(err);
              result(err, null);
          }
          else{                       
              result(null, res);

          }
      });           
};

Driver.getDriverByStatus = function (status,result) {       
  pool.query(`select * from driverdetails where driver_status='${status}'`, function (err, res) {
          if(err) {
              console.log(err);
              result(err, null);
          }
          else{                       
              result(null, res);

          }
      });           
};


module.exports = Driver;