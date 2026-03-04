import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// იმპორტები შენი ახალი კოლექციებიდან
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // აქ დავამატეთ ყველა ახალი კოლექცია
  collections: [Users, Media, Products, Categories, Brands],

  // ლოკალიზაციის დამატება (რადგან Products-ში localized: true გვაქვს)
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
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
