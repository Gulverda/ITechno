import Image from 'next/image'

export const PromoBanner = () => {
  return (
    <section className="w-full mx-auto mb-12 mt-6">
      <div className="relative w-full h-[320px] md:h-[450px] md:px-6 overflow-hidden bg-[#0A1A2F] flex items-center justify-center text-center">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200"
            alt="bg"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 space-y-2">
          <h2 className="text-white text-[42px] md:text-[72px] font-lgv uppercase leading-none tracking-wider">
            სარეკლამო ბანერი
          </h2>
          <p className="text-white/90 text-[24px] md:text-[40px] font-lgv uppercase tracking-tight">
            თქვენი რეკლამა განთავსდება აქ
          </p>
        </div>

        <div className="absolute -right-10 -bottom-10 w-[280px] md:w-[500px] aspect-square pointer-events-none">
          <Image
            src="https://www.hikvision.com/content/dam/hikvision/en/products/hi-res/ip-cameras/colorvu/ds-2cd2047g2-lu.png"
            alt="Hikvision"
            fill
            className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  )
}
