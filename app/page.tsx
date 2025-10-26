import HomeContentServer from './components/HomeContentServer'

async function getProducts() {
  try {
    // In server component, use internal API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/products`, {
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