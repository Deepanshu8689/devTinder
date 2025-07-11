const adminAuth = (req, res, next) => {
    console.log('admin is getting authorized');
    const token = "asd";
    const isAuthorised = token ==="asd";

    if(!isAuthorised){
        res.status(401).send("Unauthorized Admin")
    }
    else{
        next();
    }
}
const userAuth = (req, res, next) => {
    console.log('user is getting authorized');
    const token = "asd";
    const isAuthorised = token ==="asd";

    if(!isAuthorised){
        res.status(401).send("Unauthorized User")
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}