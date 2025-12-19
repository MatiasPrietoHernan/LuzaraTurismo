import { Schema, model, models, Document } from 'mongoose'

export interface ISocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  whatsapp?: string
}

export interface IBusinessInfo extends Document {
  companyName?: string
  slogan?: string
  aboutTitle?: string
  aboutDescription?: string
  mission?: string
  vision?: string
  address?: string
  city?: string
  country?: string
  phones: string[]
  emails: string[]
  socials: ISocialLinks
  heroImage?: string
  gallery: string[]
}

const SocialLinksSchema = new Schema<ISocialLinks>({
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  tiktok: { type: String },
  whatsapp: { type: String },
}, { _id: false })

const BusinessInfoSchema = new Schema<IBusinessInfo>({
  companyName: { type: String, default: 'Luzara Turismo' },
  slogan: { type: String, default: '' },
  aboutTitle: { type: String, default: '¿Quiénes somos?' },
  aboutDescription: { type: String, default: '' },
  mission: { type: String },
  vision: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  phones: [{ type: String }],
  emails: [{ type: String }],
  socials: { type: SocialLinksSchema, default: {} },
  heroImage: { type: String },
  gallery: [{ type: String }],
}, { timestamps: true })

const BusinessInfo = models.BusinessInfo || model<IBusinessInfo>('BusinessInfo', BusinessInfoSchema)

export default BusinessInfo
