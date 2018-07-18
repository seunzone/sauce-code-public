const loginRequired = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log('authenticaeted')
        return next();
    }else{
        res.status(401).render('404', {errorcode: 401, error: 'Please login again to continue'})
    }
}
export default loginRequired;