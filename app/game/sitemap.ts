import { prisma } from "@/prisma"

export default async function sitemap() {
  const products = await prisma.game.findMany({
    select: {id: true, updatedAt: true}
  })
  
  return products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/game/${product.id}`,
    lastModified: product.updatedAt,
  }))
}
