import { Schema, model, models, Document } from 'mongoose';

export interface IOrderItem extends Document {
  packageId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  date?: string;
  details?: string;
}

export interface IOrder extends Document {
  userId?: Schema.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  email?: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  date: { type: String },
  details: { type: String }
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'cancelled'], 
    default: 'pending' 
  },
  email: { type: String }
}, { timestamps: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
