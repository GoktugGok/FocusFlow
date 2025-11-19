import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next)=>{
    console.log("Auth middleware çalışıyor...");

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Gelen token:" ? "Var" : "Yok");

    if(!token){
        console.log("Token bulunamadı");
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided"
        })
    }
    try {
        console.log("Token doğrulanıyor...")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        console.log("Token doğrulandı. Kullanıcı:", decoded.username)
        next();
    } catch (error) {
        console.error("❌ Token verification error:", error.message);

        if(error.name === "JsonWebTokenError"){
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            });
        } else{
            return res.status(403).json({
                success: false,
                message: "Token error."
            });
        }
    }
}