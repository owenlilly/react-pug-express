import bcrypt from 'bcrypt';
import Rx from 'rxjs';
import validator from 'validator';
import UserRepository from "../repositories/UserRepository";

const saltRounds = 10;

/**
 * UserService
 */
export default class UserService {
  constructor(){
    this.userRepo = new UserRepository();
  }

  /**
   * 
   * @param {Object} user - user object
   * @param {string} user.firstname - user's firstname (optional)
   * @param {string} user.lastname - user's lastname (optional)
   * @param {string} user.email - user's email address, must match email address pattern (required)
   * @param {string} user.password - user's password, must be at least 8 characters (required)
   */
  register(user){
    const errors = this.validateUser(user);
    if(errors.length > 0){
      return Rx.Observable.throw(new Error(errors.join(',')));
    }

    return this.userRepo.findOne({email: user.email}).flatMap(found => {
      if(found){
        return Rx.Observable.throw(new Error('User already exists'));
      }
      return this.hashPassword(user.password);
    }).map(hash => {
      return Object.assign({}, user, {password: hash});
    }).flatMap(u => {
      return this.userRepo.save(u);
    }).map(u => {
      return {
        id: u._id,
        email: u.email
      };
    });
  }

  verifyAndGet(email, password){
    let user;
    return this.userRepo.findOne({email: email}).flatMap(found => {
      if(!found){
        return Rx.Observable.throw(new Error('Invalid email or password'));
      }
      user = found;
      return this.compareHash(password, user.password);
    }).flatMap(passwordsMatch => {
      if(!passwordsMatch){
        return Rx.Observable.throw(new Error('Invalid email or password'));
      }
      return Rx.Observable.of(user);
    }).map(u => {
      // redact password
      u.password = undefined;
      return u;
    });
  }

  hashPassword(password){
    return Rx.Observable.fromPromise(bcrypt.hash(password, saltRounds));
  }

  compareHash(password, hash){
    return Rx.Observable.fromPromise(bcrypt.compare(password, hash));
  }

  validateUser(user){
    const errors = [];
    if(!user.password || user.password.length < 8){
      errors.push('Password must be at least 8 characters');
    }

    if(!user.email || !validator.isEmail(user.email)){
      errors.push('invalid email address format');
    }

    return errors;
  }
}