/* Server/middleware/userAuth.js */
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            // ✅ 401: Unauthorized
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            // ✅ Securely attach User ID to request object
            req.userId = tokenDecode.id; 
            next(); 
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
        }

    } catch (error) {
        // ✅ 401 if token is expired/invalid
        return res.status(401).json({ success: false, message: 'Session Expired. Please Login.' });
    }
}

export default userAuth;