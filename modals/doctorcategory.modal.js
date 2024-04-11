var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const DoctorCategory = function(dc, file) {   
  this.category_name = dc.category_name;
  this.category_image = file;
  this.statusId = dc.statusId;
  this.createdById = dc.createdById;  
  this.creationDate = dc.creationDate;
  this.modifiedById = dc.modifiedById;
  this.modificationDate = dc.modificationDate;
};

DoctorCategory.createCategory = function (category, result) {  
    pool.query(`select category_name from doctorcategory where category_name = '${category.category_name}'`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{               
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Category Name is already saved."}) ;
                }
                else{
                    pool.query("INSERT INTO doctorcategory SET ?", category, function (err, res) {
                    if(err) {
                        result(err, null);
                    }                
                    else{                               
                        result(null, {status:200,success:true,message:"Details Saved Successfully."});
                    }
                    });
                }
            }catch(e){console.log(e)}
        }
    });         
};

DoctorCategory.updateCategory = function (id,category,result) {    
    
    var query,values;
    pool.query(`select * from doctorcategory where doctorcategory_id=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(category.category_image !== undefined){

                    query = `update doctorcategory SET category_name=?, category_image=?, modifiedById=?, modificationDate=? where doctorcategory_id=?`;

                    values = [category.category_name,category.category_image,category.modifiedById, category.modificationDate,id];
                }
                else{
                    query = `update doctorcategory SET category_name=?, modifiedById=?, modificationDate=? where doctorcategory_id=?`;

                    values = [category.category_name,category.modifiedById, category.modificationDate,id];
                }
                pool.query(query, values, function (err, res) {
                    if(err) {
                        console.log(err);
                        result(err, null);
                    }
                    else{                       
                        result(null, {status:200,success:true,message:"Details Updated Successfully."});
                    }
        });  
    }
    }
});         
};

DoctorCategory.disableCategory = function (id,statusId,result) {       
    pool.query("update doctorcategory SET statusId=? where doctorcategory_id=?", 
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


DoctorCategory.getAllCategory = function (result) {     
    //var qt = `select * from doctorcategory where statusId=1`;  
    var qt = `select * from doctorcategory`;  
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

DoctorCategory.getCategoryById = function (id,result) {  
    //var qt = `select * from doctorcategory where doctorcategory_id=${id} and statusId=1`     
    var qt = `select * from doctorcategory where doctorcategory_id=${id}`     
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

DoctorCategory.getCategoryByCN = function (name,result) {       
    pool.query(`select * from doctorcategory where category_name='%${name}%' and statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = DoctorCategory;
