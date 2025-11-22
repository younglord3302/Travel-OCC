import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag,
  Shirt,
  Headphones,
  Home,
  Laptop,
  Gamepad,
  Camera,
  Smartphone,
  ChevronRight
} from 'lucide-react'

export async function generateMetadata() {
  return {
    title: 'Categories | E-Store',
    description: 'Browse our product categories',
  }
}

// Category icon mapping
const getCategoryIcon = (name: string) => {
  const iconClass = 'h-8 w-8 text-primary'
  const categories: Record<string, React.ReactNode> = {
    'electronics': <Smartphone className={iconClass} />,
    'clothing': <Shirt className={iconClass} />,
    'home': <Home className={iconClass} />,
    'computers': <Laptop className={iconClass} />,
    'gaming': <Gamepad className={iconClass} />,
    'audio': <Headphones className={iconClass} />,
    'cameras': <Camera className={iconClass} />,
  }

  return categories[name.toLowerCase()] || <ShoppingBag className={iconClass} />
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Shop by Category
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Discover our curated collection of premium products across different categories.
              Find exactly what you're looking for with our organized catalog.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                1000+ Products
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Free Shipping
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Quality Assured
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're working hard to bring you the best product categories.
              Check back soon for new additions!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const isFeatured = index < 2 // Feature first 2 categories

              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-2 ${
                      isFeatured
                        ? 'relative border-primary/20 hover:border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                          {getCategoryIcon(category.name)}
                        </div>
                        {isFeatured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Click to explore
                          </p>
                          <p className="text-xs text-primary font-semibold">
                            View Collection →
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {categories.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 bg-secondary/50 px-6 py-3 rounded-full border">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Can't find what you're looking for?
              </span>
              <Link
                href="/search"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Search All Products →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
