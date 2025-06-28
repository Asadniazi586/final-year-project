import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        console.log("🔍 Received Token:", token); // ✅ Log token before decoding

        // ✅ Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded); // ✅ Log decoded token

        if (!decoded || !decoded.userId) {
            console.error("❌ Invalid token structure:", decoded);
            return res.status(401).json({ success: false, message: "Invalid token structure" });
        }

        req.user = { userId: decoded.userId }; // ✅ Attach userId to req.user
        console.log("✅ Middleware User ID:", req.user.userId); // ✅ Log userId

        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
