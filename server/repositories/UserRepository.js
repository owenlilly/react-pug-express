import mongoose, { Schema } from 'mongoose';
import BaseRepository from './BaseRepository';

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  salt: String
}, { timestamps: {} });

export const UserModel = mongoose.model('User', userSchema);

export default class UserRepository extends BaseRepository {
  constructor(){
    super(UserModel);
  }
}