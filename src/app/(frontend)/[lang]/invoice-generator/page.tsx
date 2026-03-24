'use client'
import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useDebounce } from 'use-debounce'
import { Product } from '@/payload-types'
import { georgianFontBase64 } from '@/assets/fonts/georgian-font'

// ინტერფეისი - ID ტიპების კონფლიქტის მოსაგვარებლად
interface SelectedProduct {
  id: string | number
  title: string
  price: number
  quantity: number
}

export default function InvoiceGenerator() {
  const [text, setText] = useState('')
  const [query] = useDebounce(text, 500)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([])
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (query.length > 2) {
      fetch(`/api/products?where[title][contains]=${query}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.docs) setProducts(data.docs)
        })
        .catch((err) => console.error('Search error:', err))
    } else {
      setProducts([])
    }
  }, [query])

  const addItem = (product: Product) => {
    // Payload-ის ლოკალიზებული ველის უსაფრთხო ამოღება
    const titleString =
      typeof product.title === 'object' && product.title !== null
        ? (product.title as Record<string, string>).ka ||
          (product.title as Record<string, string>).en ||
          ''
        : String(product.title || '')

    // ID-ების შედარება სტრინგებში ტიპების overlap-ის შეცდომის ასაცილებლად
    const exists = selectedItems.find((item) => String(item.id) === String(product.id))

    if (exists) {
      setSelectedItems(
        selectedItems.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      )
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: product.id,
          title: titleString,
          price: product.price,
          quantity: 1,
        },
      ])
    }
    setText('')
    setProducts([])
  }

  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount

  const generatePDF = () => {
    const doc = new jsPDF()

    // ფონტის რეგისტრაცია
    doc.addFileToVFS('Sylfaen.ttf', georgianFontBase64)
    doc.addFont('Sylfaen.ttf', 'Sylfaen', 'normal')
    doc.setFont('Sylfaen', 'normal')

    // მთავარი ფერები
    const themeColor: [number, number, number] = [25, 118, 186]
    const textColor: [number, number, number] = [50, 50, 50]
    const lightText: [number, number, number] = [100, 100, 100]
    const today = new Date().toLocaleDateString('ka-GE')

    // ==========================================
    // 1. ჰედერი: კომპანიის ინფო (მარცხნივ ზემოთ)
    // ==========================================
    doc.setFontSize(14)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text('შპს აი-ტექნო (I-TECHNO LLC)', 14, 20)

    // ==========================================
    // 2. მარჯვენა ზედა კუთხე: ინვოისი + თარიღი
    // ==========================================
    doc.setFontSize(26)
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2])
    doc.text('ინვოისი', 196, 20, { align: 'right' })

    doc.setFontSize(12)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text(`თარიღი: ${today}`, 196, 28, { align: 'right' })

    // ==========================================
    // 3. მისამართის ბლოკი
    // ==========================================
    doc.setFontSize(10)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('თქვენი მისამართი', 14, 28)
    doc.text('ქალაქი, ინდექსი', 14, 33)
    // ==========================================
    // 3. ვის ეგზავნება (მარცხნივ შუაში)
    // ==========================================
    doc.setFontSize(10)
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2])
    doc.text('ადრესატი', 14, 60)

    doc.setFontSize(12)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text('კლიენტის სახელი', 14, 67) // აქ ჩასვი კლიენტის ცვლადი

    doc.setFontSize(10)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('კლიენტის მისამართი', 14, 73)
    doc.text('ქალაქი, ინდექსი', 14, 78)

    // ==========================================
    // 4. ინვოისის დეტალები (მარჯვნივ შუაში)
    // ==========================================
    const valueX = 196

    doc.setFontSize(10)

    // ==========================================
    // 5. ცხრილი (შეცვლილი სვეტების მიმდევრობით ფოტოს მიხედვით)
    // ==========================================
    const tableData = selectedItems.map((item) => [
      String(item.quantity), // QTY არის პირველი
      String(item.title),
      `${item.price.toFixed(2)}`,
      `${(item.price * item.quantity).toFixed(2)} ₾ GEL`, // GEL-ის ნაცვლად $-ით, ან შეცვალე GEL-ით
    ])

    autoTable(doc, {
      startY: 95,
      head: [['რაოდ.', 'აღწერა', 'საცალო ფასი', 'ჯამი']],
      body: tableData,
      theme: 'plain', // ვიყენებთ plain-ს, რათა ზედმეტი ხაზები არ დახატოს
      styles: {
        font: 'Sylfaen',
        fontSize: 10,
        textColor: textColor,
        cellPadding: { top: 4, right: 2, bottom: 4, left: 2 },
      },
      headStyles: {
        fillColor: themeColor,
        textColor: [255, 255, 255],
        fontStyle: 'normal',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'left' },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 },
      },
    })

    // @ts-expect-error - finalY is added by autotable
    let currentY = doc.lastAutoTable.finalY

    // ცხრილის ქვედა გამყოფი ხაზი ლურჯ ფერში (როგორც ფოტოზეა)
    doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2])
    doc.setLineWidth(0.4)
    doc.line(14, currentY, 196, currentY)

    currentY += 8

    // ==========================================
    // 6. ჯამი (მარჯვენა მხარეს ცხრილის ქვეშ)
    // ==========================================
    const totalsLabelX = 140

    doc.setFontSize(10)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Subtotal
    doc.text('ჯამი', totalsLabelX, currentY)
    doc.text(`${subtotal.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })

    // ფასდაკლება (თუ არის)
    if (discount > 0) {
      currentY += 8
      doc.setTextColor(220, 38, 38)
      doc.text(`ფასდაკლება (${discount}%):`, totalsLabelX, currentY)
      doc.text(`- ${discountAmount.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
    }

    // Total-ის ზედა ხაზი (ღია ნაცრისფერი)
    currentY += 4
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(totalsLabelX, currentY, valueX, currentY)

    currentY += 7

    // Total (ლურჯ ფერში)
    doc.setFontSize(11)
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2])
    doc.text('სულ (GEL)', totalsLabelX, currentY)
    doc.text(`${total.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })

    // Total-ის ქვედა ხაზი (ლურჯი ფერის)
    currentY += 3
    doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2])
    doc.setLineWidth(0.5)
    doc.line(totalsLabelX, currentY, valueX, currentY)

    // ==========================================
    // 7. რეკვიზიტები / პირობები (ბოლოში მარცხნივ)
    // ==========================================
    currentY += 25
    doc.setFontSize(11)
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2])
    doc.text('საბანკო რეკვიზიტები:', 14, currentY)

    currentY += 6
    doc.setFontSize(10)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('მიმღები: შპს აი-ტექნო (I-TECHNO LLC)', 14, currentY)

    currentY += 5
    doc.text('ბანკი: თიბისი ბანკი', 14, currentY)
    currentY += 5
    doc.text('IBAN: GE00TB0000000000000000', 14, currentY)

    doc.save(`Invoice_${new Date().getTime()}.pdf`)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-xl rounded-2xl my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4 font-sans">
        ინვოისის გენერატორი
      </h1>

      <div className="relative mb-10">
        <label className="block text-sm text-gray-600 mb-2 font-bold">პროდუქტის ძებნა</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="მოძებნე პროდუქტი..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1976BA] shadow-sm transition-all"
        />
        {products.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-100 mt-2 shadow-2xl z-50 rounded-xl overflow-hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                onClick={() => addItem(p)}
              >
                <span className="font-semibold text-gray-700">
                  {typeof p.title === 'object' ? (p.title as any).ka : p.title}
                </span>
                <span className="text-[#1976BA] font-bold">{p.price} GEL</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItems.length > 0 ? (
        <div className="overflow-x-auto mb-8 border rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">პროდუქტი</th>
                <th className="p-4 text-center">რაოდენობა</th>
                <th className="p-4 text-right">ჯამი</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {selectedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">{item.title}</td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1
                        setSelectedItems(
                          selectedItems.map((si) =>
                            si.id === item.id ? { ...si, quantity: val } : si,
                          ),
                        )
                      }}
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} GEL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl mb-8 border-2 border-dashed border-gray-200 text-gray-400">
          სია ცარიელია
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-2 flex-wrap justify-center">
          {[0, 10, 15, 20, 50].map((val) => (
            <button
              key={val}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${discount === val ? 'bg-[#1976BA] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setDiscount(val)}
            >
              {val}%
            </button>
          ))}
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold mb-1">სულ გადასახდელი</p>
          <p className="text-4xl font-black text-[#1976BA]">{total.toFixed(2)} GEL</p>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="w-full mt-10 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-95"
      >
        ჩამოტვირთე PDF ინვოისი
      </button>
    </div>
  )
}
