import * as jwt from 'jsonwebtoken'

const secretKey = 'ChaveSecreta'

function verifyPassword(
  inputPassword: string,
  storedPassword: string,
): boolean {
  return inputPassword === storedPassword
}

function generateToken(userId: string): string {
  console.log('alooo', 'userID', userId)

  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' })
}

export { verifyPassword, generateToken }
