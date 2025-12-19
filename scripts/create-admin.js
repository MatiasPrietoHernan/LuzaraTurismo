const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../lib/db/connect.js');
const User = require('../lib/db/models/User.js');

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function createAdminUser() {
  await connectDB();
  
  const email = 'admin@luzara.com';
  const password = 'admin123';
  
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('El usuario admin ya existe');
    return;
  }
  
  // Hashear la contraseña
  const hashedPassword = await hashPassword(password);
  
  // Crear el usuario
  const adminUser = await User.create({
    email,
    password: hashedPassword,
    name: 'Administrador'
  });
  
  console.log('Usuario admin creado exitosamente:', adminUser.email);
  process.exit(0);
}

