import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticate = async (email, password) => {
  await dbConnect();
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

export const requireRole = (requiredRoles) => {
  if (typeof requiredRoles === 'string') {
    requiredRoles = [requiredRoles];
  }

  return async (req) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new Error('Invalid token');
    }
    
    if (!requiredRoles.includes(decoded.role)) {
      throw new Error('Insufficient permissions');
    }
    
    return decoded;
  };
};