const express = require('express');
const router = express.Router();
var multer = require('multer');

const DIR = './public/prescription';
let storagePrescription = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadPrescription = multer({storage: storagePrescription});

//-----------------------------------------------------------

const DIR_CAT = './public/category';
let storageCategory = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR_CAT);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadCategory = multer({storage: storageCategory});

//-----------------------------------------------------------

const DIR_PROFILE = './public/doctorprofile';
let storageDoctorProfile = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR_PROFILE);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadDoctorProfile = multer({storage: storageDoctorProfile});

//-----------------------------------------------------------



//controller listing
const greetcontroller = require('../controllers/greetings.controller');
const admincontroller = require('../controllers/admin.controller');
const appointmentcontroller = require('../controllers/appointment.controller');
const drivercontroller = require('../controllers/driverdetails.controller');
const doctorcategorycontroller = require('../controllers/doctorcategory.controller');
const doctormastercontroller = require('../controllers/doctormaster.controller');
const prescriptioncontroller = require('../controllers/prescription.controller');
const patientcontroller = require('../controllers/patientregister.controller');
const ridecontroller = require('../controllers/ride.controller');
const cardcontroller = require('../controllers/card.controller');
const appointmentcasescontroller = require('../controllers/appointmentcases.controller');
const helplinecontroller = require('../controllers/helpline.controller');
const logincontroller = require('../controllers/login.controller');
const aboutcontroller = require('../controllers/aboutus.controller');
//------------------------------------------------------------------------------


//----------------------------About Us-----------------------------------------
router.get('/aboutUs', aboutcontroller.aboutUs);
router.get('/googleLink', aboutcontroller.googleLink);
//-----------------------------------------------------------------------------

//---------------------------------------------------------------------
router.get("/greetings", greetcontroller.greetings);
//--------------------------------------------------------------------------

//------------------Admin Login---------------------------------------------
router.post("/adminLogin", admincontroller.adminLogin);
//--------------------------------------------------------------------------

//------------------User Login---------------------------------------------
router.post("/userLogin", logincontroller.userLogin);
router.post("/updateUser", logincontroller.updateUser);
router.get("/getAllUsers", logincontroller.getAllUsers);
router.get("/getUserById", logincontroller.getUserById);
router.get("/searchUser", logincontroller.searchUser);
//--------------------------------------------------------------------------



//------------------Appointment---------------------------------------------
router.post("/insertAppointment", appointmentcontroller.insertAppointment);
router.post("/updateAppointment", appointmentcontroller.updateAppointment);
router.get("/getAllAppointments", appointmentcontroller.getAllAppointments);
router.get("/getAppointmentById", appointmentcontroller.getAppointmentById);
router.get("/getAppointmentByStatus", appointmentcontroller.getAppointmentByStatus);
router.get("/getAppointmentByContactNumber", appointmentcontroller.getAppointmentByContactNumber);
router.get("/getAppointmentByLoginId", appointmentcontroller.getAppointmentByLoginId);
router.get("/getDoctorAppointmentsByTimeSlot", appointmentcontroller.getDoctorAppointmentsByTimeSlot);
router.get("/getDoctorAppointmentsByTimeSlotAndId", appointmentcontroller.getDoctorAppointmentsByTimeSlotAndId);
router.get("/getTodaysAppointments", appointmentcontroller.getTodaysAppointments);
//--------------------------------------------------------------------------


//----------------------Driver Details--------------------------------------
router.post('/insertDriverDetails', drivercontroller.insertDriverDetails);
router.post("/updateDriverDetails", drivercontroller.updateDriverDetails);
router.get("/getAllDrivers", drivercontroller.getAllDrivers);
router.get("/getDriverById", drivercontroller.getDriverById);
router.get("/getDriverByStatus", drivercontroller.getDriverByStatus);
router.post("/driverLogin", drivercontroller.driverLogin);
router.get('/getDriverRide', drivercontroller.getDriverRide);
router.get('/getDriverRideById', drivercontroller.getDriverRideById);
//--------------------------------------------------------------------------


//----------------------Doctor Category--------------------------------------
router.post('/insertDoctorCategory', uploadCategory.single('category_image'),doctorcategorycontroller.insertDoctorCategory);
router.post('/updateDoctorCategory', uploadCategory.single('category_image'),doctorcategorycontroller.updateDoctorCategory);
router.post('/disableDoctorCategory', doctorcategorycontroller.disableDoctorCategory);
router.get("/getAllDoctorCategories", doctorcategorycontroller.getAllDoctorCategories);
router.get("/getDoctorCategoryById", doctorcategorycontroller.getDoctorCategoryById);
router.get("/getDoctorCategoryByCategoryName", doctorcategorycontroller.getDoctorCategoryByCategoryName);
router.get("/searchDoctorCategory", doctorcategorycontroller.searchDoctorCategory);

//--------------------------------------------------------------------------



