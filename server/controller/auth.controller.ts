
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenSecret: any = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET

const generateAccessToken = (email: string) => {
  return jwt.sign({ email }, accessTokenSecret, { expiresIn: '30m' })
}
const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, refreshTokenSecret, { expiresIn: '1d' })
}

const handleRefreshToken = (req: Request, res: Response) => {
  const token: string = req.body.token as string;

  if (token) {
    jwt.verify(token, refreshTokenSecret, (err: any, email: any) => {
      if (err) return res.sendStatus(403)
      const accessToken: string = generateAccessToken(email) as string;
      res.json({ accessToken })
    });
  } else {
    res.sendStatus(401)
  }
}
export default {
  handleRefreshToken,
  generateAccessToken,
  generateRefreshToken,
}
