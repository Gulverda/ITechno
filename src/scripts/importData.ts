import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dataDir = path.resolve(process.cwd(), 'newest')

const runImport = async () => {
  console.log('🏁 სკრიპტი დაიქოქა...')

  try {
    const payload = await getPayload({
      config: await config,
    })

    console.log('🚀 Payload დაკავშირებულია!')

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json') && f !== 'brands.json')

    for (const file of files) {
      const products = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'))

      for (const item of products) {
        try {
          const cleanSlug = item.slug
            .toLowerCase()
            .replace(/[^a-z0-9-/]/g, '-')
            .replace(/-+/g, '-')

          // 1. კატეგორია
          const catRes = await payload.find({
            collection: 'categories',
            where: { name: { equals: item.category } },
          })
          let categoryId =
            catRes.docs[0]?.id ||
            (
              await payload.create({
                collection: 'categories',
                data: { name: item.category },
              })
            ).id

          // 2. არსებული პროდუქტი
          const existingProduct = await payload.find({
            collection: 'products',
            where: { slug: { equals: cleanSlug } },
          })

          // 3. სურათის დამუშავება
          let mediaId: any = null
          if (item.image_url) {
            try {
              const response = await axios.get(item.image_url, {
                responseType: 'arraybuffer',
                timeout: 10000,
              })
              const media = await payload.create({
                collection: 'media',
                data: { alt: item.title.ka },
                file: {
                  data: Buffer.from(response.data),
                  name: `${cleanSlug}-${Date.now()}.jpg`,
                  mimetype: 'image/jpeg',
                  size: Buffer.from(response.data).byteLength,
                },
              })
              mediaId = media.id
            } catch (e) {
              if (existingProduct.docs.length > 0) {
                mediaId =
                  (existingProduct.docs[0] as any).mainImage?.id ||
                  (existingProduct.docs[0] as any).mainImage
              }
            }
          }

          // თუ სურათი სავალდებულოა და მაინც არ გვაქვს, გამოვტოვოთ
          if (!mediaId && !(existingProduct.docs[0] as any)?.mainImage) {
            console.warn(`⚠️ გამოტოვებულია (სურათი აკლია): ${item.slug}`)
            continue
          }

          // 4. ძირითადი მონაცემების შენახვა (ქართულად)
          const baseData = {
            title: item.title.ka,
            description: item.description?.ka || '',
            price: Number(item.price) || 0,
            slug: cleanSlug,
            category: categoryId,
            mainImage: mediaId,
            _status: 'published',
          }

          let docId
          if (existingProduct.docs.length > 0) {
            const doc = await payload.update({
              collection: 'products',
              id: existingProduct.docs[0].id,
              locale: 'ka',
              data: baseData,
              overrideAccess: true,
            })
            docId = doc.id
          } else {
            const doc = await payload.create({
              collection: 'products',
              locale: 'ka',
              data: baseData,
              overrideAccess: true,
            })
            docId = doc.id
          }

          // 5. ინგლისურის დამატება მხოლოდ იმ შემთხვევაში, თუ ის არსებობს JSON-ში
          if (item.title.en && item.title.en.trim() !== '') {
            await payload.update({
              collection: 'products',
              id: docId,
              locale: 'en',
              data: {
                title: item.title.en,
                description: item.description?.en || '',
              },
              overrideAccess: true,
            })
            console.log(`✅ წარმატება (KA+EN): ${item.title.ka}`)
          } else {
            console.log(`✅ წარმატება (მხოლოდ KA): ${item.title.ka}`)
          }
        } catch (err: any) {
          console.error(`❌ შეცდომა ${item.slug}-ზე:`, err.message)
        }
      }
    }
    console.log('🏁 იმპორტი მორჩა!')
    process.exit(0)
  } catch (error: any) {
    console.error('💥 კრიტიკული შეცდომა:', error.message)
    process.exit(1)
  }
}

runImport()
