import connectDB from '../lib/db/connect'
import User from '../lib/db/models/User'
import { hashPassword } from '../lib/auth'

async function createAdminUser() {
  await connectDB()
  
  const email = 'admin@luzara.com'
  const password = 'admin123'
  
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    console.log('El usuario admin ya existe')
    return
  }
  
  // Hashear la contraseña
  const hashedPassword = await hashPassword(password)
  
  // Crear el usuario
  const adminUser = await User.create({
    email,
    password: hashedPassword,
    name: 'Administrador'
  })
  
  console.log('Usuario admin creado exitosamente:', adminUser.email)
  process.exit(0)
}

createAdminUser().catch(console.error)
