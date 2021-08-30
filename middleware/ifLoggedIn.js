module.exports.ifLoggedIn = (req,res,next)=>{
    if(req.user){
        return res.redirect(`/${req.user.username}`);
    }
    next();
}