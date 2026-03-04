import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dataDir = path.resolve(process.cwd(), 'newest')
const imageDir = path.resolve(process.cwd(), 'imagedData') // გალერეის ფოლდერი

const runImport = async () => {
  console.log('🏁 სკრიპტი დაიქოქა...')

  try {
    const payload = await getPayload({
      config: await config,
    })

    console.log('🚀 Payload დაკავშირებულია!')

    // --- გალერეის ინდექსირება (slug -> images[]) ---
    const galleryMap: Record<string, string[]> = {}
    if (fs.existsSync(imageDir)) {
      const galleryFiles = fs.readdirSync(imageDir).filter((f) => f.endsWith('.json'))
      for (const file of galleryFiles) {
        const galleryData = JSON.parse(fs.readFileSync(path.join(imageDir, file), 'utf-8'))
        galleryData.forEach((item: any) => {
          if (item.slug && item.images) {
            galleryMap[item.slug] = item.images
          }
        })
      }
    }

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

          // 3. სურათების დამუშავების ფუნქცია (რომ გალერეისთვისაც გამოვიყენოთ)
          const uploadImg = async (url: string, alt: string) => {
            try {
              const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 })
              const media = await payload.create({
                collection: 'media',
                data: { alt },
                file: {
                  data: Buffer.from(res.data),
                  name: `${cleanSlug}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`,
                  mimetype: 'image/jpeg',
                  size: Buffer.from(res.data).byteLength,
                },
              })
              return media.id
            } catch (e) {
              return null
            }
          }

          // მთავარი სურათი
          let mediaId: any = null
          if (item.image_url) {
            mediaId = await uploadImg(item.image_url, item.title.ka)
          }

          if (!mediaId && existingProduct.docs.length > 0) {
            mediaId =
              (existingProduct.docs[0] as any).mainImage?.id ||
              (existingProduct.docs[0] as any).mainImage
          }

          // 🛑 თუ მთავარი სურათი ან კატეგორია მაინც არაა, გამოვტოვოთ (Payload Error-ს აგდებს ამაზე)
          if (!mediaId || !categoryId) {
            console.warn(`⚠️ გამოტოვებულია (Main Image/Category აკლია): ${item.slug}`)
            continue
          }

          // 4. გალერეის სურათების დამუშავება
          let galleryIds: any[] = []
          if (galleryMap[item.slug]) {
            console.log(`📸 გალერეა: ${galleryMap[item.slug].length} ფოტო - ${item.slug}`)
            for (const imgUrl of galleryMap[item.slug]) {
              const gId = await uploadImg(imgUrl, `${item.title.ka} gallery`)
              if (gId) galleryIds.push({ image: gId }) // სტრუქტურა შენი სქემის მიხედვით
            }
          }

          // 5. ძირითადი მონაცემების შენახვა
          const baseData: any = {
            title: item.title.ka,
            description: item.description?.ka || '',
            price: Number(item.price) || 0,
            slug: cleanSlug,
            category: categoryId,
            mainImage: mediaId,
            images: galleryIds, // გალერეა აქ ემატება
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

          // 6. ინგლისური ვერსია
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
          }
          console.log(`✅ წარმატება: ${item.title.ka}`)
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
