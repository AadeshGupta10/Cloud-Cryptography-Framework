import { toast } from "react-toastify";
import axios_instance from "../../utils/Axios Instance/axios_instance";

const signup = async (e: any) => {

    return await toast.promise(
        axios_instance.post("/signup", e),
        {
            pending: 'Creating Account... Please Wait',
            success: `Welcome ${e.name}`,
            error: "Account Creation Failed. Try Again Later."
        }
    )
}

const signin = async (e: any) => {

    return await toast.promise(
        axios_instance.post("/signin", e),
        {
            pending: 'Verifying Credentials',
            error: "Credentials Invalid"
        }
    )
}

const email_otp = async (e: any) => {

    return await toast.promise(
        axios_instance.post("/email_otp", e),
        {
            pending: `Sending OTP on ${e.email}`,
            success: `OTP is Sent on ${e.email}`,
            error: "Network Error Occured, Try Again Later"
        }
    )
}

const email_otp_verification = async (e: object) => {

    return await toast.promise(
        axios_instance.post("/email_otp_verification", e),
        {
            pending: 'Verifying OTP',
            success: 'OTP Verified Successfully',
            error: "OTP Verification Failed"
        }
    )
}

const check_email = async (e: any) => {
    return await toast.promise(
        axios_instance.post("/check_email", e),
        {
            pending: `Checking Email.... Please Wait`,
            error: "Email Invalid"
        }
    )
}

const check_email_duplicacy = async (e: any) => {
    return await toast.promise(
        axios_instance.post("/check_email_duplicacy", e),
        {
            pending: `Checking Email.... Please Wait`
        }
    )
}

const create_new_password = async (e: object) => {

    return await toast.promise(
        axios_instance.post("/create_new_password", e),
        {
            pending: 'Resetting Password.. Please Wait.',
            success: 'Password Reset Successfully',
            error: "Password Reset Failed"
        }
    )
}

const verify_token = async () => {
    return await toast.promise(
        axios_instance.get("/dashboard/verify_token"),
        {
            error: "Session Timeout, Please Login Again."
        }
    )
}

const mfa_setup = async () => {
    return await toast.promise(
        axios_instance.get("/mfa_setup"),
        {
            error: "Sorry, there is an error in setting up your Multi-Factor Authentication."
        }
    )
}

const mfa_verification = async (e: object) => {
    return await toast.promise(
        axios_instance.post("/mfa_verification", e),
        {
            success: "Multi-Factor Authentication is Enabled on Your Account",
            error: "Sorry, there is an error in Verifying your Multi-Factor Authentication Code."
        }
    )
}

export {
    signup,
    signin,
    email_otp,
    email_otp_verification,
    check_email,
    check_email_duplicacy,
    create_new_password,
    verify_token,
    mfa_setup,
    mfa_verification
}