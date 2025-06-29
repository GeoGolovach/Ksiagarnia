export const attachUserData = (req, res, next) => {
    res.locals.user = req.session.user || null;
    
    if (req.session.user) {
        req.userId = req.session.user.id;
    }
    next();
}