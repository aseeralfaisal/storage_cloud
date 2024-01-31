import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET as string

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
      jwt.verify(token, accessTokenSecret)
      next()
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.sendStatus(401)
    }
    return res.status(403).json({ msg: "Forbidden" })
  }
}


export { authenticateToken }
