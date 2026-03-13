import { getPayload } from 'payload'
import config from '../payload.config'

const fixGeorgianSlugs = async () => {
  const payload = await getPayload({ config })

  // 1. წამოვიღოთ ყველა პროდუქტი (ინგლისური ლოკალით, რომ title.en ხელმისაწვდომი იყოს)
  const products = await payload.find({
    collection: 'products',
    limit: 10000,
    locale: 'en',
  })

  console.log(`ნაპოვნია ${products.docs.length} პროდუქტი. ვიწყებ ქართული სლაგების შემოწმებას...`)

  // რეგულარული გამოსახულება ქართული ასოების აღმოსაჩენად
  const georgianRegex = /[ა-ჰ]/

  for (const product of products.docs) {
    const currentSlug = (product as any).slug || ''

    // ვამოწმებთ, შეიცავს თუ არა სლაგი ქართულ ასოებს
    if (georgianRegex.test(currentSlug)) {
      console.log(`🔍 აღმოჩენილია ქართული სლაგი: "${currentSlug}" (ID: ${product.id})`)

      // ვაგენერირებთ ახალ სლაგს ინგლისური სათაურიდან
      let newSlug = product.title
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')

      // თუ ინგლისური სათაური არ აქვს, დროებით ID-ს დავარქმევთ, რომ უნიკალურობა არ დაირღვეს
      if (!newSlug) {
        newSlug = `product-${product.id}`
      }

      try {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            slug: newSlug,
          },
        })
        console.log(`✅ შეიცვალა ახლით: "${newSlug}"`)
      } catch (e) {
        // თუ სლაგი უკვე არსებობს, ვამატებთ რანდომ ციფრს
        const fallbackSlug = `${newSlug}-${Math.floor(Math.random() * 1000)}`
        await payload.update({
          collection: 'products',
          id: product.id,
          data: { slug: fallbackSlug },
        })
        console.log(`⚠️ დუბლიკატია, გამოყენდა: "${fallbackSlug}"`)
      }
    }
  }

  console.log('🎉 ქართული სლაგების გასუფთავება დასრულდა!')
  process.exit(0)
}

fixGeorgianSlugs()
