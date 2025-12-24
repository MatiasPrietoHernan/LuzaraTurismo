import Image from "next/image"
import BusinessInfo from "@/types/IAboutus"
import { Header } from "@/components/header"

async function getBusinessInfo(): Promise<BusinessInfo> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/business-info`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch (error) {
    console.error("Error fetching business info:", error)
    // Return default values if fetch fails
    return {
      companyName: "Luzara Turismo",
      slogan: "Tu compañero de viajes de confianza",
      aboutTitle: "¿Quiénes somos?",
      aboutDescription: "Somos una agencia de turismo comprometida con hacer realidad tus sueños de viaje.",
      mission: "Nuestra misión es crear experiencias inolvidables.",
      vision: "Ser la agencia de turismo líder en la región.",
      address: "",
      city: "",
      country: "",
      phones: [],
      emails: [],
      socials: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        tiktok: "",
        whatsapp: "",
      },
      heroImage: "",
      gallery: [],
    }
  }
}

export default async function AboutPage() {
  const data = await getBusinessInfo()

  const defaultGallery = [
    "/grupo-de-turistas-felices-en-monta-as.jpg",
    "/paisaje-tropical-con-playa-paradisiaca.jpg",
    "/ciudad-europea-hist-rica-con-arquitectura.jpg",
    "/familia-disfrutando-vacaciones-en-la-playa.jpg",
    "/aventura-en-naturaleza-con-cascadas.jpg",
    "/grupo-de-amigos-viajando-juntos.jpg",
  ]

  const galleryImages = data.gallery && data.gallery.length > 0 ? data.gallery : defaultGallery

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.heroImage || defaultGallery[1]}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-teal-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="text-teal-400 text-sm font-semibold tracking-[0.2em] uppercase">{data.slogan}</span>
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight text-balance">
            {data.aboutTitle}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-teal-300 font-light max-w-3xl mx-auto text-pretty">
            {data.companyName}
          </p>

          <div className="mt-16 animate-bounce">
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">10+</div>
                <div className="text-sm lg:text-base text-gray-600 uppercase tracking-wide">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">5000+</div>
                <div className="text-sm lg:text-base text-gray-600 uppercase tracking-wide">Viajeros felices</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">50+</div>
                <div className="text-sm lg:text-base text-gray-600 uppercase tracking-wide">Destinos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">98%</div>
                <div className="text-sm lg:text-base text-gray-600 uppercase tracking-wide">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Description Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-4">
                <span className="text-teal-600 text-sm font-semibold tracking-[0.2em] uppercase">Quiénes Somos</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 text-balance">{data.companyName}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{data.aboutDescription}</p>
                {data.vision && (
                  <div className="relative pl-6 border-l-4 border-teal-500">
                    <p className="text-gray-800 text-lg leading-relaxed italic">{data.vision}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={galleryImages[0] || "/placeholder.svg"}
                  alt="Nuestro equipo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={galleryImages[4] || defaultGallery[4]} alt="Nuestra misión" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent" />
              </div>
            </div>

            <div>
              <div className="inline-block mb-4">
                <span className="text-teal-400 text-sm font-semibold tracking-[0.2em] uppercase">
                  Nuestro Compromiso
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Nuestra Misión</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{data.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-teal-600 text-sm font-semibold tracking-[0.2em] uppercase">Galería</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">Nuestras Experiencias</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto text-pretty">
              Momentos capturados de aventuras inolvidables alrededor del mundo
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Item */}
            <div className="md:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
                <Image
                  src={galleryImages[0] || "/placeholder.svg"}
                  alt="Experiencia destacada"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-teal-400 text-sm font-semibold uppercase tracking-wide mb-2">Destacado</span>
                  <h3 className="text-white text-2xl lg:text-3xl font-bold">Experiencias únicas</h3>
                </div>
              </div>
            </div>

            {/* Medium Items */}
            {galleryImages.slice(1, 3).map((imageUrl, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Galería ${index + 2}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                </div>
              </div>
            ))}

            {/* Small Items */}
            {galleryImages.slice(3, 6).map((imageUrl, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Galería ${index + 4}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-teal-600 text-sm font-semibold tracking-[0.2em] uppercase">Nuestros Valores</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">
              Lo que nos hace diferentes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Experiencia</h3>
              <p className="text-gray-600 leading-relaxed">
                Más de una década conectando viajeros con sus destinos soñados
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Atención Personalizada</h3>
              <p className="text-gray-600 leading-relaxed">Cada viaje es único, diseñado especialmente para ti</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Destinos Increíbles</h3>
              <p className="text-gray-600 leading-relaxed">Acceso a los mejores lugares del mundo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={galleryImages[2] || defaultGallery[2]} alt="CTA background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-teal-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-gray-300 mb-10 text-pretty">
            Déjanos ayudarte a crear recuerdos que durarán toda la vida
          </p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
            Comienza tu viaje
          </button>
        </div>
      </section>
    </div>
</>
  )
}
