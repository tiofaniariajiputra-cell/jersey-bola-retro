import { prisma } from '@/backend/utils/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      sizes: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Koleksi Jersey Retro
              </h1>
              <p className="text-gray-600">
                Temukan jersey klasik favorit Anda dari berbagai klub legendaris
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Produk</p>
              <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-gray-700">Filter Kategori:</span>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className={`px-5 py-2 rounded-lg font-medium transition ${
                    !category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`px-5 py-2 rounded-lg font-medium transition ${
                      category === cat.slug
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-gray-500 text-lg mb-6">
              {category ? 'Tidak ada produk dalam kategori ini.' : 'Belum ada produk tersedia.'}
            </p>
            {!category && (
              <form action="/api/seed" method="POST">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
                >
                  Seed Database
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => {
              const primaryImage = product.images[0]
              const totalStock = product.sizes.reduce((sum: number, size: any) => sum + size.stock, 0)

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Image Container */}
                  <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-6xl">
                        ⚽
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                      {product.category.name}
                    </div>

                    {/* Stock Warning Badge */}
                    {totalStock === 0 ? (
                      <div className="absolute top-3 left-3 bg-red-500 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
                        Stok Habis
                      </div>
                    ) : totalStock < 10 ? (
                      <div className="absolute top-3 left-3 bg-orange-500 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
                        Stok Terbatas
                      </div>
                    ) : null}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition min-h-[3.5rem]">
                      {product.name}
                    </h3>

                    {/* Club & Season */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600">⚽</span>
                        <span className="font-medium">{product.club}</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600">📅</span>
                        <span>{product.season}</span>
                      </span>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-end justify-between mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Harga</p>
                        <p className="text-2xl font-extrabold text-blue-600">
                          Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Stok</p>
                        <p className={`text-lg font-bold ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalStock}
                        </p>
                      </div>
                    </div>

                    {/* Available Sizes */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Ukuran Tersedia
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes
                          .sort((a: any, b: any) => {
                            const order = ['S', 'M', 'L', 'XL', 'XXL']
                            return order.indexOf(a.size) - order.indexOf(b.size)
                          })
                          .map((size: any) => (
                            <span
                              key={size.id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition ${
                                size.stock > 0
                                  ? 'bg-green-50 border-green-500 text-green-700'
                                  : 'bg-gray-50 border-gray-300 text-gray-400 line-through'
                              }`}
                            >
                              {size.size}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Hover Action */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                        <span>Lihat Detail</span>
                        <span className="ml-2 transform group-hover:translate-x-1 transition">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
