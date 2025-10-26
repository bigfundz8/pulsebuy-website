'use client'

import { useEffect, useState } from 'react'
import HomeContentServer from './components/HomeContentServer'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(err => console.error('Error fetching products:', err))
  }, [])

  return <HomeContentServer products={products} />
}