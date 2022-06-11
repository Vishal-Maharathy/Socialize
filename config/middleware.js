module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        //what kind of flash message to flash(succes type(green), error type(red) is being set up here)
        success : req.flash('success'),
        error : req.flash('error')
    }
    next();
}