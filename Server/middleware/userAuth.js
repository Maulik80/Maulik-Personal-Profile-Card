/* Server/middleware/userAuth.js */
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            // ✅ FIX: ID ને સુરક્ષિત જગ્યાએ સેવ કરો
            req.userId = tokenDecode.id; 
            
            // જૂના કોડ માટે body માં પણ રાખો (optional)
            if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id; 

            next(); 
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again.' });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;