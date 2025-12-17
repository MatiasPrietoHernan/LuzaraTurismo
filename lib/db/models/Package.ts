import { Schema, model, models, Document } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  destination: string;
  nights: number;
  departureDate: Date;
  price: number;
  priceFrom?: number;
  mainImage?: string;
  gallery: string[];
  services: { icon: string; text: string }[];
  information: string[];
  hotel: {
    name: string;
    roomType: string;
    zone: string;
    location: string;
    image: string;
  };
  availableDates: number[];
  departurePoints: Schema.Types.ObjectId[]; // 👈 Cambiado de string[] a ObjectId[]
  badge?: string;
  description?: string;
  isPromotion?: boolean;
  isPublished: boolean;
  isActive: boolean;
  views: number;
  clicks: number;
}

const PackageSchema = new Schema<IPackage>({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  nights: { type: Number, required: true },
  departureDate: { type: Date, required: true },
  price: { type: Number, required: true },
  priceFrom: { type: Number },
  mainImage: { type: String },
  gallery: [{ type: String }],
  services: [{ icon: { type: String }, text: { type: String } }],
  information: [{ type: String }],
  hotel: {
    name: { type: String, required: true },
    roomType: { type: String, required: true },
    zone: { type: String },
    location: { type: String },
    image: { type: String }
  },
  availableDates: [{ type: Number }],
  departurePoints: [{ type: Schema.Types.ObjectId, ref: 'DeparturePoint' }], // 👈 CORREGIDO
  badge: { type: String },
  description: { type: String },
  isPromotion: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

const Package = models.Package || model<IPackage>('Package', PackageSchema);

export default Package;