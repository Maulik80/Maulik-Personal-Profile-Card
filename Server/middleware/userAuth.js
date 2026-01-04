// server/middleware/userAuth.js
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id; // Attach User ID to the request
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again.' });
        }

        next(); // Proceed to the next function (e.g., Save Profile)
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

module.exports = userAuth;