import * as mongoose from 'mongoose';
import { HashPassword } from '../shared/password/index';

const UserModel = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

UserModel.pre('save', function(next) {
  this.password = HashPassword(this.password);
  next();
});

UserModel.pre('updateOne', function(next) {
  this.updatedAt = new Date();
  next();
});

export default UserModel;