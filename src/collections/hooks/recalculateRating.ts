import { CollectionAfterChangeHook } from 'payload'

export const recalculateRating: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
  operation,
}) => {
  // მხოლოდ ახალ ჩანაწერზე ვიმუშაოთ
  if (operation !== 'create') return doc

  // ცალკე ფუნქცია, რომელიც ფონურ რეჟიმში იმუშავებს
  const runUpdate = async () => {
    try {
      const productId = typeof doc.product === 'object' ? doc.product.id : doc.product
      if (!productId) return

      // 1. მცირე პაუზა (100ms), რომ მთავარი ტრანზაქცია დასრულდეს
      await new Promise((resolve) => setTimeout(resolve, 100))

      // 2. ყველა რევიუს წამოღება
      const { docs: allReviews } = await payload.find({
        collection: 'reviews',
        depth: 0,
        where: { product: { equals: productId } },
      })

      if (allReviews.length === 0) return

      const total = allReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0)
      const average = parseFloat((total / allReviews.length).toFixed(1))

      // 3. პროდუქტის განახლება
      await payload.update({
        collection: 'products',
        id: productId,
        data: { rating: average },
        overrideAccess: true,
      })

      console.log(`✅ განახლდა: ${average}`)
    } catch (err) {
      console.error('❌ შეცდომა ფონურ განახლებაში:', err)
    }
  }

  // ვიძახებთ ფუნქციას AWAIT-ის გარეშე
  runUpdate()

  // მომენტალურად ვაბრუნებთ დოკუმენტს, რომ იუზერი არ დაელოდოს
  return doc
}
