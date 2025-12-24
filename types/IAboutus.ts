interface BusinessInfo {
  companyName: string
  slogan: string
  aboutTitle: string
  aboutDescription: string
  mission: string
  vision: string
  address: string
  city: string
  country: string
  phones: string[]
  emails: string[]
  socials: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    tiktok: string
    whatsapp: string
  }
  heroImage: string
  gallery: string[]
}
export default BusinessInfo