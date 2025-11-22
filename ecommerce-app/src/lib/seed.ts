import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  try {
    // Create sample user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10)

    await prisma.user.createMany({
      data: [
        {
          email: 'admin@example.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
        {
          email: 'customer@example.com',
          name: 'Customer User',
          password: hashedPassword,
          role: 'CUSTOMER',
        }
      ]
    })

    // Get users
    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } })
    const customer = await prisma.user.findUnique({ where: { email: 'customer@example.com' } })
    if (!admin || !customer) return

    // Create categories
    await prisma.category.createMany({
      data: [
        { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices' },
        { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel for everyone' },
        { name: 'Books', slug: 'books', description: 'Fiction, non-fiction, and educational books' },
        { name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home and garden' },
      ]
    })

    // Get categories
    const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } })
    const clothing = await prisma.category.findUnique({ where: { slug: 'clothing' } })
    const books = await prisma.category.findUnique({ where: { slug: 'books' } })
    const homeGarden = await prisma.category.findUnique({ where: { slug: 'home-garden' } })
    if (!electronics || !clothing || !books || !homeGarden) return

    // Create sample products - expanded catalog
    const productsData = [
      // Electronics
      ['Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation and premium sound', 2999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'],
      ['Smartphone 256GB', 'Latest smartphone with advanced camera system and 5G connectivity', 45999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'],
      ['Gaming Laptop 16GB RAM', 'Powerful gaming laptop with RTX graphics and SSD storage', 89999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop'],
      ['Smart Watch Series 5', 'Feature-packed smartwatch with health monitoring and GPS', 15999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
      ['Wireless Router Mesh', 'High-speed mesh WiFi router for whole home coverage', 12999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'],
      ['Bluetooth Speaker Portable', 'Waterproof portable speaker with deep bass and long battery life', 3999, 'PHYSICAL', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'],

      // Clothing
      ['Cotton T-Shirt', 'Comfortable 100% cotton t-shirt available in multiple colors', 599, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'],
      ['Classic Denim Jeans', 'High-quality denim jeans with perfect fit and durability', 2499, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop'],
      ['Hooded Sweatshirt', 'Warm and cozy hooded sweatshirt for cold weather', 1499, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop'],
      ['Sports Running Shoes', 'Lightweight running shoes with breathable mesh upper', 3599, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop'],
      ['Winter Jacket', 'Padded winter jacket with waterproof coating', 4999, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
      ['Casual Sneakers', 'Stylish casual sneakers perfect for everyday wear', 1999, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop'],
      ['Designer Handbag', 'Elegant leather handbag with gold accessories', 7999, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop'],
      ['Silk Scarf', 'Premium silk scarf in beautiful patterns', 1299, 'PHYSICAL', 'ACTIVE', clothing.id, 'https://images.unsplash.com/photo-1601762603332-fd61e28b698a?w=500&h=500&fit=crop'],

      // Books
      ['Digital Marketing Guide', 'Comprehensive e-book on digital marketing strategies', 999, 'DIGITAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'],
      ['Business Success Principles', 'Learn key principles for business success', 1499, 'DIGITAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop'],
      ['Creative Writing Masterclass', 'Advanced guide to creative writing techniques', 1199, 'DIGITAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop'],
      ['Healthy Living Cookbook', 'Delicious and healthy recipes for everyday meals', 899, 'PHYSICAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'],
      ['Photography Fundamentals', 'Complete guide to mastering photography basics', 1599, 'DIGITAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&h=500&fit=crop'],

      // Home & Garden
      ['Room Plants Collection', 'Beautiful collection of indoor plants for home decor', 1299, 'PHYSICAL', 'ACTIVE', homeGarden.id, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop'],
      ['Garden Tool Set', 'Complete set of professional gardening tools', 2499, 'PHYSICAL', 'ACTIVE', homeGarden.id, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=500&fit=crop'],
      ['Ceramic Flower Vase', 'Elegant ceramic vase for flower arrangements', 899, 'PHYSICAL', 'ACTIVE', homeGarden.id, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
      ['Outdoor Hammock', 'Comfortable hanging hammock for relaxation', 3499, 'PHYSICAL', 'ACTIVE', homeGarden.id, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'],
      ['Kitchen Herb Garden Kit', 'Complete kit for growing fresh herbs indoors', 1899, 'PHYSICAL', 'ACTIVE', homeGarden.id, 'https://images.unsplash.com/photo-1416339670003-7e42e35fb4e0?w=500&h=500&fit=crop'],

      // New Categories - Books and Services
      ['JavaScript Mastery Course', 'Complete JavaScript programming course with practical projects', 4999, 'DIGITAL', 'ACTIVE', books.id, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop'],
      ['Mobile App Development', 'Professional mobile app development service for iOS and Android', 99999, 'SERVICE', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=500&fit=crop'],
      ['E-commerce Website Design', 'Custom e-commerce website design and development', 74999, 'SERVICE', 'ACTIVE', electronics.id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop'],
    ]

    for (const [name, description, price, productType, status, categoryId, imageUrl] of productsData) {
      const product = await prisma.product.create({
        data: {
          name: name as string,
          description: description as string,
          price: price as number,
          inventoryQuantity: 50,
          productType: productType as any,
          status: status as any,
          categoryId: categoryId as string,
        },
      })

      // Create product image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl as string,
          alt: name as string,
        },
      })

      // Create sample review
      if (Math.random() > 0.3) {
        const ratings = [4, 5]
        const rating = ratings[Math.floor(Math.random() * ratings.length)]
        await prisma.review.create({
          data: {
            userId: customer.id,
            productId: product.id,
            rating,
            content: rating === 5 ? 'Excellent product!' : 'Great quality!',
            verified: true,
          },
        })
      }
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
