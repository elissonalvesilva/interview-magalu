import { Account } from './../../../../domain/protocols/account';
import mongoose, { Schema, Document } from 'mongoose';

interface AccountModel extends Account, Document {}

const accountSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  accessToken: {
    type: String,
  },
});

export default mongoose.model<AccountModel>('account', accountSchema);
