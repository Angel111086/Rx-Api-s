var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Prescription = function(prescription,file1,file2,file3,file4) {   
  this.appointment_id = prescription.appointment_id;
  this.login_registerid = prescription.login_registerid;
  this.appointee_name = prescription.appointee_name;
  this.appointeecontact_number = prescription.appointeecontact_number;  
  this.appointee_address = prescription.appointee_address;
  this.prescription_img1 = file1;   
  this.prescription_img2 = file2;
  this.prescription_img3 = file3;
  this.prescription_img4 = file4;  
  this.prescription_uploaddate = prescription.prescription_uploaddate;
  this.prescription_status = prescription.prescription_status;
  this.prescription_status_description = prescription.prescription_status_description;
  this.statusId = prescription.statusId;
  this.createdById = prescription.createdById;  
  this.creationDate = prescription.creationDate;
  this.modifiedById = prescription.modifiedById;
  this.modificationDate = prescription.modificationDate;
};


// Prescription.createPrescription = function (prescription, result) {   
//   pool.query("INSERT INTO prescription SET ?", prescription, function (err, res) {
//           if(err) {
//               console.log(err);
//               result(err, null);
//           }
//           else{
//               console.log(res.insertId);         
//               result(null, {status:200,success:true,message:"Details Saved Successfully."});

//           }
//       });           
// };

Prescription.createPrescription = function (prescription,  ridedetails,result) {    
    var insertpres_id;
    if(prescription.appointment_id==1)
    {
        pool.query("INSERT INTO prescription SET ?", prescription, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                  console.log(res.insertId);         
                  insertpres_id = res.insertId;
                  //result(null, {status:200,success:true,message:"Details Saved Successfully."});

                  var query = `INSERT INTO appointmentcases (appointment_id,prescription_id, ridemaster_id, login_registerid,case_status, case_status_description, statusId,createdById,creationDate) 
                               VALUES (`+prescription.appointment_id+`,`+ res.insertId+`,`+0+`, ${prescription.login_registerid},'${prescription.prescription_status}', '${prescription.prescription_status_description}', `+1+`, `+res.insertId+`, now() )`;
                               console.log('Query',query);
                                pool.query(query,function(err,appcase)
                                {
                                    if(err){
                                      console.log('Case Not Created.' + err);
                                    }
                                    else{
                                        console.log('Case Created.');
                                        console.log('Case Id', appcase.insertId);
                                        console.log('Appointment Id', prescription.appointment_id);
                                        console.log('Prescription Id', res.insertId);
                                        console.log('Ride detail', ridedetails);
                                        if(ridedetails.length == 0){

                                        }
                                        else{
                                            rideDetails(appcase.insertId, prescription.appointment_id,res.insertId, prescription.login_registerid,ridedetails, result);
                                        }
                                    }
                                });
                        }
                    });
    }
    else{
            console.log('App Id', prescription.appointment_id);
            var a = selectAppointmentCaseStatus(prescription.appointment_id, prescription.appointment_id, prescription, ridedetails, result);
            //selectAppointment(prescription.appointment_id, prescription, ridedetails)
            console.log("A",a);
            if(a==21){
                result(null, {status:200,success:true,message:"Already have prescription."});
            }
            else if(insertpres_id !==null){
                result(null, {status:200,success:true,message:"Details Saved Successfully."});
            }
                    
    }
}  
 
function selectAppointmentCaseStatus(app_id, prescription_appointment_id, prescriptionData, ridedetails, result){
    pool.query(`select appointmentcaseId,appointment_id,prescription_id,case_status from appointmentcases where appointment_id=${app_id}`, function(err, status){
        if(err){
            console.log("Casee Error",err);
        }
        else{
            console.log("Appp Status",status);
            var x = selectAppointment(prescription_appointment_id, prescriptionData, ridedetails, status[0].prescription_id, status[0].case_status, status[0].appointment_id,result)
            console.log("X", x);
            return x;
        }
    });
}

