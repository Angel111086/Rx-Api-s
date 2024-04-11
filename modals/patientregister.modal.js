var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Patient = function(patient) {   
  this.patientname = patient.patientname;
  this.age = patient.age;  
  this.contact_number = patient.contact_number;
  this.shipping_address = patient.shipping_address;
  this.statusId = patient.statusId;
  this.createdById = patient.createdById;  
  this.creationDate = patient.creationDate;
  this.modifiedById = patient.modifiedById;
  this.modificationDate = patient.modificationDate;
};

Patient.createPatient = function (patient, result) {       
    pool.query("INSERT INTO patient_register SET ?", patient, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});

            }
        });           
};


Patient.getAllPatient = function (result) {       
    pool.query("select * from patient_register where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Patient.getTotalPatient = function (result) {       
    pool.query("select count(*) as Total from patient_register where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Patient;