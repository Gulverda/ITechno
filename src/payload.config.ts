import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Filters } from './collections/FilterGroups'
import { FilterOptions } from './collections/FilterOptions'
import { AboutUs } from './collections/AboutUs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Filters, FilterOptions, Products, Categories, Brands, AboutUs],

  localization: {
    locales: [
      { label: 'Georgian', code: 'ka' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'ka',
    fallback: true,
  },

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),
  sharp,

  // მთავარი ნაწილი: Cloud Storage პლაგინი
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          // დარწმუნდი, რომ Media კოლექციის slug არის 'media'
          adapter: s3Adapter({
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: 'auto',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
            },
            bucket: process.env.S3_BUCKET || '',
          }),
          // ეს ფუნქცია აუცილებელია, რომ სურათები საიტზე გამოჩნდეს
          generateFileURL: ({ filename }: { filename: string }) => {
            return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${filename}`
          },
        },
      },
    }),
  ],
})
