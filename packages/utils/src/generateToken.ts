function generateToken(length: number) {
  const rand = () => Math.random().toString(36).substr(2)
  const token = rand() + rand() + rand() + rand()

  return token.substr(0, length)
}

export default generateToken
