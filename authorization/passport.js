const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('../authorization/pool');

module.exports = function (passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
    opts.secretOrKey = "rxaushadi";
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{         
        console.log('Type=>', jwt_payload.type);
        console.log("JWT ID=>", jwt_payload._id);
        console.log("JWT Password=>", jwt_payload.password);
        console.log("JWT Contact Number=>", jwt_payload.contact_number);
        if(jwt_payload.type == 'admin')
        {
            pool.query('SELECT * FROM adminlogin WHERE id = ' 
            +jwt_payload._id+ ' AND adminpassword = "' + jwt_payload.password +'"', function(err,result)
            {
                if(err){
                    console.log("PassportTest1");
                    return done(err,false,{ message: 'Invalid token.' });                
                }
                else if(result){
                    console.log("PassportTest2");
                    return done(null,result);
                }
                else{
                    console.log("PassportTest3");
                    return done(null,false, { message: 'Invalid request.' });
                }
            });
        }
        else if(jwt_payload.type == 'driver')
        {
            pool.query('SELECT * FROM driverdetails WHERE driverdetails_id = ' 
            +jwt_payload._id, function(err,result)
            {
                if(err){
                    console.log("PassportDriver1");
                    return done(err,false,{ message: 'Invalid token.' });                
                }
                else if(result){
                    console.log("PassportDriver2", result);
                    return done(null,result);
                }
                else{
                    console.log("PassportDriver3");
                    return done(null,false, { message: 'Invalid request.' });
                }
            }); 
        }
        else if(jwt_payload.type == 'user')
        {
            pool.query('SELECT * FROM login_register WHERE contact_number = ' 
            +jwt_payload.contact_number, function(err,result)
            {
                if(err){
                    console.log("PassportUser1");
                    return done(err,false,{ message: 'Invalid token.' });                
                }
                else if(result){
                    console.log("PassportUser2", result);
                    return done(null,result);
                }
                else{
                    console.log("PassportUser3");
                    return done(null,false, { message: 'Invalid request.' });
                }
            }); 
        }


     }))
}