//----------------------Doctor Master--------------------------------------
router.post('/insertDoctorMaster', uploadDoctorProfile.single('doctor_profileimage'), doctormastercontroller.insertDoctorMaster);
router.post('/updateDoctorMaster', uploadDoctorProfile.single('doctor_profileimage'),doctormastercontroller.updateDoctorMaster);
router.get("/getAllDoctorMaster", doctormastercontroller.getAllDoctorMasters);
router.get("/getDoctorMasterById", doctormastercontroller.getDoctorMasterById);
router.post("/disableDoctorMaster", doctormastercontroller.disableDoctorMaster);
router.get("/getDoctorMasterByCategoryName", doctormastercontroller.getDoctorMasterByCategoryName);
router.get("/getDoctorMasterBySlot", doctormastercontroller.getDoctorMasterBySlot);
router.get("/searchDoctor", doctormastercontroller.searchDoctor);
router.get("/getDoctorMasterByCategoryId", doctormastercontroller.getDoctorMasterByCategoryId);
router.get("/updateTimeSlot", doctormastercontroller.updateTimeSlot);
router.get("/countTimeSlotAvailable", doctormastercontroller.countTimeSlotAvailable);
router.get("/searchDoctorMaster", doctormastercontroller.searchDoctorMaster);
router.get("/getDoctorTimeSlot", doctormastercontroller.getDoctorTimeSlot);
//--------------------------------------------------------------------------


//--------------------------Prescription-------------------------------------
router.post('/insertPrescription', uploadPrescription.fields([
    {name:"prescription_img1", maxCount: 1 },
    {name: 'prescription_img2'},
    {name: 'prescription_img3'},
    {name: 'prescription_img4'}
]), prescriptioncontroller.insertPrescription);
router.get('/getAllPrescription', prescriptioncontroller.getAllPrescription);
router.get('/getPrescriptionById', prescriptioncontroller.getPrescriptionById);
router.get('/checkPrescriptionStatus', prescriptioncontroller.checkPrescriptionStatus);
router.get('/checkPrescriptionImageStatus', prescriptioncontroller.checkPrescriptionImageStatus);
router.get('/getListOfAllPrescription', prescriptioncontroller.getListOfAllPrescription);
router.post('/updatePrescription', prescriptioncontroller.updatePrescription);
router.get('/getPrescriptionByStatus', prescriptioncontroller.getPrescriptionByStatus);
//---------------------------------------------------------------------------


//----------------------------Patient----------------------------------------
router.post('/insertPatient', patientcontroller.insertPatient);
router.get('/getAllPatients', patientcontroller.getAllPatients);
router.get('/getTotalPatients', patientcontroller.getTotalPatients);
router.get('/searchPatients', patientcontroller.searchPatients);
//---------------------------------------------------------------------------


//---------------------------Ride and Drive---------------------------------
  router.post('/insertRideMaster', ridecontroller.insertRideMaster);
  router.get('/getRideDetails', ridecontroller.getRideDetails);
  router.get('/getRideDetailById', ridecontroller.getRideDetailById);
  router.post('/updateStatusDetails', ridecontroller.updateStatusDetails);
  router.post('/updateDriverDetailsInRideMaster', ridecontroller.updateDriverDetailsInRideMaster);
  router.post('/updateRideStatus', ridecontroller.updateRideStatus);
  router.get('/getRideDetailByIdAdmin', ridecontroller.getRideDetailByIdAdmin);
  router.get('/getRideByRideFilter', ridecontroller.getRideByRideFilter);
  router.get('/searchRideMaster', ridecontroller.searchRideMaster);
//--------------------------------------------------------------------------


//----------------------------Card Controller-------------------------------------
router.get('/getTotalAppointment', cardcontroller.getTotalAppointment);
router.get('/getTotalPrescription', cardcontroller.getTotalPrescription);
router.get('/getTotalFreeDrivers', cardcontroller.getTotalFreeDrivers);
router.get('/getTotalUsers', cardcontroller.getTotalUsers);
//-----------------------------------------------------------------------------


//---------------------------Appointment Cases Controller------------------------------
router.get('/getAllAppointmentCases', appointmentcasescontroller.getAllAppointmentCases);
router.get('/getAllTotalCases', appointmentcasescontroller.getAllTotalCases);
router.get('/getCaseDescription', appointmentcasescontroller.getCaseDescription);
router.post('/updateAppointmentCase', appointmentcasescontroller.updateAppointmentCase);
router.post('/updateAppointmentMedicineCase', appointmentcasescontroller.updateAppointmentMedicineCase);
router.get('/getAppointmentCaseById', appointmentcasescontroller.getAppointmentCaseById);
router.get('/getAppointmentCaseByStatus', appointmentcasescontroller.getAppointmentCaseByStatus);
router.get('/getUserAllCaseById', appointmentcasescontroller.getUserAllCaseById);
router.get('/getUserCaseDescriptionByCaseId', appointmentcasescontroller.getUserCaseDescriptionByCaseId);
router.get('/getAllMedicineStatusData', appointmentcasescontroller.getAllMedicineStatusData);
router.get('/getAllMedicineStatusDataById', appointmentcasescontroller.getAllMedicineStatusDataById);
router.get('/getCaseByStatus', appointmentcasescontroller.getCaseByStatus);
router.get('/searchCases', appointmentcasescontroller.searchCases);
//--------------------------------------------------------------------------------------

//----------------------------------HelpLine Controller-----------------------------------
router.get('/getHelpLineNumber', helplinecontroller.getHelpLineNumber);
//----------------------------------------------------------------------------------------
module.exports = router;