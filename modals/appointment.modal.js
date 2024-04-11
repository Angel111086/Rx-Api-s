var mysql = require("mysql");
const pool = require("../authorization/pool");

// constructor
const Appointment = function (appointment) {
  this.login_registerid = appointment.login_registerid;
  this.doctorcategory_id = appointment.doctorcategory_id;
  this.doctormaster_id = appointment.doctormaster_id;
  this.fullname = appointment.fullname;
  this.age = appointment.age;
  this.gender = appointment.gender;
  this.contact_number = appointment.contact_number;
  //this.doctor_name = appointment.doctor_name;
  this.appointment_time = appointment.appointment_time;
  this.appointment_date = appointment.appointment_date;
  this.appointment_status = appointment.appointment_status;
  this.appointment_statusdescription = appointment.appointment_statusdescription;
  this.statusId = appointment.statusId;
  this.createdById = appointment.createdById;
  this.creationDate = appointment.creationDate;
  this.modifiedById = appointment.modifiedById;
  this.modificationDate = appointment.modificationDate;
};


// Appointment.createAppointment = function (appointment, ridedetail, result) {
//     // pool.query(`select contact_number from appointment where contact_number = '${appointment.contact_number}'`,function(err,res){
//     //     if(err){
//     //         console.log("Select If",err);
//     //     }
//     //     else{
//     //         try{
//     //             if(res.length != 0){
//     //                 result(err,{status:400,success:false,message:"Mobile Number is already saved."}) ;
//     //             }
//     //             else{

//                     pool.query("INSERT INTO appointment SET ?", appointment, function (err, res) {
//                     if(err) {
//                         console.log(err);
//                         result(err, null);
//                     }
//                     else{
//                         console.log(res.insertId);
//                         result(null, {status:200,success:true,message:"Details Saved Successfully."});

//                         if(res.insertId !== null){
//                         var query = `INSERT INTO appointmentcases (appointment_id, ridemaster_id,statusId,createdById,creationDate)
//                                 VALUES (`+ res.insertId+`,`+0+`, `+1+`, `+res.insertId+`, now() )`;
//                         console.log('Query',query);
//                         pool.query(query,function(err,appcase){
//                         if(err){
//                             console.log('Case Not Created.' + err);
//                         }
//                         else{
//                             console.log('Case Created.');
//                             console.log('Case Id', appcase.insertId);
//                             console.log('Appointment Id', res.insertId);
//                             console.log('Ride detail', ridedetail);
//                             rideDetails(appcase.insertId, res.insertId, ridedetail);
//                         }
//                     });
//                 }

//             }
//         });
// }
// }catch(e){console.log(e)}
//         }
//     });
//}

Appointment.createAppointment = function (appointment, ridedetail, result) {
  pool.query("INSERT INTO appointment SET ?", appointment, function (err, res) {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, { status: 200, success: true,message: "Details Saved Successfully.",
      });

      if (res.insertId !== null) {
        var query =
          `INSERT INTO appointmentcases (appointment_id, ridemaster_id, login_registerid, case_status, case_status_description,statusId,createdById,creationDate) 
                        VALUES (${res.insertId}, ${0}, ${appointment.login_registerid},'${appointment.appointment_status}', '${appointment.appointment_statusdescription}', ` +
          1 + `, ` + res.insertId + `, now() )`;
        console.log("Query", query);
        pool.query(query, function (err, appcase) {
          if (err) {
            console.log("Case Not Created." + err);
          } else {
            console.log("Case Created.");
            console.log("Case Id", appcase.insertId);
            console.log("Appointment Id", res.insertId);
            console.log("Ride detail", ridedetail);
            insertPatientTimeSlot(res.insertId, appointment.appointment_time);
            if (ridedetail.length == 0) {

            } else {
              rideDetails(
                appcase.insertId,
                res.insertId,
                appointment.login_registerid,
                ridedetail
              );
            }
          }
        });
      }
    }
  });
};

function updateRideInCase(caseid, rm_id) {
  var query = `update appointmentcases set ridemaster_id=${rm_id} where appointmentcaseId = ${caseid}`;
  pool.query(query, function (err, data) {
    if (err) {
      console.log("Ride Id not updated." + err);
    } else {
      console.log("Ride Id updated.");
    }
  });
}

