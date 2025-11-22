"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Star, ShoppingBag, Shield, Truck, Sparkles, Zap, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt?: string }[];
  averageRating: number;
  reviewCount: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch featured products (first 6 products from API)
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const products = await response.json();
          setFeaturedProducts(products.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: "Premium Quality",
      description: "Handpicked products from world-renowned brands",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Express shipping with real-time tracking worldwide",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      icon: Shield,
      title: "100% Secure Payments",
      description: "Bank-level security with advanced encryption",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    }
  ];

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      emoji: '💻',
      color: 'from-orange-400 to-red-500',
      description: 'Cutting-edge tech & gadgets'
    },
    {
      name: 'Fashion & Style',
      slug: 'clothing',
      emoji: '👗',
      color: 'from-pink-500 to-rose-500',
      description: 'Trendy apparel & accessories'
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      emoji: '🏡',
      color: 'from-green-500 to-teal-600',
      description: 'Beautiful home essentials'
    },
    {
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      emoji: '💪',
      color: 'from-blue-500 to-indigo-600',
      description: 'Active lifestyle products'
    },
    {
      name: 'Beauty & Wellness',
      slug: 'beauty-personal-care',
      emoji: '✨',
      color: 'from-purple-600 to-violet-700',
      description: 'Premium care & cosmetics'
    },
    {
      name: 'Toys & Entertainment',
      slug: 'toys-games',
      emoji: '🎮',
      color: 'from-yellow-400 to-orange-500',
      description: 'Fun for all ages'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full px-4 py-2 mb-6 border border-purple-200 dark:border-purple-700">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">✨ New Premium Collection Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent leading-tight animate-fade-in-up">
              Discover Amazing
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Products
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Explore our stunning collection of premium products.
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Free shipping worldwide • 30-day returns • Customer-first
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/products">
                <Button size="lg" className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Shop Amazing Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="px-12 py-4 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 font-semibold text-lg rounded-full transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                  <Gift className="mr-2 h-5 w-5" />
                  Explore Categories
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Handpicked premium products loved by our customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    <Image
                      src={product.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop'}
                      alt={product.images[0]?.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30">
                      <Heart className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Why Choose Luxury?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Experience the difference with premium service and quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`text-center p-8 rounded-3xl ${feature.bgColor} border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-500`}>
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="h-10 w-10 text-white shadow-sm" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover amazing products across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/categories/${category.slug}`}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className={`absolute top-6 right-6 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                  {category.emoji}
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{category.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                  <span>Explore Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-12 h-1 bg-white rounded-full"></div>
            <h2 className="text-4xl font-bold text-white">Trusted by Thousands</h2>
            <div className="w-12 h-1 bg-white rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4 animate-pulse">50K+</div>
              <div className="text-xl text-white/80">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4 animate-pulse">25K+</div>
              <div className="text-xl text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4 animate-pulse">99%</div>
              <div className="text-xl text-white/80">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                4.9
                <Star className="h-8 w-8 fill-current" />
              </div>
              <div className="text-xl text-white/80">Average Rating</div>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/products">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Start Shopping Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
