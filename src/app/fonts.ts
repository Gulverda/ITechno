import localFont from 'next/font/local'

export const firaGo400 = localFont({
  src: [
    {
      path: '../assets/fonts/firago_latin_400_normal-s.p.0c4f2545.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-firaGo-400',
})

export const firaGo600 = localFont({
  src: [
    {
      path: '../assets/fonts/firago_latin_600_normal-s.p.4192568d.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-firaGo-600',
})

export const lgvAnastasia = localFont({
  src: [
    {
      path: '../assets/fonts/LGVAnastasia2025Geo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-lgv',
})
