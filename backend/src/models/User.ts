import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  authProvider?: 'local' | 'google';
  role: 'PATIENT' | 'RECEPTIONIST' | 'DOCTOR' | 'ADMIN';
  phone?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional for OAuth users
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { 
    type: String, 
    enum: ['PATIENT', 'RECEPTIONIST', 'DOCTOR', 'ADMIN'], 
    default: 'PATIENT' 
  },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
