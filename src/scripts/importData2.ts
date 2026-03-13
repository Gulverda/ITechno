import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

/**
 * ეს სკრიპტი კითხულობს final_products.json-ს და აახლებს
 * პროდუქტების სპეციფიკაციებს (specifications_group) Slug-ის მიხედვით.
 */
const updateFinalSpecs = async () => {
  const payload = await getPayload({ config: await config })

  // მივუთითებთ თქვენს ახალ JSON ფაილს
  const filePath = path.resolve(process.cwd(), 'categorised/final_products.json')

  if (!fs.existsSync(filePath)) {
    console.error(`❌ ფაილი ვერ მოიძებნა: ${filePath}`)
    process.exit(1)
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const productsToUpdate = JSON.parse(rawData)

  console.log(`🚀 იწყება ${productsToUpdate.length} პროდუქტის მონაცემების დამუშავება...`)

  let updatedCount = 0
  let errorCount = 0

  for (const item of productsToUpdate) {
    try {
      // ვეძებთ პროდუქტს Slug-ის მიხედვით
      const result = await payload.find({
        collection: 'products',
        where: {
          slug: { equals: item.slug },
        },
      })

      if (result.docs.length > 0) {
        const product = result.docs[0]

        // ვაახლებთ მხოლოდ specifications_group-ს
        // თუ JSON-ში სხვა ველებიც გაქვს და მათი განახლებაც გინდა, უბრალოდ ჩაამატე data-ში
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            specifications_group: item.specifications_group,
            // მაგალითად, თუ ფასის განახლებაც გინდა:
            // price: item.price
          },
        })

        const title = item.title?.ka || item.slug
        console.log(`✅ განახლდა: ${title.substring(0, 40)}...`)
        updatedCount++
      } else {
        console.warn(`❓ Slug ბაზაში ვერ მოიძებნა: ${item.slug}`)
        errorCount++
      }
    } catch (err: any) {
      console.error(`❌ შეცდომა პროდუქტზე [${item.slug}]:`, err.message)
      errorCount++
    }
  }

  console.log('\n--- 🏁 დასრულდა ---')
  console.log(`✅ წარმატებით განახლდა: ${updatedCount}`)
  console.log(`⚠️ ვერ მოიძებნა/შეცდომა: ${errorCount}`)

  process.exit(0)
}

updateFinalSpecs()
