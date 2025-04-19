const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing password');
    }
};


module.exports = {
    hashPassword,
    comparePassword
}