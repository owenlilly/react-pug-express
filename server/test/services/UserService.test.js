require('dotenv').config();
import mongoose from 'mongoose';
import assert from 'assert';
import { UserModel } from '../../repositories/UserRepository';
import UserService from '../../services/UserService';


describe('UserService', () => {
  const user = {
    firstname: 'Test',
    lastname: 'User',
    email: 'user@test.com',
    password: 'password'
  };
  let userService;
  before(() => {
    mongoose.connect(process.env.TEST_MONGO_URI, { useMongoClient: true });
    mongoose.Promise = global.Promise;
    userService = new UserService();
  });

  after((done) => {
    UserModel.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });

  describe('.register()', () => {
    it('should save new user to database given valid fields', (done) => {
      userService.register(user).subscribe(u => {
        assert.notEqual(u._id, undefined);
        assert.equal(u.email, user.email);
        assert.equal(u.firstname, user.firstname);
        assert.equal(u.lastname, user.lastname);
        assert.notEqual(u.password, user.password);
        done();
      });
    });
  });

  describe('.verifyAndGet()', () => {
    it('should get user given correct credentials', (done) => {
      userService.verifyAndGet(user.email, user.password).subscribe(u => {
        assert.notEqual(u, undefined);
        assert.notEqual(u._id, undefined);
        assert.equal(u.email, user.email);
        assert.equal(u.firstname, user.firstname);
        assert.equal(u.lastname, user.lastname);
        assert.equal(u.password, undefined);
        done();
      });
    });

    it('should throw error given incorrect password', (done) => {
      userService.verifyAndGet(user.email, '12345678').subscribe(u => {
        assert.notEqual(u, undefined);
        done();
      }, err => {
        assert.equal(err.message, 'Invalid email or password');
        done();
      });
    });

    it('should throw error given incorrect email', (done) => {
      userService.verifyAndGet('bad@email.com', user.password).subscribe(u => {
        assert.notEqual(u, undefined);
        done();
      }, err => {
        assert.equal(err.message, 'Invalid email or password');
        done();
      });
    });
  });
});