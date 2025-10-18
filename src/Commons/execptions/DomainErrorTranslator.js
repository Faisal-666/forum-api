const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED': new InvariantError('method hash password belum diimplementasikan'),
  'TOKENIZE.METHOD_NOT_IMPLEMENTED': new InvariantError('method token belum diimplementasikan'),

  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  'AUTHENTICATION_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('token autentikasi tidak sesuai spesifikasi tipe data'),
  'AUTHENTICATION_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('token autentikasi tidak memiliki properti yang dibutuhkan'),

  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('komentar gagal disimpan karena tipe data tidak sesuai'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('komentar gagal disimpan karena properti yang dibutuhkan tidak tidak lengkap'),
  
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('komentar tidak memiliki properti yang dibutuhkan'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('komentar tidak sesuai spesifikasi tipe data'),


  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('thread gagal ditambahkan karena properti yang dibutuhkan tidak ada'),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread gagal ditambahkan karena tipe data tidak sesuai'),
  
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('thread tidak memiliki properti yang dibutuhkan'),
  'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread tidak sesuai spesifikasi tipe data'),

};

module.exports = DomainErrorTranslator;
