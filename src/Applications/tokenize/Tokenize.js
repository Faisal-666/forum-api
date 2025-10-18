class Tokenize {
  generateAccessToken(payload) {
    throw new Error('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  }

  generateRefreshToken(payload) {
    throw new Error('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  }

  verifyRefreshToken(token) {
    throw new Error('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = Tokenize;