function selectAppointment(app_id, pres, ridedetails, case_pres, case_status,case_appId, result){
    console.log('App Id Select', app_id);
    console.log('App Id Case', case_appId);
    console.log("Case Data in SA", case_pres +":"+ case_status);
    console.log("Condition", case_status !== 'Appointment Complete');
    pool.query(`select * from appointment where appointment_id=${app_id}`, function(err, data){
        if(err){
            console.log("Error SA", err);
        }
        else
        {
            console.log("Else Block SA", data);
            if(case_pres == null && case_status === 'Appointment Complete')
            {
                console.log('Appointment Id: If Block',data[0].appointment_id);
                var pres_query = `insert into prescription(appointment_id, login_registerid,appointee_name,
                            appointeecontact_number,appointee_address,prescription_img1,prescription_img2,
                            prescription_img3,prescription_img4,prescription_uploaddate, prescription_status,
                            prescription_status_description, statusId, createdById, creationDate ) values
                            (${pres.appointment_id}, ${pres.login_registerid},'${pres.appointee_name}', 
                            ${pres.appointeecontact_number}, '${pres.appointee_address}', '${pres.prescription_img1}',
                            '${pres.prescription_img2}', '${pres.prescription_img3}', '${pres.prescription_img4}',
                            now(), '${pres.prescription_status}', '${pres.prescription_status_description}',
                            ${pres.statusId}, ${pres.createdById}, now())`;
                        console.log('Prescription Q', pres_query);
                pool.query(pres_query,function(err,data){
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log('Existing Pres', data);
                        updatePrescriptionInCase(pres.appointment_id, data.insertId, pres.login_registerid,ridedetails); 
                    }
                });
            }
            else if(case_status !== 'Appointment Complete' && case_pres == null)
            {
                console.log("In Else If App Com Not Equal to")
                pool.query("INSERT INTO prescription SET ?", pres, function (err, res) {
                    if(err) {
                        console.log(err);
                        result(err, null);
                    }
                    else{
                          console.log("Condition Presc",res.insertId);         
                          //result(null, {status:200,success:true,message:"Details Saved Successfully."});
        
                          var query = `INSERT INTO appointmentcases (appointment_id,prescription_id, ridemaster_id, login_registerid,case_status, case_status_description, statusId,createdById,creationDate) 
                                       VALUES (`+pres.appointment_id+`,`+ res.insertId+`,`+0+`, ${pres.login_registerid},'${pres.prescription_status}', '${pres.prescription_status_description}', `+1+`, `+res.insertId+`, now() )`;
                                       console.log('Query',query);
                                        pool.query(query,function(err,appcase)
                                        {
                                            if(err){
                                              console.log('Case Not Created.' + err);
                                            }
                                            else{
                                                console.log('Case Created.');
                                                console.log('Case Id', appcase.insertId);
                                                console.log('Appointment Id', pres.appointment_id);
                                                console.log('Prescription Id', res.insertId);
                                                console.log('Ride detail', ridedetails);
                                                if(ridedetails.length == 0){
        
                                                }
                                                else{
                                                    rideDetails(appcase.insertId, pres.appointment_id,res.insertId, pres.login_registerid,ridedetails, result);
                                                }
                                            }
                                        });
                                }
                            });
            }
            else if(case_status === 'Prescription Received' && case_pres !== null && case_appId !==null){
                console.log("In Pres Rec");
                result(null, {status:200,success:true,message:"Already have prescription."});
            }
        }
    });
}

