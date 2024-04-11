var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const DoctorMaster = function(dm, file) {   
  this.doctorcategory_id = dm.doctorcategory_id;
  this.doctorname = dm.doctorname;
  this.doctor_profileimage = file;
  this.doctor_address = dm.doctor_address;
  this.doctordegree = dm.doctordegree;
  this.doctorexperience = dm.doctorexperience;
  this.doctorcontact_number = dm.doctorcontact_number;
  this.fees = dm.fees;
  this.fromtime = dm.fromtime;
  this.totime = dm.totime;
  this.statusId = dm.statusId;
  this.createdById = dm.createdById;  
  this.creationDate = dm.creationDate;
  this.modifiedById = dm.modifiedById;
  this.modificationDate = dm.modificationDate;
};

DoctorMaster.createDoctorMaster = function (dm, result) {       
    pool.query("INSERT INTO doctormaster SET ?", dm, function (err, res) {
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

DoctorMaster.updateDoctorMaster = function (id,dm, result) {
    var query,values;
    pool.query(`select * from doctormaster where doctormaster_id=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(dm.doctor_profileimage !== undefined)
                {
                    var query = `update doctormaster SET doctor_profileimage=?,doctor_address=?, doctordegree=?,doctorexperience=?,
                    doctorcontact_number=?, fees=?, fromtime=?,totime=?,modifiedById=?, modificationDate=? where doctormaster_id=?`;  
                    var values = [dm.doctor_address,dm.doctor_profileimage,dm.doctordegree,dm.doctorexperience, dm.doctorcontact_number,dm.fees,
                    dm.fromtime, dm.totime,dm.modifiedById,dm.modificationDate, id];
                }
                else{

                    var query = `update doctormaster SET doctor_address=?, doctordegree=?,doctorexperience=?,
                    doctorcontact_number=?, fees=?, fromtime=?,totime=?,modifiedById=?, modificationDate=? where doctormaster_id=?`;  
                    var values = [dm.doctor_address,dm.doctordegree,dm.doctorexperience, dm.doctorcontact_number,dm.fees,
                    dm.fromtime, dm.totime,dm.modifiedById,dm.modificationDate, id];
                }
                pool.query(query,values, function (err, res) 
                {
                    if(err) {
                        console.log(err);
                        result(err, null);
                    }
                    else{
                        console.log('Detail Query', query);        
                        result(null, {status:200,success:true,message:"Details Updated Successfully."});
                    }
                });  
        }      
    }
});
}
    

DoctorMaster.getAllDM = function (result) {     
    // var qt = `select dm.*, cat.category_name from doctormaster dm
    // LEFT JOIN doctorcategory as cat
    // ON(dm.doctorcategory_id = cat.doctorcategory_id)
    // where dm.statusId=1 and cat.statusId=1
    // order by dm.doctormaster_id DESC`;  

    var qt = `select dm.*, cat.category_name from doctormaster dm
    LEFT JOIN doctorcategory as cat
    ON(dm.doctorcategory_id = cat.doctorcategory_id)
    order by dm.doctormaster_id DESC`;
    pool.query(qt, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

DoctorMaster.disableMaster = function (id,statusId,result) {       
    pool.query("update doctormaster SET statusId=? where doctormaster_id=?", 
    [statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

DoctorMaster.getDMById = function (id,result) {      
    // var qt = `select dm.*, cat.category_name from doctormaster dm
    // LEFT JOIN doctorcategory as cat ON(dm.doctorcategory_id = cat.doctorcategory_id)
    // where dm.statusId=1 and dm.doctormaster_id=${id}`; 

    var qt = `select dm.*, cat.category_name from doctormaster dm
    LEFT JOIN doctorcategory as cat ON(dm.doctorcategory_id = cat.doctorcategory_id)
    where dm.doctormaster_id=${id}`; 
    pool.query(qt, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

DoctorMaster.getDMByCN = function (cn,result) {       
    pool.query(`select dm.*, cat.category_name from doctormaster dm
                LEFT JOIN doctorcategory as cat
                ON(dm.doctorcategory_id = cat.doctorcategory_id)
                where dm.statusId=1 and cat.category_name='${cn}'`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};

DoctorMaster.getDMByCID = function (id,result) {       
    pool.query(`select dm.*, cat.category_name from doctormaster dm
                LEFT JOIN doctorcategory as cat
                ON(dm.doctorcategory_id = cat.doctorcategory_id)
                where dm.statusId=1 and cat.doctorcategory_id='${id}'`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};




DoctorMaster.getDMBySlot = function (c_id,d_id,result) {       
    pool.query(`select dm.*, cat.category_name from doctormaster dm
                LEFT JOIN doctorcategory as cat
                ON(dm.doctorcategory_id = cat.doctorcategory_id)
                where dm.statusId=1 and cat.doctorcategory_id='${c_id}' and dm.doctormaster_id=${d_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


module.exports = DoctorMaster;