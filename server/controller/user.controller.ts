import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'
import * as bcrypt from 'bcrypt';
import authController from './auth.controller.js';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPass = await bcrypt.hash(password, salt)
    const create = await prisma.user.create({
      data: {
        name,
        password: hashPass,
        email,
      },
    });

    res.json(create);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = authController.generateAccessToken(email);
    const refreshToken = authController.generateRefreshToken(email);

    res.json({ userId: user.id, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};


const userInfo = async (req: Request, res: Response) => {
  try {
    const id = req.query?.id;
    if (!id) return;
    const resp = await prisma.user.findFirst({
      where: {
        id: +id
      },
    });
    res.json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export default { createUser, loginUser, userInfo };
