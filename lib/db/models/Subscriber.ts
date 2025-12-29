import { Schema, model, models, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  subscribedAt: Date;
  isActive: boolean;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Subscriber = models.Subscriber || model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
