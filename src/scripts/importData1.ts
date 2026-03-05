import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dataDir = path.resolve(process.cwd(), 'newest')
const imageDir = path.resolve(process.cwd(), 'imagedData')

const runImport = async () => {
  console.log('🧹 ბაზის გასუფთავება და იმპორტი ნულიდან...')

  try {
    const payload = await getPayload({ config: await config })

    await payload.delete({ collection: 'products', where: { id: { exists: true } } })
    await payload.delete({ collection: 'categories', where: { id: { exists: true } } })
    await payload.delete({ collection: 'media', where: { id: { exists: true } } })
    console.log('✨ ბაზა გასუფთავდა.')

    const galleryMap: Record<string, string[]> = {}
    if (fs.existsSync(imageDir)) {
      const galleryFiles = fs.readdirSync(imageDir).filter((f) => f.endsWith('.json'))
      for (const file of galleryFiles) {
        const galleryData = JSON.parse(fs.readFileSync(path.join(imageDir, file), 'utf-8'))
        galleryData.forEach((item: any) => {
          if (item.slug && item.images) galleryMap[item.slug] = item.images
        })
      }
    }

    const uploadImg = async (url: string, alt: string, slug: string) => {
      try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 })
        const media = await payload.create({
          collection: 'media',
          data: { alt: alt.substring(0, 100) },
          file: {
            data: Buffer.from(res.data),
            name: `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`,
            mimetype: 'image/jpeg',
            size: Buffer.from(res.data).byteLength,
          },
        })
        return media.id
      } catch (e) {
        return null
      }
    }

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json') && f !== 'brands.json')

    for (const file of files) {
      const categoryName = path.parse(file).name
      console.log(`📂 კატეგორია: ${categoryName}`)

      const category = await payload.create({
        collection: 'categories',
        data: { name: categoryName },
      })
      const categoryId = category.id

      const products = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'))

      for (const item of products) {
        try {
          const cleanSlug = item.slug
            .toLowerCase()
            .replace(/[^a-z0-9-/]/g, '-')
            .replace(/-+/g, '-')

          let galleryIds: any[] = []
          let firstMediaId: any = null

          if (galleryMap[item.slug] && galleryMap[item.slug].length > 0) {
            for (const imgUrl of galleryMap[item.slug]) {
              const uploadedId = await uploadImg(imgUrl, item.title.ka, cleanSlug)
              if (uploadedId) {
                galleryIds.push({ image: uploadedId })
                if (!firstMediaId) firstMediaId = uploadedId
              }
            }
          }

          if (!firstMediaId && item.image_url) {
            firstMediaId = await uploadImg(item.image_url, item.title.ka, cleanSlug)
          }

          if (!firstMediaId) continue

          const newProduct = await payload.create({
            collection: 'products',
            locale: 'ka',
            data: {
              title: item.title.ka,
              description: item.description?.ka || '',
              price: Number(item.price) || 0,
              slug: cleanSlug,
              category: categoryId,
              mainImage: firstMediaId,
              images: galleryIds,
              stock: 'in-stock',
              rating: 5,
            },
          })

          if (item.title.en && item.title.en.trim() !== '') {
            await payload.update({
              collection: 'products',
              id: newProduct.id,
              locale: 'en',
              data: {
                title: item.title.en,
                description: item.description?.en || '',
                stock: 'in-stock',
              },
            })
          }
          console.log(`✅ ${item.title.ka} აიტვირთა.`)
        } catch (err: any) {
          console.error(`❌ შეცდომა ${item.slug}-ზე:`, err.message)
        }
      }
    }
    console.log('🏁 იმპორტი დასრულდა! ბაზა ახალია და სუფთა.')
    process.exit(0)
  } catch (error: any) {
    console.error('💥 კრიტიკული შეცდომა:', error.message)
    process.exit(1)
  }
}

runImport()
