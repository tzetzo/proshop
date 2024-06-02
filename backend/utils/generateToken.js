import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    // create the JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' }); // token expires after 30 days
    // set the Cookie as HTTP-Only and include the JWT
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // https when prod
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days === 30 * (24 hours * 60 minutes * 60 seconds) * 1000 milliseconds
    })
}

export default generateToken;