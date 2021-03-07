import { Client } from './../../../../domain/protocols/client';
import mongoose, { Schema, Document } from 'mongoose';

interface ClientModel extends Client, Document {}

const clientSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  favorites: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<ClientModel>('clients', clientSchema);