function rideDetails(caseid, appointmentid, userid, rm) {
  var query =
    `insert into ridemaster(appointmentcaseId, appointment_id, driver_id, login_registerid,ride_status, ride_status_description, statusId, createdById, creationDate) 
    values (` +
    caseid +
    `,` +
    appointmentid +
    `, ` +
    1 +
    `,${userid},'${rm.ride_status}', '${rm.ride_status_description}', ` +
    1 +
    `,` +
    appointmentid +
    `, now() )`;
  console.log("RideMaster Query", query);
  pool.query(query, function (err, data) {
    if (err) {
      console.log("Ride Master cannot be created." + err);
    } else {
      updateRideInCase(caseid, data.insertId);
      var detailQuery = `insert into ridedetails(ridemaster_id,pickup_address,drop_address,landmark,ride_date,ride_time,statusId,createdById,creationDate) 
            values ( ${data.insertId},'${rm.pickup_address}', '${rm.drop_address}','${rm.landmark}', '${rm.ride_date}','${rm.ride_time}' , ${1},${appointmentid}, now() )`;
      console.log("RD Query", detailQuery);
      pool.query(detailQuery, function (err, detail) {
        if (err) {
          console.log("Ride Detail cannot be created." + err);
        } else {
          console.log("Ride Detail Created.");
        }
      });
    }
  });
}

function insertPatientTimeSlot(app_id, ts) {
  var qu = `insert into patientappointmenttimeslot
    (timeslot,appointment_id,appointment_status,statusId,createdById,creationDate) 
    values ( '${ts}',${app_id}, 'Open',${1}, ${app_id}, now())`;
  pool.query(qu, function (err, data) {
    if (err) {
      console.log("Select If", err);
    } else {
      console.log("Data Inserted");
    }
  });
}

Appointment.updateAppointment = function (id, appointment, result) {
  var query = `update appointment SET doctorcategory_id=?, doctormaster_id=?, appointment_time=?,appointment_date=?,appointment_status=?,
    appointment_statusdescription=?, modifiedById=?, modificationDate=? where appointment_id=?`;
  var values = [
    appointment.doctorcategory_id,
    appointment.doctormaster_id,
    appointment.appointment_time,
    appointment.appointment_date,
    appointment.appointment_status,
    appointment.appointment_statusdescription,
    appointment.modifiedById,
    appointment.modificationDate,
    id,
  ];

  pool.query(query, values, function (err, res) {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      console.log("Detail Query", query);
      result(null, {
        status: 200,
        success: true,
        message: "Details Updated Successfully.",
      });
    }
  });
};

