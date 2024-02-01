var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import authController from './auth.controller.js';
const prisma = new PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const salt = yield bcrypt.genSalt(saltRounds);
        const hashPass = yield bcrypt.hash(password, salt);
        const create = yield prisma.user.create({
            data: {
                name,
                password: hashPass,
                email,
            },
        });
        res.json(create);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const accessToken = authController.generateAccessToken(email);
        const refreshToken = authController.generateRefreshToken(email);
        res.json({ userId: user.id, userName: user.name, profilePicture: user.profilePicture, accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
});
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return;
        const resp = yield prisma.user.findFirst({
            where: {
                id: +id
            },
        });
        res.json(resp);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, profilePicture } = req.body;
        if (!id)
            throw Error("id not found");
        const updateUser = yield prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                profilePicture
            }
        });
        res.json(updateUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default { createUser, loginUser, userInfo, updateUserInfo };
