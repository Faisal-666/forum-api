const Tokenize = require('../../Applications/tokenize/Tokenize');
const InvariantError = require('../../Commons/execptions/InvariantError');

class JwtTokenManager extends Tokenize {
  constructor(jwt, config) {
    super();
    this._jwt = jwt;
    this._accessKey = config.token.acc_key;
    this._refreshKey = config.token.ref_key;
  }

  generateAccessToken(payload) {
    return this._jwt.token.generate(payload, this._accessKey);
  }

  generateRefreshToken(payload) {
    return this._jwt.token.generate(payload, this._refreshKey);
  }

  verifyRefreshToken(token) {
    try{
      const artifact = this._jwt.token.decode(token);
      this._jwt.token.verifySignature(artifact, this._refreshKey);
      const { payload } = artifact.decoded;
      return payload;
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }
}

module.exports = JwtTokenManager;