const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash func', () => {
    it('should encrypt password correctly', async () => {
      //arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      //act
      const encyptedPassword = await bcryptPasswordHash.hash('plain_password');

      //assert
      expect(typeof encyptedPassword).toEqual('string');
      expect(encyptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('compare func', () => {
    it('should compare passwword correctly', async () => {
      //arrage
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encyptedPassword = await bcryptPasswordHash.hash('plain_password');

      //act
      const match = await bcryptPasswordHash.compare('plain_password', encyptedPassword);

      //assert
      expect(spyCompare).toHaveBeenCalledWith('plain_password', encyptedPassword);
      expect(match).toBe(true);
    });
  });
});