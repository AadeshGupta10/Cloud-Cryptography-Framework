function generateOTP() {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
}

module.exports = {
    generateOTP
}