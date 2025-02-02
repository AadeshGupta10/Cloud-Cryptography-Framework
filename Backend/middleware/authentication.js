const { verifyToken } = require("../services/authentication");
const { userModel } = require("../model/user_model");

const checkForAuthentication = () => {
    return async (req, res, next) => {
        const tokenCookie = req.cookies.token;

        if (tokenCookie == null) {
            return res.status(401).send("Token Not Available");
        }

        try {
            const user = verifyToken(tokenCookie);

            const UserExists = await userModel.findById({ _id: user["_id"] }, { _id: 1 });

            if (UserExists) {
                req.user = user;
                next();
            }
            else {
                return res.status(401).send("Token Invalid"); // Use 401 Unauthorized
            }
        } catch (error) {
            return res.status(401).send("Token Invalid"); // Use 401 Unauthorized
        }
    }
}

module.exports = { checkForAuthentication }