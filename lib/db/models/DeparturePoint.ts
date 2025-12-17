import { Schema, model, models, Document } from 'mongoose';

export interface IDeparturePoint extends Document {
  name: string;
  city: string;
  address?: string;
  isActive: boolean;
}

const DeparturePointSchema = new Schema<IDeparturePoint>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DeparturePoint = models.DeparturePoint || model<IDeparturePoint>('DeparturePoint', DeparturePointSchema);

export default DeparturePoint;
