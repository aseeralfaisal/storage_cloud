import jwt from 'jsonwebtoken';
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const generateAccessToken = (email) => {
    return jwt.sign({ email }, accessTokenSecret, { expiresIn: '30m' });
};
const generateRefreshToken = (email) => {
    return jwt.sign({ email }, refreshTokenSecret, { expiresIn: '1d' });
};
const handleRefreshToken = (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, refreshTokenSecret, (err, email) => {
            if (err)
                return res.sendStatus(403);
            const accessToken = generateAccessToken(email);
            res.json({ accessToken });
        });
    }
    else {
        res.sendStatus(401);
    }
};
export default {
    handleRefreshToken,
    generateAccessToken,
    generateRefreshToken,
};
