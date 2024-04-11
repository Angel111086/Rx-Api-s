var mysql = require('mysql');
const pool = require('../authorization/pool');

const AppointmentCases = function(app) {   
    this.appointment_id = app.appointment_id;
    this.prescription_id = app.prescription_id;
    this.ridemaster_id = app.ridemaster_id;
    this.login_registerid = app.login_registerid;
    this.medicine_status = app.medicine_status;
    this.medicine_status_description = app.medicine_status_description;
    this.case_status = app.case_status;
    this.case_status_description = app.case_status_description;
    this.statusId = app.statusId;
    this.createdById = app.createdById;  
    this.creationDate = app.creationDate;
    this.modifiedById = app.modifiedById;
    this.modificationDate = app.modificationDate;
};

AppointmentCases.getAllCases = function (result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                 app.contact_number, app.appointment_status, app.appointment_statusdescription,
                 pres.prescription_status, pres.prescription_status_description,
                 rm.ridemaster_id, rd.pickup_address, rd.drop_address,rm.ride_status, rm.ride_status_description,
                 dm.doctorname
                  from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN prescription as pres ON(appcase.prescription_id = pres.prescription_id)
                 LEFT JOIN ridemaster as rm ON(appcase.appointmentcaseId = rm.appointmentcaseId)
                 LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                 LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)                
                 where appcase.statusId=1                                 
                 GROUP By appcase.appointmentcaseId
                 Order By appcase.appointmentcaseId DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


//Get All Medicine Cases
AppointmentCases.getAllMedcineCases = function (result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                app.contact_number, rm.ridemaster_id, rd.pickup_address, dm.doctorname,
                rd.drop_address, pres.appointee_name, pres.appointeecontact_number,
                pres.appointee_address, pres.prescription_img1, pres.prescription_img2,
                pres.prescription_img3, pres.prescription_img4
                from appointmentcases appcase 
                LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                LEFT JOIN ridemaster as rm ON(appcase.appointment_id = rm.appointment_id)
                LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
                LEFT JOIN prescription as pres ON(pres.prescription_id = appcase.prescription_id)
                where appcase.statusId=1 and (appcase.medicine_status = 'Medicine Prescribed'
                || appcase.medicine_status = 'No Medicine' || appcase.medicine_status = 'Sent to Rx')
                GROUP By appcase.appointmentcaseId`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

//By Id
AppointmentCases.getAllMedcineCaseById = function (appcase_id,result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                app.contact_number, rm.ridemaster_id, rd.pickup_address, dm.doctorname,
                rd.drop_address, pres.appointee_name, pres.appointeecontact_number,
                pres.appointee_address, pres.prescription_img1, pres.prescription_img2,
                pres.prescription_img3, pres.prescription_img4
                from appointmentcases appcase 
                LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                LEFT JOIN ridemaster as rm ON(appcase.appointment_id = rm.appointment_id)
                LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
                LEFT JOIN prescription as pres ON(pres.prescription_id = appcase.prescription_id)
                where appcase.statusId=1 and appcase.appointmentcaseId = ${appcase_id} and
                (appcase.medicine_status = 'Medicine Prescribed'
                || appcase.medicine_status = 'No Medicine' || appcase.medicine_status = 'Sent to Rx')
                GROUP By appcase.appointmentcaseId`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};





