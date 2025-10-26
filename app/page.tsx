import HomeContentServer from './components/HomeContentServer'

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/products`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    const data = await res.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()
  return <HomeContentServer products={products} />
}