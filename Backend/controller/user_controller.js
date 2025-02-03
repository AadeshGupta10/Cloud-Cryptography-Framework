require("dotenv").config();

const { userModel } = require("../model/user_model");
const { createHmac } = require("crypto");
const { setToken } = require("../services/authentication");
const { hash_generation, hash_verification } = require("../utilities/hash");
const { generateOTP } = require("../utilities/otp_generation");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy")

// Nodemailer Transporter : It holds the info of the sender of this project
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.USER,
        pass: process.env.PASSKEY,
    },
});

const handleUserRegisteration = async (req, res) => {

    try {
        await userModel.create(req.body)
            .then(async (response) => {
                const id = Object(response["_id"]).toString()
                const token = setToken({ ...req.body, "_id": id }) //Sending Id to the Token Generation

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: 'None'
                });

                try {
                    await transporter.sendMail({
                        from: "aadeshgupta5058@gmail.com", // sender address
                        to: req.body.email, // receivers address
                        subject: `Welcome ${req.body.name} to Cloud Cryptography Framework.`, // Subject line
                        text: `Your Account with Cloud Cryptography Framework is created Successfully.`, // plain text body
                    })

                    return res.status(201).send({ "message": "User Account Created Successfully", "token": token });

                } catch {
                    return res.status(500).send("Email Not Send");
                }
            })
    } catch (err) {
        res.status(500).send("User Account Creation Failed with error " + err);
    }
}

const handleUserLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) return res.status(500).send("Invalid Credentials");

        const salt = user.salt;
        const hashedPassword = user.password;

        const matchHash = createHmac("sha256", salt).update(password).digest("hex");

        if (matchHash !== hashedPassword) return res.status(500).send("Invalid Credentials");

        const token = setToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'None'
        });

        res
            .status(200)
            .send({ "message": "Login Successfull", "token": token, "id": user._id });
    } catch {
        res.status(500).send("Signin Failed");
    }
}

const handleEmailOtpGeneration = async (req, res) => {
    const email_otp = generateOTP();
    const hash_email_otp = hash_generation(email_otp);

    try {
        const receiver_email = req.body.email;

        await transporter.sendMail({
            from: "aadeshgupta5058@gmail.com", // sender address
            to: receiver_email, // list of receivers
            subject: "Cloud Cryptography Framework Email Verification", // Subject line
            text: `OTP for Email Verification -: ${email_otp}`, // plain text body
        })

        res.cookie("email_otp", hash_email_otp, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: 'None',
        });

        res
            .status(200)
            .send(`Email Verification OTP Successfully Sent`);

    } catch {
        res.status(500).send("Error in Sending OTP");
    }
}

const handleEmailOtpVerification = async (req, res) => {

    try {
        const received_email_otp = req.body.email_otp_verification;
        const email_otp_hash = req.cookies.email_otp

        if (hash_verification(received_email_otp, email_otp_hash)) {
            res.clearCookie("email_otp");
            res.status(200).send("Email Verified");
        }
        else {
            res.status(400).send("Invalid OTP");
        }
    } catch (err) {
        res.status(400).send("Email Verification Failed");
    }
}

const handleCheckEmail = async (req, res) => {

    try {
        const data = await userModel.find({ email: req.body.email }).countDocuments()

        if (data == 1) {
            res.status(200).send("Email Id Found");
        }
        else if (data == 0) {
            res.status(500).send("Email Id Not Found");
        }
        else if (data >= 2) {
            res.status(500).send("Multiple Email Id Found");
        }
    } catch {
        res.status(500).send("Error in Checking Email");
    }
}

const handleCheckEmailDuplicacy = async (req, res) => {
    try {
        const data = await userModel.find({ email: req.body.email }).countDocuments()

        if (data == 0) {
            res.status(200).send("Email Id is valid");
        }
        else {
            res.status(500).send("Email Id already exists");
        }
    } catch {
        res.status(500).send("Network error occured. Please try again");
    }
}

const handleCreateNewPassword = async (req, res) => {

    try {
        const { email, password } = req.body;

        const data = await userModel.find({ email: email }, { _id: 1, salt: 1 });

        if (data != null) {
            try {
                const { _id, salt } = data[0];
                const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

                await userModel.findByIdAndUpdate(_id, { password: hashedPassword })

                try {
                    await transporter.sendMail({
                        from: "aadeshgupta5058@gmail.com", // sender address
                        to: req.body.email, // receivers address
                        subject: `Your Cloud Cryptography Framework Password is Changed`, // Subject line
                        text: `Recently your Cloud Cryptography Framework password is changed.\n\nIf it is not you, please change your password to stay protected, otherwise ignore this mail.\n\n\nHave a Great Time with Cloud Cryptography Framework`, // plain text body
                    })
                } catch {
                    return false
                }

                res.status(200).send("Password Reset Successfully");
            }
            catch {
                res.status(500).send("Password Reset Failed");
            }
        }
        else res.status(500).send("Invalid Email Id");
    } catch {
        res.status(500).send("Error in Creating New Password");
    }
}

const handleTokenVerification = async (req, res) => {
    try {
        res.status(200).send(req.user);

    } catch (err) {
        res.status(500).send("Error in Token Verification " + err)
    }
}

const handleMFASetup = async (req, res) => {
    try {
        const mfa_secret = speakeasy.generateSecret({
            name: "Cloud Cryptography Framework"
        })
        res.status(200).send({ "secret": mfa_secret.base32, "mfa_qr": mfa_secret.otpauth_url })
    } catch (error) {
        res.status(500).send("Error in MFA Setup " + error)
    }
}

const handleMFAVerification = async (req, res) => {

    const { mfa_code: token, secret, user_id } = req.body;

    try {

        let verified;

        if (secret !== '') {
            verified = speakeasy.totp.verify({
                secret,
                encoding: "base32",
                token
            })
        }
        else {
            const { mfa_base } = await userModel.findById({ "_id": user_id }, { mfa_base: 1 });

            verified = speakeasy.totp.verify({
                secret: mfa_base,
                encoding: "base32",
                token
            })
        }

        verified ?
            res.status(200).send("MFA Setup Successfully")
            :
            res.status(500).send("Error in MFA Code Verification")
    } catch (error) {
        res.status(500).send("Error in MFA Code Verification" + error)
    }
}

module.exports = {
    handleUserRegisteration,
    handleUserLogin,
    handleEmailOtpGeneration,
    handleEmailOtpVerification,
    handleCheckEmail,
    handleCheckEmailDuplicacy,
    handleCreateNewPassword,
    handleTokenVerification,
    handleMFASetup,
    handleMFAVerification
}