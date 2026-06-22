import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  tokenNumber: string;
  patientId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  status: 'BOOKED' | 'ARRIVED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  symptomsRaw?: string;
  voiceIntakeUrl?: string;
  priorityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiRationale?: string;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  actualDurationMinutes?: number;
}

const TokenSchema: Schema = new Schema({
  tokenNumber: { type: String, required: true, unique: true }, // T-YYYYMMDD-Increment
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
  departmentId: { type: Schema.Types.ObjectId },
  status: { 
    type: String, 
    enum: ['BOOKED', 'ARRIVED', 'WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED'], 
    default: 'BOOKED' 
  },
  symptomsRaw: { type: String },
  voiceIntakeUrl: { type: String },
  priorityScore: { type: Number, min: 1, max: 10, default: 3 },
  riskLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'LOW' 
  },
  aiRationale: { type: String },
  checkInTime: { type: Date },
  consultationStartTime: { type: Date },
  consultationEndTime: { type: Date },
  actualDurationMinutes: { type: Number }
}, {
  timestamps: true
});

export default mongoose.model<IToken>('Token', TokenSchema);