AppointmentCases.getTotalCases = function (result) {       
    pool.query("select count(*) as Total from appointmentcases where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.getCaseDescription = function (result) {       
    pool.query(`select appcase.*, app.fullname as appointeeName, app.age as appointeeAge, app.gender as appointeeGender,
                 app.contact_number as appointeeContactNumber,  app.appointment_status as appointmentStatus,
                 app.appointment_statusdescription as appointmentStatusDescription, 
                 dm.doctorname as doctorName,
                 pres.appointee_name as prescriptionName, pres.appointeecontact_number as prescriptionContactNumber,
                 pres.prescription_status as prescriptionStatus,
                 pres.prescription_status_description as prescriptionStatusDescription, 
                 rm.ride_status as rideStatus, rm.ride_status_description as rideStatusDescription,
                 rd.pickup_address, rd.drop_address, DATE_FORMAT(rd.ride_date,'%d-%m-%Y') as ride_date, rd.ride_time 
                 from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN prescription as pres ON(appcase.appointment_id = pres.prescription_id)
                 LEFT JOIN ridemaster as rm ON(appcase.ridemaster_id = rm.ridemaster_id)
                 LEFT JOIN ridedetails as rd ON(appcase.ridemaster_id = rd.ridemaster_id)
                 LEFT JOIN doctormaster as dm ON(app.doctormaster_id = dm.doctormaster_id)
                 where appcase.statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};



AppointmentCases.updateAppointmentCaseStatus = function (id,appcase, result) {
    var query = `update appointmentcases SET case_status=?,
    case_status_description=?, modifiedById=?, modificationDate=? where 
    appointmentcaseId=?`;  
    var values = [appcase.case_status, appcase.case_status_description, 
                    appcase.modifiedById, appcase.modificationDate, id];
    
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

AppointmentCases.updateMedicineStatus = function (id,appcase, result) {
    var query = `update appointmentcases SET medicine_status=?, medicine_status_description=?,
    modifiedById=?, modificationDate=? where appointmentcaseId=?`;  
    var values = [appcase.medicine_status, appcase.medicine_status_description,
                  appcase.modifiedById, appcase.modificationDate, id];
    
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





AppointmentCases.getCaseById = function (appcase_id,result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                 app.contact_number, dm.doctorname, rd.pickup_address, rd.drop_address
                 from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
                 LEFT JOIN ridedetails as rd ON(appcase.ridemaster_id = rd.ridemaster_id)
                 where appcase.statusId=1 and appcase.appointmentcaseId=${appcase_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.getCaseByStatus = function (m_status,result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                 app.contact_number, dm.doctorname
                 from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN doctormaster as dm ON(app.doctormaster_id = dm.doctormaster_id)
                 where appcase.statusId=1 and appcase.medicine_status= '${m_status}'`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.getUserAllCaseById = function (userid,result) {       
    pool.query(`select appointmentcaseId, DATE_FORMAT(creationdate,'%d-%m-%Y') as creationdate, case_status from appointmentcases
                 where statusId=1 and login_registerid=${userid}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.getUserCaseDescriptionByCaseId = function (caseId, userId,result) {       
    pool.query(`select appcase.*, app.fullname as appointeeName, app.age as appointeeAge, app.gender as appointeeGender,
                 app.contact_number as appointeeContactNumber, dm.doctorname as doctorName,
                 pres.appointee_name as prescriptionName, pres.appointeecontact_number as prescriptionContactNumber,
                 rd.pickup_address, rd.drop_address, DATE_FORMAT(rd.ride_date,'%d-%m-%Y') as ride_date, 
                 rd.ride_time 
                 from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN prescription as pres ON(appcase.appointment_id = pres.prescription_id)
                 LEFT JOIN ridedetails as rd ON(appcase.ridemaster_id = rd.ridemaster_id)
                 LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)
                 where appcase.statusId=1 and appcase.appointmentcaseId=${caseId} and appcase.login_registerid=${userId}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.getCaseByStatus = function (status,result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                 app.contact_number, app.appointment_status, app.appointment_statusdescription,
                 pres.prescription_status, pres.prescription_status_description,
                 rm.ridemaster_id, rd.pickup_address, rd.drop_address,rm.ride_status, rm.ride_status_description,
                 dm.doctorname
                  from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN prescription as pres ON(appcase.prescription_id = pres.prescription_id)
                 LEFT JOIN ridemaster as rm ON(appcase.appointmentcaseId = rm.appointmentcaseId)
                 LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                 LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)                
                 where appcase.statusId=1 and appcase.case_status = '${status}' `, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

AppointmentCases.searchCases = function (name,result) {       
    pool.query(`select appcase.*, app.fullname, app.age, app.gender,
                 app.contact_number, app.appointment_status, app.appointment_statusdescription,
                 pres.prescription_status, pres.prescription_status_description,
                 rm.ridemaster_id, rd.pickup_address, rd.drop_address,rm.ride_status, rm.ride_status_description,
                 dm.doctorname
                  from appointmentcases appcase 
                 LEFT JOIN appointment as app ON(appcase.appointment_id = app.appointment_id)
                 LEFT JOIN prescription as pres ON(appcase.prescription_id = pres.prescription_id)
                 LEFT JOIN ridemaster as rm ON(appcase.appointmentcaseId = rm.appointmentcaseId)
                 LEFT JOIN ridedetails as rd ON(rm.ridemaster_id = rd.ridemaster_id)
                 LEFT JOIN doctormaster as dm ON(dm.doctormaster_id = app.doctormaster_id)                
                 where appcase.statusId=1 and (appcase.case_status = '${name}' 
                 || app.fullname LIKE '%${name}%' || app.contact_number LIKE '%${name}%')`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};



module.exports = AppointmentCases;