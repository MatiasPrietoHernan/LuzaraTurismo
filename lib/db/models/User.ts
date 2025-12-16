import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string; // hashed
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

const User = models.User || model<IUser>('User', UserSchema);

export default User;