function updatePrescriptionInCase(app_id, pres_id, login_id,rd){
    pool.query(`update appointmentcases set prescription_id=${pres_id} where appointment_id = ${app_id}`, function(err, data){
        if(err){
            console.log('Update case id error');
        }
        else{
            console.log('Update case id successful', app_id, 'and', pres_id);
            pool.query(`select appointmentcaseId, ridemaster_id from appointmentcases where appointment_id=${app_id} and
            prescription_id=${pres_id}`, function(err, data){
                if(err){
                    console.log('Error Case Select')
                }
                else{
                    console.log('Case Select', data)
                    rideDetails(data[0].appointmentcaseId, app_id,pres_id, login_id,rd);
                    // if(data[0].ridemaster_id==0){
                    //     rideDetails(data[0].appointmentcaseId, app_id,pres_id, login_id,rd);
                    // }
                    // else{
                    //     updateRideDetils(rd, data[0].ridemaster_id, pres_id);
                    // }
                    
                }
            });
        }
    });
}



function updateRideInCase(caseid, rm_id){
    var query = `update appointmentcases set ridemaster_id=${rm_id} where appointmentcaseId = ${caseid}`;
    pool.query(query, function(err, data){
        if(err){
            console.log('Ride Id not updated.' + err);
        }
        else{
            console.log('Ride Id updated.');
        }
    });
}

/*function updateRideDetils(rd, ridemaster_id, pres_id){
            var query= `update ridemaster set prescription_id=${pres_id}, ride_status='${rd.ride_status}', 
            ride_status_description='${rd.ride_status_description}' where ridemaster_id=${ridemaster_id}`;

            pool.query(query, function(err, data){
                if(err){
                    console.log('Ride Select Query Error', err);
                }
                else{
                    console.log('Ride Master Updated');
                }
            });
}*/



function rideDetails(caseid, appointmentid, prescription_id,userid,rm, result){   
    var query = `insert into ridemaster(appointmentcaseId, appointment_id, prescription_id, driver_id, login_registerid,ride_status, ride_status_description,statusId, createdById, creationDate) 
    values (`+ caseid+`,`+ appointmentid +`, `+ prescription_id +`,`+ 1 +`, ${userid},'${rm.ride_status}', '${rm.ride_status_description}', `+1+`,`+ prescription_id+`, now() )`;
    console.log('RideMaster Query', query);
    pool.query(query,function(err,data){
        if(err){
            console.log('Ride Master cannot be created.' + err)
        }
        else{
            updateRideInCase(caseid,data.insertId);
            var detailQuery = `insert into ridedetails(ridemaster_id,pickup_address,drop_address,landmark,ride_date,ride_time,statusId,createdById,creationDate) 
            values ( ${data.insertId},'${rm.pickup_address}','${rm.drop_address}', '${rm.landmark}','${rm.ride_date}','${rm.ride_time}' , ${1},${prescription_id}, now() )` ;
            console.log('RD Query', detailQuery);
            pool.query(detailQuery, function(err, detail){
                if(err){
                    console.log('Ride Detail cannot be created.' + err)
                }
                else{
                    console.log('Ride Detail Created.')
                    //result(null, {status:200,success:true,message:"Details Saved Successfully."});
                }
            });
        }
    });
}


Prescription.getAllPrescription = function (result) {   
  pool.query(`select  pres.prescription_id, pres.appointment_id, pres.login_registerid,
  pres.appointee_name, pres.appointeecontact_number, pres.appointee_address,
  pres.prescription_img1, pres.prescription_img2, pres.prescription_img3,
  pres.prescription_img4, DATE_FORMAT(pres.prescription_uploaddate, '%d-%m-%Y') as prescription_uploaddate,
  pres.prescription_status, pres.prescription_status_description,
  appcase.appointmentcaseId from prescription pres 
              LEFT JOIN appointmentcases as appcase ON(pres.prescription_id = appcase.prescription_id)
                where pres.statusId=1 Group By pres.prescription_id`,  function (err, res) {
          if(err) {
              console.log(err);
              result(err, null);
          }
          else{
              result(null, res);

          }
      });           
};

//List All Prescription for testing
Prescription.getListOfAllPrescription = function (result) {   
    pool.query(`select prescription_id,appointment_id, login_registerid,appointee_name,
    appointeecontact_number, appointee_address,prescription_img1,
    prescription_img2,prescription_img3,prescription_img4,
    DATE_FORMAT(prescription_uploaddate, '%d-%m-%Y') as prescription_uploaddate,
    prescription_status,prescription_status_description
    from prescription  where statusId=1`,  function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                result(null, res);
  
            }
        });           
  };




