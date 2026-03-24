import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import slugify from 'slugify'
// იმპორტები შენი კოლექციებიდან
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Filters } from './collections/FilterGroups'
import { FilterOptions } from './collections/FilterOptions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Filters, FilterOptions, Products, Categories, Brands],

  // onInit: async (payload) => {
  //   const PARENT_ID = 28 // <--- აქ ჩაწერე Fire Alarm Systems-ის რეალური ID

  //   const subCategories = [{ ka: 'სახანძრო სიგნალიზაცია', en: 'Fire Alarm System' }]

  //   for (const sub of subCategories) {
  //     const doc = await payload.create({
  //       collection: 'categories',
  //       locale: 'ka',
  //       data: { name: sub.ka, parent: PARENT_ID } as any,
  //     })

  //     await payload.update({
  //       collection: 'categories',
  //       id: doc.id,
  //       locale: 'en',
  //       data: { name: sub.en } as any,
  //     })
  //   }
  //   console.log('✅ Fire Alarm Systems-ის შვილები დაემატა!')
  // },

  // onInit: async (payload) => {
  //   console.log('🔄 ვიწყებ სლაგების განახლებას...')

  //   const categoriesRes = await payload.find({
  //     collection: 'categories',
  //     limit: 500, // ავიღოთ ყველა კატეგორია
  //     locale: 'all' as any, // საჭიროა, რომ ლოკალიზებული 'name' სრულად დავინახოთ
  //   })

  //   const slugify = (await import('slugify')).default

  //   for (const cat of categoriesRes.docs as any) {
  //     // თუ სლაგი უკვე არსებობს, გამოვტოვოთ
  //     if (cat.slug) continue

  //     // ამოვიღოთ ტექსტი სლაგისთვის: ჯერ ვეძებთ ინგლისურ სახელს, თუ არაა - ქართულს
  //     const categoryName = typeof cat.name === 'object' ? cat.name.en || cat.name.ka : cat.name

  //     if (categoryName) {
  //       const newSlug = slugify(categoryName, { lower: true, strict: true })

  //       try {
  //         await payload.update({
  //           collection: 'categories',
  //           id: cat.id,
  //           // რადგან 'name' ლოკალიზებულია, update-ს უნდა ვუთხრათ რომელიმე ენის ლოკალი
  //           // თორემ ვალიდაცია ვერ პოულობს 'name' ველს
  //           locale: 'en',
  //           data: {
  //             slug: newSlug,
  //           },
  //         })
  //         console.log(`✅ განახლდა: ${categoryName} -> ${newSlug}`)
  //       } catch (error) {
  //         console.error(`❌ შეცდომა ${categoryName}-ზე:`)
  //       }
  //     }
  //   }
  //   console.log('🏁 სლაგების განახლება დასრულდა!')
  // },
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
