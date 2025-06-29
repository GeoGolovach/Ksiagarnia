export function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }

    if (req.accepts('json')) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    res.redirect('/auth/login');
}

export function ensureAdmin(req, res, next) {
    if (req.session.user?.isAdmin) {
        return next();
    }
    res.status(403).send('Access denied. Admins only.');
}
