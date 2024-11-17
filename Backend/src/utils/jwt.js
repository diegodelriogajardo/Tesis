import dotenv from 'dotenv';

dotenv.config();



import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';


const secretKey = process.env.SECRETO;


export function generateToken(payload) {
    //console.log(secretKey)
    const token =jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token
}

export function verifyToken(token) {
    return jwt.verify(token, secretKey);
}
export function comparePasswords (password, hash) {
    return bcrypt.compareSync(password, hash);
}
export function hashPassword (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
//module.exports = { generateToken, verifyToken, hashPassword, comparePasswords };
//export default {generateToken, verifyToken, hashPassword, comparePasswords}