import jwt from "jsonwebtoken"
import genError from "./genError.js";
export const verifyUser = (req, res, next) => {
    let token = req.cookies.access_token;
    if (!token) {
        console.log(err);
        return next(genError(402, "Token Not Found!"));
    }
    try {
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (user) {
                req.user = user;
                next();
            }
            else {
                console.log(err);
                next(genError(402,"Invalid/Experied Token"));
            }
        });
    }
    catch (err) {
        console.log(err);
        next(genError(500,"Server Error!"));
    }
}