Prescription.getPrescriptionById = function (id,result) {   
  //var query = `select * from prescription where statusId=1 and prescription_id=${id}`;  
  var query = `select appcase.appointmentcaseId, pres.prescription_id,pres.appointment_id, pres.login_registerid,
  pres.appointee_name, pres.appointeecontact_number,  pres.appointee_address,
  pres.prescription_img1, pres.prescription_img2, pres.prescription_img3, pres.prescription_img4,
  DATE_FORMAT(pres.prescription_uploaddate, '%d-%m-%Y') as prescription_uploaddate,
  pres.prescription_status, pres.prescription_status_description,
  appcase.appointmentcaseId from prescription pres 
               LEFT JOIN appointmentcases as appcase ON(pres.prescription_id = appcase.prescription_id)
               where pres.statusId=1 and pres.prescription_id=${id}`
  pool.query(query,  function (err, res) {
          if(err) {
              console.log(err);
              result(err, null);
          }
          else{
              result(null, res);

          }
      });           
};

Prescription.updatePrescriptionStatus = function (id,prescription, result) {
  var query = `update prescription SET prescription_status=?, prescription_status_description=?,modifiedById=?, modificationDate=? where 
  prescription_id=?`;  
  var values = [prescription.prescription_status, prescription.prescription_status_description,prescription.modifiedById,prescription.modificationDate, id];
  
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


Prescription.checkImageStatus = function(pid,appid,result){
    var query = `select prescription_id, appointment_id, prescription_img1,prescription_img2,
    prescription_img3,prescription_img4 from prescription where prescription_id=${pid}
    and appointment_id=${appid}`;

    pool.query(query, function(err,data){
        if(err){
            console.log(err)
        }
        else{
            console.log("Status Api", data);
            if(data[0].prescription_img1 == '' || data[0].prescription_img2 == '' || data[0].prescription_img3 == '' || data[0].prescription_img4 == '')
            {
                console.log('No Data');
                result(null, {status:200,success:true,message:"False"});
            }
            else{
                console.log('Images');
                result(null, {status:200,success:true,message:"True"});
            }
            
        }
    });
}


Prescription.checkPrescriptionImageStatus = function(appid,result){
    var query = `select prescription_id, appointment_id, prescription_img1,prescription_img2,
    prescription_img3,prescription_img4 from prescription where appointment_id=${appid}`;

    pool.query(query, function(err,data){
        if(err){
            console.log(err)
        }
        else{
            console.log("Status Api", data);
            if(data.length ==0){
                result(null, {status:200,success:true,message:"No Data Found."});
            }
            else if(data[0].prescription_img1 == '' || data[0].prescription_img2 == '' || data[0].prescription_img3 == '' || data[0].prescription_img4 == '')
            {
                console.log('No Data');
                result(null, {status:200,success:true,message:"False"});
            }
            else{
                console.log('Images');
                result(null, {status:200,success:true,message:"True"});
            }
            
        }
    });
}


Prescription.getPrescriptionByStatus = function (status, result) {
    pool.query(
      `select appointment_id, login_registerid, appointee_name, appointeecontact_number, appointee_address,
      prescription_img1, prescription_img2, prescription_img3, prescription_img4,
      DATE_FORMAT(prescription_uploaddate, '%d-%m-%Y') as prescription_uploaddate,
      prescription_status,
      prescription_status_description from prescription where statusId = 1 and (prescription_status = '${status}'
      || prescription_status_description = '${status}' || appointee_name LIKE '%${status}%'
      || appointeecontact_number LIKE '%${status}%' )`,
      function (err, res) {
        if (err) {
          console.log(err);
          result(err, null);
        } else {
          result(null, res);
        }
      }
    );
  };


module.exports = Prescription;