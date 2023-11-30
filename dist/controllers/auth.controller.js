import * as jwt from 'jsonwebtoken';
import { User } from '../schemas/user.schema.js';
export default class AuthController {
    user = User;
    signToken = (id) => {
        return jwt.default.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    };
    verifyToken = (token) => {
        return jwt.default.verify(token, process.env.JWT_SECRET);
    };
    signup = async (req, res) => {
        const { name, password, email } = req.body;
        if (!name || !password || !email) {
            return res.status(400).json({ message: 'Body must contain name, password and email' });
        }
        try {
            const newUser = await this.user.create({ name, password, email });
            const token = this.signToken(newUser._id);
            delete newUser.password;
            return res.status(201).json({
                user: newUser,
                token
            });
        }
        catch (err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(409).json({ message: 'Account with given email address already exists' });
            }
            return res.sendStatus(500);
        }
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Body must contain email and password' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'Account with given email address not found' });
        }
        //@ts-ignore
        if (!(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        const token = this.signToken(user._id);
        return res.status(200).json(token);
    };
    authenticate = async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({ message: 'Missing authorization from request headers' });
        }
        const token = authorization.split(' ')[1];
        if (!token || !authorization.startsWith('Bearer')) {
            return res.status(403).json({ message: 'Invalid bearer token format' });
        }
        try {
            const userId = this.verifyToken(token).id;
            const user = await this.user.findById(userId);
            req.user = user;
            return next();
        }
        catch (err) {
            return res.status(403).json({ message: 'Invalid bearer token' });
        }
    };
}
//# sourceMappingURL=auth.controller.js.map