require('dotenv').config();
import mongoose from 'mongoose';
import assert from 'assert';
import UserRepository, { UserModel } from '../../repositories/UserRepository';


describe('UserRepository', () => {

  let repo;
  before(() => {
    mongoose.connect(process.env.TEST_MONGO_URI, { useMongoClient: true });
    mongoose.Promise = global.Promise;

    repo = new UserRepository();
  });

  after((done) => {
    UserModel.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });

  describe('.save()', () => {
    it('should save a new user to the database', (done) => {
      const user = {
        firstname: 'Test',
        lastname: 'User',
        email: 'user@test.com',
        password: 'password',
        salt: 'mysalt'
      };

      repo.save(user).subscribe(u => {
        assert.notEqual(u._id, undefined);
        assert.equal(u.firstname, user.firstname);
        assert.equal(u.lastname, user.lastname);
        assert.equal(u.email, user.email);
        assert.equal(u.password, user.password);
        assert.equal(u.salt, user.salt);
        done();
      });
    });
  });
});