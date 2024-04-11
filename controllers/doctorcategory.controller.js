var DoctorCategory = require('../modals/doctorcategory.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
var jimp = require("jimp");


module.exports.insertDoctorCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
        try
        {    
            if(!req.file){
                res.status(400).send({ success:false, message: 'Please Provide Category Image.' });        
            }
            else{ 
                var fn = './public/category/' + req.file.filename;                  
                 jimp.read(fn, function (err, img) {
                 if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/category/' + fn) // save
                    console.log('Resized !!')              
            });  
            var category = new DoctorCategory(req.body, fn);                
            if(!category.category_name)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
            }
            category.statusId=1;
            category.createdById = user[0].id;
            category.creationDate = new Date;
            DoctorCategory.createCategory(category, function(err, data) 
            {
                if(err)
                {
                    res.send({status:400,success:false,message:"Details Not Saved."});
                }
                else{
                    res.send({status:200,success:true,message:data.message});
                }
            });
        } 
    }catch(e){console.log(e)}
}
})(req,res,next);
}

module.exports.updateDoctorCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){  
            if(!req.file)
            {
                var category = new DoctorCategory(req.body);                
                if(!category.category_name)
                {
                    return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
                }
                category.modifiedById = user[0].id;
                category.modificationDate = new Date;
                DoctorCategory.updateCategory(req.body.doctorcategory_id,category, function(err, data) 
                {
                    if(err)
                    {
                        res.send({status:400,success:false,message:"Details Not Updated."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }
            else{
                var fn = './public/category/' + req.file.filename;  
                //let newfileName = req.file.filename + ".png"
                 jimp.read(fn, function (err, img) {
                 if (err) 
                    throw err;
                    img.resize(250, 250)            // resize
                    .quality(100)              // set JPEG quality       
                    .write('./public/category/' + fn) // save
                    console.log('Resized !!')              
                });  
                var category = new DoctorCategory(req.body,fn);                
                if(!category.category_name)
                {
                    return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
                }
                category.modifiedById = user[0].id;
                category.modificationDate = new Date;
                DoctorCategory.updateCategory(req.body.doctorcategory_id,category, function(err, data) 
                {
                    if(err)
                    {
                        res.send({status:400,success:false,message:"Details Not Updated."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });  
            } 
    }
})(req,res,next);
}

module.exports.disableDoctorCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){          
        DoctorCategory.disableCategory(req.body.doctorcategory_id,req.body.statusId, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Category Not Disabled."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
    }
})(req,res,next);
}



//Used for both admin and customer

module.exports.getAllDoctorCategories = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            DoctorCategory.getAllCategory(function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message: "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//Used for Admin and User
module.exports.getDoctorCategoryById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            DoctorCategory.getCategoryById(req.query.doctorcategory_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}

//User APi
module.exports.getDoctorCategoryByCategoryName = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        { 
        DoctorCategory.getCategoryByCN(req.query.categoryName,function(err,data){
            if(err){
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length==0){
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
                res.send({status:200,success:true,message:"Detail Found", data:data});
            }
    });
    }
})(req,res,next);
}

//User
module.exports.searchDoctorCategory = function (req, res, next) 
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {  
            var name = req.query.name;    
            var search_query;
            if(name)
            {      
                search_query = `SELECT * from doctorcategory   
                        where category_name LIKE '%${name}%' and statusId=1
                    Order By category_name DESC`
            }
            console.log('Query', search_query);
            pool.query(search_query, function(err,data){
            if(err) {
                 console.log(err)
                response = {status:400,success:false,message:"Error fetching data"};
            } 
            else if(data.length == 0){
                response = {status: 200, success : false, message : "No Data Found"};
            }
            else {
                response = {status: 200, success : true, message : "Data Found", "SearchData": data};
            }
         res.json(response);
     });
}
    })(req,res,next);
}
