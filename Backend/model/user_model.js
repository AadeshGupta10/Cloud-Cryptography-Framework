const { Schema, model } = require("mongoose")
const { createHmac, randomBytes } = require("crypto");

const userSchema = Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    salt: {
        type: String
    },
    password: {
        type: String
    },
    mfa_base: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    const user = this;
    const password = user.password;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
})

const userModel = new model("users", userSchema);

module.exports = {
    userModel
}