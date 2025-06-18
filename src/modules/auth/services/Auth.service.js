import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

// Secret Key for JWT (ensure this is set in your .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Function to hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


// Function to compare entered password with the hashed password in the database
export const comparePassword = async (enteredPassword, storedHashedPassword) => {
  
  // Ensure neither password is undefined
  if (!enteredPassword || !storedHashedPassword) {
    console.error('Error: One or both passwords are undefined');
    throw new Error('Password comparison failed: undefined password');
  }

  try {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};



// Function to generate JWT token
export const generateTokenAdmin = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: 'admin', // You can expand this for multiple roles if needed
    },
    JWT_SECRET,
    { expiresIn: '3d' } // Token expires in 3 day
  );
};

// Function to verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
