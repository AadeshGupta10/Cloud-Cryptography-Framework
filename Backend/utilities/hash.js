require("dotenv").config();
const { createHmac } = require("crypto")

const hash_generation = (item) => {
    return createHmac("sha256", process.env.SECRET_CODE).update((item).toString()).digest("hex");
}

const hash_verification = (current, old_hash) => {
    return (hash_generation(current) === old_hash);
}

module.exports = {
    hash_generation,
    hash_verification
}