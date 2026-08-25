const login = async (credentials) => {
  return {
    username: credentials.username || 'testuser',
    name: 'Matti Luukkainen',
    token: 'bearer mock-testing-token-12345',
  }
}

export default { login }
