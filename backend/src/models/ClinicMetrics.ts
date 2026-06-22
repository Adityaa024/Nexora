import mongoose, { Schema, Document } from 'mongoose';

export interface IClinicMetrics extends Document {
  date: string; // YYYY-MM-DD format
  averageConsultationTimeMs: number;
  rollingWindowCount: number;
}

const ClinicMetricsSchema: Schema = new Schema({
  date: { type: String, required: true, unique: true },
  averageConsultationTimeMs: { type: Number, default: 600000 }, // default 10 minutes
  rollingWindowCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IClinicMetrics>('ClinicMetrics', ClinicMetricsSchema);