Appointment.getAllAppointment = function (result) {
  pool.query(
    `select app.login_registerid,
    app.appointment_id,
    app.doctorcategory_id, 
    app.doctormaster_id,
    app.fullname,
    app.age,
    app.gender,
    app.contact_number,
    app.appointment_time,
    DATE_FORMAT(app.appointment_date, '%d-%m-%Y') as appointment_date,
    app.appointment_status,
    app.appointment_statusdescription, dc.category_name,dm.doctorname, dm.doctor_address
    ,appcase.appointmentcaseId, rm.ridemaster_id,
    rd.pickup_address, rd.drop_address,rd.landmark from appointment app
                LEFT JOIN appointmentcases as appcase ON(app.appointment_id = appcase.appointment_id)
                LEFT JOIN doctorcategory as dc ON(dc.doctorcategory_id = app.doctorcategory_id )
                LEFT JOIN doctormaster as dm ON(app.doctormaster_id = dm.doctormaster_id) 
                LEFT JOIN ridemaster as rm ON(rm.appointment_id = app.appointment_id)
                LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id) 
                Group By app.appointment_id order by app.appointment_id DESC`,
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

Appointment.getAppointmentById = function (id, result) {
  pool.query(
    `select appcase.appointmentcaseId, app.appointment_id,app.login_registerid, 
    app.doctorcategory_id,  app.doctormaster_id, app.fullname,
    app.age, app.gender, app.contact_number, app.appointment_time,
    DATE_FORMAT(app.appointment_date, '%d-%m-%Y') as appointment_date,
    app.appointment_status,app.appointment_statusdescription,
    rm.ridemaster_id,
    rd.pickup_address, rd.drop_address, rd.landmark, dm.doctorname
    from appointment app
    LEFT JOIN appointmentcases as appcase ON(app.appointment_id = appcase.appointment_id)
    LEFT JOIN ridemaster as rm ON(rm.appointment_id = app.appointment_id)
    LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)   
    LEFT JOIN doctormaster as dm ON(app.doctormaster_id = dm.doctormaster_id)  
    where app.appointment_id=${id} and app.statusId=1
    GROUP By app.appointment_id`,
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

Appointment.getAppointmentByStatus = function (status, result) {
  
  var query = `select login_registerid, doctorcategory_id, doctormaster_id,fullname,
  age, gender, contact_number,
  appointment_time,
  DATE_FORMAT(appointment_date, '%d-%m-%Y') as appointment_date,
  appointment_status,
  appointment_statusdescription from appointment where 
  (appointment_status= '${status}' || fullname LIKE'%${status}%' || contact_number LIKE '%${status}%' || 
  appointment_statusdescription ='${status}')`;
  
  console.log('Query', query);
  pool.query(query,function (err, res) {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

Appointment.getAppointmentByCN = function (cn, result) {
  pool.query(
    `select login_registerid,
    doctorcategory_id, 
    doctormaster_id,
    fullname,
    age,
    gender,
    contact_number,
    appointment_time,
    DATE_FORMAT(appointment_date, '%d-%m-%Y') as appointment_date,
    appointment_status,
    appointment_statusdescription from appointment where contact_number='${cn}'`,
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

Appointment.getAllAppointmentByPI = function (p_id, result) {
  //pool.query(`select * from appointment where patient_registerid='${p_id}'`, function (err, res) {
  pool.query(
    `select appcase.appointmentcaseId,appcase.case_status, appcase.case_status_description,
    app.appointment_id,
    app.login_registerid,
    app.doctorcategory_id, 
    app.doctormaster_id,
    app.fullname,
    app.age,
    app.gender,
    app.contact_number,
    app.appointment_time,
    DATE_FORMAT(app.appointment_date, '%d-%m-%Y') as appointment_date,
    app.appointment_status,
    app.appointment_statusdescription,
                    cat.category_name, dm.doctorname, dm.fees,
                    rd.pickup_address, rd.drop_address, DATE_FORMAT(rd.ride_date,'%d-%m-%Y') as ride_date, rd.ride_time, rm.ridemaster_id,
                    rm.ride_status, rm.ride_status_description, dm.doctor_address from appointment app 
                    LEFT JOIN doctorcategory as cat ON(cat.doctorcategory_id = app.doctorcategory_id) 
                    LEFT JOIN doctormaster as dm ON(dm.doctorcategory_id = cat.doctorcategory_id) 
                    LEFT JOIN appointmentcases as appcase ON(appcase.appointment_id = app.appointment_id)
                    LEFT JOIN ridemaster as rm ON(rm.ridemaster_id = appcase.ridemaster_id)
                    LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                    where app.statusId=1 and app.login_registerid='${p_id}'
                    Order By app.appointment_id DESC`,
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

Appointment.getTodaysAppointment = function (result) {
  pool.query(
    `select 
    appcase.appointment_id,
    app.appointment_id,
    app.login_registerid,
    app.doctorcategory_id, 
    app.doctormaster_id,
    app.fullname,
    app.age,
    app.gender,
    app.contact_number,
    app.appointment_time,
    DATE_FORMAT(app.appointment_date, '%d-%m-%Y') as appointment_date,
    app.appointment_status,
    app.appointment_statusdescription, dm.doctorname, dm.doctor_address, appcase.appointmentcaseId from appointment app
                LEFT JOIN appointmentcases as appcase ON(app.appointment_id = appcase.appointment_id) 
                LEFT JOIN doctormaster as dm ON(app.doctormaster_id = dm.doctormaster_id) 
                where DATE(app.appointment_date) = CURDATE()
                order by app.appointment_id DESC`,
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


// Function to convert date

function tranformDate(strDate) {

  console.log('raw date: ' + strDate);
 
  let result = '';

  if (strDate) {
    let parts = strDate.split('-');
    result = `${parts[1]}-${parts[2]}-${parts[0]}`;
  }
  return result;
}



module.exports = Appointment;


/*
INSERT INTO `appointment` (`appointment_id`, `login_registerid`, `doctorcategory_id`, `doctormaster_id`, `fullname`, `age`, `gender`, `contact_number`, `appointment_time`, `appointment_date`, `appointment_status`, `appointment_statusdescription`, `statusId`, `createdById`, `creationDate`, `modifiedById`, `modificationDate`) VALUES (NULL, '1', '1', '1', 'No Appointment', '34', 'Male', '9988776655', NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL);
*/