import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const Authorization = async (req, res, next) => {
  try {
    const token = req.cookies.AccessToken;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    req.user = decoded.id;
    
    next();
  } catch (error) {
    console.error("Authorization Error:", error.message);

    res.status(500).json({ message: 'Server Error' });
  }
};

export default Authorization;
