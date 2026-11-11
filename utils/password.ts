import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)
