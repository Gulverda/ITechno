import React from 'react'
import { Camera, ShieldAlert, Key, Cpu, Network, ChevronRight } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'ვიდეოსამეთვალყურეო სისტემები',
    icon: <Camera className="w-8 h-8 text-blue-500" />,
    description:
      'შპს აიტეჩნო უზრუნველყოფს ვიდეოსამეთვალყურეო სისტემების სრულ პროექტირებას, მიწოდებასა და ინსტალაციას. ჩვენ ვმუშაობთ საერთაშორისო ლიდერ ბრენდებთან, მათ შორის: Hikvision, Hiwatch, EZVIZ. ვახორციელებთ როგორც მცირე ობიექტების, ასევე ფართომასშტაბიანი სისტემების დანერგვას. თითოეული პროექტი იგეგმება ინდივიდუალურად, კამერების სწორი განლაგებით, ოპტიმალური ხედვის კუთხით და უსაფრთხოების სტანდარტების სრული დაცვით. სისტემა უზრუნველყოფს დისტანციურ მონიტორინგს, არქივაციას და სტაბილურ მუშაობას.',
    brands: ['Hikvision', 'Hiwatch', 'EZVIZ'],
  },
  {
    id: 2,
    title: 'სახანძრო სიგნალიზაცია',
    icon: <ShieldAlert className="w-8 h-8 text-blue-500" />,
    description:
      'ჩვენ ვახორციელებთ სახანძრო სიგნალიზაციის სისტემების პროექტირებასა და მონტაჟს მოქმედი ტექნიკური მოთხოვნების შესაბამისად. სისტემა უზრუნველყოფს კვამლისა და ცეცხლის დროულ აღმოჩენას, ხმოვან და ვიზუალურ გაფრთხილებას და ცენტრალიზებულ კონტროლს. ჩვენი გუნდი უზრუნველყოფს სისტემის სწორ კონფიგურაციას, ტესტირებას და შემდგომ ტექნიკურ მხარდაჭერას.',
    features: ['კვამლის აღმოჩენა', 'ვიზუალური გაფრთხილება', 'ცენტრალიზებული კონტროლი'],
  },
  {
    id: 3,
    title: 'დაშვების კონტროლის სისტემა',
    icon: <Key className="w-8 h-8 text-blue-500" />,
    description:
      'დაშვების კონტროლის სისტემა საშუალებას გაძლევთ მართოთ, აკონტროლოთ და შეზღუდოთ წვდომა კონკრეტულ სივრცეებზე. ჩვენ ვახორციელებთ ბარათის სისტემებს, ბიომეტრიულ სისტემებს, ელექტრო საკეტების ინტეგრაციას და ანგარიშგების და ლოგირების სისტემების კონფიგურაციას. სისტემა ინტეგრირდება ვიდეოსამეთვალყურეო და სხვა უსაფრთხოების გადაწყვეტილებებთან.',
    features: ['ბიომეტრია', 'ბარათის სისტემები', 'ელექტრო საკეტები'],
  },
  {
    id: 4,
    title: 'სმარტ სისტემების ინტეგრირება',
    icon: <Cpu className="w-8 h-8 text-blue-500" />,
    description:
      'ვახორციელებთ სმარტ სისტემების ინტეგრაციას, რომელიც აერთიანებს ვიდეოსამეთვალყურეო, დაშვების კონტროლის და სხვა ტექნოლოგიურ გადაწყვეტილებებს ერთიან პლატფორმაში. სისტემა უზრუნველყოფს დისტანციურ მართვას, მობილურ წვდომას და ავტომატიზირებულ სცენარებს.',
    features: ['დისტანციური მართვა', 'ავტომატიზირებული სცენარები'],
  },
  {
    id: 5,
    title: 'კომპიუტერული ქსელები',
    icon: <Network className="w-8 h-8 text-blue-500" />,
    description:
      'უსაფრთხოების ნებისმიერი სისტემა საჭიროებს ხარისხიან ქსელურ ინფრასტრუქტურას. ჩვენ ვახორციელებთ სტრუქტურირებული კაბელირების დაგეგმვას, ქსელური მოწყობილობების მონტაჟს, სერვერული სივრცის ორგანიზებას და ოპტიმალურ ქსელურ კონფიგურაციას. სწორად დაგეგმილი ქსელი უზრუნველყოფს სისტემების სტაბილურ და უწყვეტ მუშაობას.',
    features: ['კაბელირება', 'სერვერული მოწყობა', 'ქსელის კონფიგურაცია'],
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-[#0a2540] py-20 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider">
            ჩვენი სერვისები
          </h1>
          <div className="w-20 h-1 bg-blue-500 mb-6"></div>
          <p className="max-w-2xl text-gray-300 text-lg">
            პროფესიონალური გადაწყვეტილებები უსაფრთხოების სფეროში. ჩვენ გთავაზობთ სრულ ტექნოლოგიურ
            მხარდაჭერას პროექტირებიდან მონტაჟამდე.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col md:flex-row gap-8 items-start p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Icon & Title Area */}
              <div className="md:w-1/3 w-full">
                <div className="mb-4 p-4 bg-gray-50 rounded-xl inline-block">{service.icon}</div>
                <h2 className="text-2xl font-bold text-[#0a2540] mb-4">{service.title}</h2>
                {service.brands && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.brands.map((brand) => (
                      <span
                        key={brand}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Area */}
              <div className="md:w-2/3 w-full">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">{service.description}</p>

                {service.features && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <ChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-[#0a2540] mb-6">
            უსაფრთხოება, რომელსაც შეგიძლიათ ენდოთ
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold transition-colors">
            დაგვიკავშირდით კონსულტაციისთვის
          </button>
        </div>
      </section>
    </div>
  )
}
