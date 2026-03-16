import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../../../models/index.cjs';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// ---------- Password Utils ----------
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (enteredPassword, storedHashedPassword) => {
  if (!enteredPassword || !storedHashedPassword) throw new Error('Password comparison failed');
  return bcrypt.compare(enteredPassword, storedHashedPassword);
};

// ---------- JWT ----------
export const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role,
    },
    JWT_SECRET,
    { expiresIn: '3d' }
  );
};

// ---------- Generic Registration ----------
export const registerUserService = async ({ first_name, last_name, email, password, bio }, role) => {
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await hashPassword(password);

  const user = await db.User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    bio,
    avatar_url: '/assets/img/profile.png',
  });

  const roleRecord = await db.Role.findOne({ where: { name: role } });
  if (!roleRecord) throw new Error(`Role "${role}" not found`);

  await user.addRole(roleRecord);

  const token = generateToken(user, role);

  return {
    token,
    user: { id: user.id, first_name, last_name, email, avatar_url: user.avatar_url },
  };
};

// ---------- Generic Login ----------
export const loginUserService = async ({ email, password }, role) => {

  // Fetch user with all roles
  const user = await db.User.findOne({
    where: { email },
    include: { 
      model: db.Role,
      as: 'roles',
      attributes: ['id', 'name'],
      through: { attributes: [] }
    }
  });


  if (!user) throw new Error('User not found');

  // Check if user has the required role
  const hasRole = user.roles.some(r => r.name.toLowerCase() === role.toLowerCase());
  if (!hasRole) throw new Error(`${role} role not assigned to this user`);

  // Validate password
  if (!user.password) throw new Error('User has no password set');
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  // Generate token
  const token = generateToken(user, role);

  // Return safe user data
  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar_url: user.avatar_url
    }
  };
};
