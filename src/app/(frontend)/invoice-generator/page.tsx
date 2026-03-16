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

    // ჰედერი
    doc.setFontSize(20)
    doc.text('I-TECHNO - ინვოისი', 14, 20)
    doc.setFontSize(10)
    doc.text(`თარიღი: ${new Date().toLocaleDateString('ka-GE')}`, 14, 28)

    const tableData = selectedItems.map((item) => [
      String(item.title),
      String(item.quantity),
      `${item.price.toFixed(2)} GEL`,
      `${(item.price * item.quantity).toFixed(2)} GEL`,
    ])

    // ცხრილის გენერაცია - ფონტი Header-შიც და Body-შიც
    autoTable(doc, {
      startY: 35,
      head: [['პროდუქტი', 'რაოდ.', 'ფასი', 'ჯამი']],
      body: tableData,
      theme: 'striped',
      styles: { font: 'Sylfaen', fontStyle: 'normal' },
      headStyles: {
        fillColor: [31, 41, 55],
        font: 'Sylfaen',
        fontStyle: 'normal',
      },
    })

    // @ts-expect-error - finalY is added by autotable
    const finalY = doc.lastAutoTable.finalY + 10

    // შეჯამება
    doc.setFont('Sylfaen', 'normal')
    doc.setFontSize(11)
    doc.text(`ჯამი:`, 140, finalY)
    doc.text(`${subtotal.toFixed(2)} GEL`, 190, finalY, { align: 'right' })

    if (discount > 0) {
      doc.setTextColor(220, 38, 38)
      doc.text(`ფასდაკლება (${discount}%):`, 140, finalY + 7)
      doc.text(`- ${discountAmount.toFixed(2)} GEL`, 190, finalY + 7, { align: 'right' })
      doc.setTextColor(0, 0, 0)
    }

    doc.setFontSize(13)
    doc.text(`სულ გადასახდელი:`, 140, finalY + 16)
    doc.text(`${total.toFixed(2)} GEL`, 190, finalY + 16, { align: 'right' })

    // რეკვიზიტები
    doc.setFontSize(9)
    doc.text('საბანკო რეკვიზიტები:', 14, finalY + 35)
    doc.text('მიმღები: შპს აი-ტექნო (I-TECHNO LLC)', 14, finalY + 40)
    doc.text('ბანკი: თიბისი ბანკი', 14, finalY + 45)
    doc.text('IBAN: GE00TB0000000000000000', 14, finalY + 50)

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
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
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
                <span className="text-blue-600 font-bold">{p.price} GEL</span>
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
              className={`px-5 py-2 rounded-lg font-bold transition-all ${discount === val ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setDiscount(val)}
            >
              {val}%
            </button>
          ))}
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold mb-1">სულ გადასახდელი</p>
          <p className="text-4xl font-black text-blue-600">{total.toFixed(2)} GEL</p>
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
