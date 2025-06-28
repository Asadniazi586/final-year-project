import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Access Denied!" });
        }

        const token = authHeader.split(" ")[1];
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has the correct email and role
        if (token_decode.email !== process.env.ADMIN_EMAIL || token_decode.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied!" });
        }

        next();
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export default authAdmin;
