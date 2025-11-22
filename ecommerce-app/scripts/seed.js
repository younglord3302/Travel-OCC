const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create sample user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create users
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    const customer = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        name: 'Customer User',
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })

    console.log('✅ Users created')

    // Create categories
    const electronics = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest smartphones, laptops, and gadgets',
      },
    })

    const clothing = await prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Trendy fashion and apparel for all styles',
      },
    })

    const books = await prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Books',
        slug: 'books',
        description: 'Fiction, non-fiction, and educational books',
      },
    })

    const homeGarden = await prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Beautiful home decor and garden essentials',
      },
    })

    const sportsFitness = await prisma.category.upsert({
      where: { slug: 'sports-fitness' },
      update: {},
      create: {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Fitness equipment and active lifestyle products',
      },
    })

    const beautyPersonalCare = await prisma.category.upsert({
      where: { slug: 'beauty-personal-care' },
      update: {},
      create: {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Skincare, makeup, and personal care essentials',
      },
    })

    const toysGames = await prisma.category.upsert({
      where: { slug: 'toys-games' },
      update: {},
      create: {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Fun toys and games for all ages',
      },
    })

    const automotive = await prisma.category.upsert({
      where: { slug: 'automotive' },
      update: {},
      create: {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Car accessories and automotive essentials',
      },
    })

    console.log('✅ Categories created')

    // Create 50 stunning and diverse products
    const productsData = [
      {
        name: 'Premium Wireless Earbuds Pro',
        description: 'Crystal-clear sound, active noise cancellation, and 24hr battery life. Perfect for music lovers and professionals.',
        price: 4599,
        compareAtPrice: 5999,
        inventoryQuantity: 75,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f8299e6097?w=500&h=500&fit=crop'
      },
      {
        name: 'Gaming Mechanical Keyboard RGB',
        description: 'Ultra-responsive mechanical switches with customizable RGB lighting and aluminum frame.',
        price: 6999,
        compareAtPrice: 8999,
        inventoryQuantity: 45,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop'
      },
      {
        name: '4K Ultra HD Smart TV 55"',
        description: 'Stunning 4K resolution, smart features with voice control, and crystal-clear picture quality.',
        price: 64999,
        compareAtPrice: 79999,
        inventoryQuantity: 20,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop'
      },
      {
        name: 'Coffee Maker Deluxe',
        description: 'Programmable coffee maker with thermal carafe, multiple brew strengths, and auto-shutoff feature.',
        price: 3999,
        compareAtPrice: 4999,
        inventoryQuantity: 65,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=500&h=500&fit=crop'
      },
      {
        name: 'Crystal Chandelier Modern',
        description: 'Elegant crystal chandelier with warm LED lighting, perfect for modern dining rooms.',
        price: 18999,
        compareAtPrice: 24999,
        inventoryQuantity: 15,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=500&h=500&fit=crop'
      },
      {
        name: 'Luxury Silk Pillow Set',
        description: 'Premium silk pillows for ultimate comfort - hypoallergenic, temperature regulating, and luxurious.',
        price: 4999,
        compareAtPrice: 6999,
        inventoryQuantity: 80,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
      },
      {
        name: 'Designer Leather Handbag',
        description: 'Genuine leather handbag with gold hardware, spacious compartments, and timeless elegance.',
        price: 15999,
        compareAtPrice: 20999,
        inventoryQuantity: 25,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
      },
      {
        name: 'Athletic Running Shoes Pro',
        description: 'High-performance running shoes with advanced cushioning, breathable mesh, and lightweight design.',
        price: 7999,
        compareAtPrice: 9999,
        inventoryQuantity: 60,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop'
      },
      {
        name: 'Cashmere Sweater Premium',
        description: 'Luxurious 100% cashmere sweater - incredibly soft, warm, and perfect for any season.',
        price: 8999,
        compareAtPrice: 11999,
        inventoryQuantity: 35,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop'
      },
      {
        name: 'Masterchef Cookware Set',
        description: 'Professional grade stainless steel cookware set - induction compatible and built to last.',
        price: 14999,
        compareAtPrice: 18999,
        inventoryQuantity: 40,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'
      },
      {
        name: 'Adjustable Standing Desk',
        description: 'Ergonomic height-adjustable standing desk with smooth motor, large surface area, and cable management.',
        price: 24999,
        compareAtPrice: 29999,
        inventoryQuantity: 30,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
      },
      {
        name: 'Yoga Mat Premium Series',
        description: 'Extra thick, non-slip yoga mat with carrying strap and alignment guides for perfect practice.',
        price: 3999,
        compareAtPrice: 5499,
        inventoryQuantity: 90,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop'
      },
      {
        name: 'Dumbbell Weight Set 40lb',
        description: 'Professional grade adjustable dumbbells with ergonomic grip and storage rack included.',
        price: 17999,
        compareAtPrice: 22999,
        inventoryQuantity: 25,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
      },
      {
        name: 'Smart Fitness Tracker Pro',
        description: 'Advanced fitness tracker with heart rate monitor, sleep analysis, and 20+ sports modes.',
        price: 8999,
        compareAtPrice: 11999,
        inventoryQuantity: 70,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop'
      },
      {
        name: 'Luxury Skincare Set Gold',
        description: 'Complete skincare routine with gold-infused products for radiant, youthful skin.',
        price: 12999,
        compareAtPrice: 16999,
        inventoryQuantity: 45,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop'
      },
      {
        name: 'Professional Hair Dryer Ionic',
        description: 'Ionic technology hair dryer with multiple heat settings and diffuser for perfect styling.',
        price: 6599,
        compareAtPrice: 8999,
        inventoryQuantity: 55,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=500&h=500&fit=crop'
      },
      {
        name: 'Crystal Perfume Collection',
        description: 'Luxury fragrance set with three signature scents in elegant crystal bottles.',
        price: 18999,
        compareAtPrice: 24999,
        inventoryQuantity: 20,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop'
      },
      {
        name: 'Remote Control Drone 4K',
        description: 'Professional 4K camera drone with 30 minutes flight time and intelligent flight modes.',
        price: 34999,
        compareAtPrice: 44999,
        inventoryQuantity: 15,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&h=500&fit=crop'
      },
      {
        name: 'Wireless Gaming Mouse RGB',
        description: 'Ultra-precise gaming mouse with programmable buttons, RGB lighting, and 100hr battery life.',
        price: 3599,
        compareAtPrice: 4999,
        inventoryQuantity: 85,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1593640495253-23196b27fbd2?w=500&h=500&fit=crop'
      },
      {
        name: 'Wireless Charging Station',
        description: 'Multi-device wireless charging station with fast charging technology and sleek design.',
        price: 4999,
        compareAtPrice: 6999,
        inventoryQuantity: 60,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop'
      },
      {
        name: 'LEGO Mindstorms Robot Inventor',
        description: 'Advanced robotics building set with programmable motors, sensors, and AI capabilities.',
        price: 24999,
        compareAtPrice: 29999,
        inventoryQuantity: 30,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop'
      },
      {
        name: 'Drones Racing Championship Set',
        description: 'Complete drone racing kit with transmitters, spare parts, and professional-grade components.',
        price: 18999,
        compareAtPrice: 24999,
        inventoryQuantity: 20,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop'
      },
      {
        name: 'Interactive Learning Tablet',
        description: 'Educational tablet with interactive games, drawing apps, and early learning development.',
        price: 14999,
        compareAtPrice: 18999,
        inventoryQuantity: 40,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&h=500&fit=crop'
      },
      {
        name: 'Car Dash Camera 4K',
        description: 'Ultra HD dash camera with night vision, G-sensor, and WiFi connectivity for smart monitoring.',
        price: 7999,
        compareAtPrice: 9999,
        inventoryQuantity: 65,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop'
      },
      {
        name: 'Portable Car Vacuum Cleaner',
        description: 'High-powered handheld car vacuum with HEPA filter and multiple attachments for thorough cleaning.',
        price: 3399,
        compareAtPrice: 4999,
        inventoryQuantity: 75,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
      },
      {
        name: 'LED Car Interior Lighting Kit',
        description: 'RGB LED lighting kit for car interior with app control and various lighting modes.',
        price: 4999,
        compareAtPrice: 6999,
        inventoryQuantity: 50,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop'
      },
      {
        name: 'Bestselling Mystery Thriller',
        description: 'Gripping psychological thriller that will keep you on the edge of your seat until the final page.',
        price: 899,
        compareAtPrice: 1199,
        inventoryQuantity: 200,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: books.id,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'
      },
      {
        name: 'Photography Masterclass Guide',
        description: 'Complete photography course with professional techniques, composition, and post-processing.',
        price: 1999,
        inventoryQuantity: 150,
        productType: 'DIGITAL',
        status: 'ACTIVE',
        categoryId: books.id,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
      },
      {
        name: 'Investment Strategy Handbook',
        description: 'Comprehensive guide to smart investing - stocks, bonds, real estate, and portfolio management.',
        price: 2499,
        compareAtPrice: 3499,
        inventoryQuantity: 80,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: books.id,
        imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&h=500&fit=crop'
      },
      {
        name: 'Gaming Laptop RTX 40 Series',
        description: 'High-performance gaming laptop with RTX 4070, 16GB RAM, and stunning display for immersive gaming.',
        price: 129999,
        compareAtPrice: 149999,
        inventoryQuantity: 20,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop'
      },
      {
        name: 'Smart Home Security Camera 4K',
        description: 'Weatherproof 4K security camera with motion detection, night vision, and app control.',
        price: 5999,
        compareAtPrice: 7999,
        inventoryQuantity: 70,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=500&fit=crop'
      },
      {
        name: 'Bluetooth Portable Speaker',
        description: 'Waterproof portable speaker with 360° sound, 20hr battery, and premium audio quality.',
        price: 3999,
        compareAtPrice: 5499,
        inventoryQuantity: 90,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'
      },
      {
        name: 'Designer Summer Dress Collection',
        description: 'Elegant summer dresses in premium fabrics with modern cuts and vibrant color options.',
        price: 4599,
        compareAtPrice: 6599,
        inventoryQuantity: 55,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop'
      },
      {
        name: 'Luxury Winter Coat Premium',
        description: 'Gorgeous fur-trimmed wool coat with Italian craftsmanship and supreme warmth.',
        price: 34999,
        compareAtPrice: 45999,
        inventoryQuantity: 25,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop'
      },
      {
        name: 'Professional Leather Boots',
        description: 'Handcrafted leather boots with waterproof coating, perfect for work and everyday wear.',
        price: 8999,
        compareAtPrice: 11999,
        inventoryQuantity: 40,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: clothing.id,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'
      },
      {
        name: 'Garden Tool Professional Set',
        description: 'Complete garden tool set with pruning shears, rake, hoe, and ergonomic handles for comfort.',
        price: 4999,
        compareAtPrice: 6999,
        inventoryQuantity: 45,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop'
      },
      {
        name: 'Outdoor Patio Furniture Set',
        description: 'Elegant outdoor furniture set with weather-resistant materials and comfortable cushioning.',
        price: 69999,
        compareAtPrice: 89999,
        inventoryQuantity: 10,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
      },
      {
        name: 'Modern Wall Art Collection',
        description: 'Abstract wall art pieces to enhance any modern or minimalist decor scheme.',
        price: 7999,
        compareAtPrice: 10999,
        inventoryQuantity: 35,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: homeGarden.id,
        imageUrl: 'https://images.unsplash.com/photo-1516788875874-1d0ba95a2339?w=500&h=500&fit=crop'
      },
      {
        name: 'Protein Powder Isolate',
        description: 'Premium whey protein isolate with 25g protein per serving - zero sugar, gluten-free certified.',
        price: 3299,
        compareAtPrice: 4299,
        inventoryQuantity: 100,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
      },
      {
        name: 'Adjustable Bench Press',
        description: 'Heavy-duty adjustable bench with 1000lb capacity and multiple incline positions.',
        price: 19999,
        compareAtPrice: 24999,
        inventoryQuantity: 15,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop'
      },
      {
        name: 'Foam Roller Professional',
        description: 'High-density foam roller for muscle recovery, deep tissue massage, and flexibility training.',
        price: 1999,
        compareAtPrice: 2799,
        inventoryQuantity: 85,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: sportsFitness.id,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop'
      },
      {
        name: 'Luxury Spa Bath Set',
        description: 'Complete spa experience with essential oils, bath bombs, and luxury bathing products.',
        price: 7499,
        compareAtPrice: 9999,
        inventoryQuantity: 50,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop'
      },
      {
        name: 'Professional Makeup Brush Set',
        description: 'Complete makeup brush set with premium synthetic bristles and elegant case storage.',
        price: 4599,
        compareAtPrice: 6599,
        inventoryQuantity: 65,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop'
      },
      {
        name: 'Anti-Aging Serum Deluxe',
        description: 'Advanced anti-aging serum with peptides, hyaluronic acid, and vitamin C for radiant skin.',
        price: 5999,
        compareAtPrice: 7999,
        inventoryQuantity: 40,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: beautyPersonalCare.id,
        imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop'
      },
      {
        name: 'Virtual Reality Headset Meta',
        description: 'Immersive VR headset with 6DOF tracking, wireless capability, and vast content library.',
        price: 35999,
        compareAtPrice: 44999,
        inventoryQuantity: 30,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=500&h=500&fit=crop'
      },
      {
        name: 'Professional Studio Microphone',
        description: 'Broadcast-quality condenser microphone with shock mount, pop filter, and XLR cable.',
        price: 14999,
        compareAtPrice: 18999,
        inventoryQuantity: 25,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=500&fit=crop'
      },
      {
        name: 'Digital Drawing Tablet Pro',
        description: 'Professional digital drawing tablet with pressure sensitivity, tilt support, and shortcuts.',
        price: 12999,
        compareAtPrice: 15999,
        inventoryQuantity: 35,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: electronics.id,
        imageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=500&h=500&fit=crop'
      },
      {
        name: 'Board Game Night Collection',
        description: 'Curated collection of 5 strategic board games for family entertainment and competitive play.',
        price: 6999,
        compareAtPrice: 9999,
        inventoryQuantity: 30,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b85b707efd2?w=500&h=500&fit=crop'
      },
      {
        name: 'Puzzle 1000-Piece Challenge',
        description: 'Intricate jigsaw puzzle with stunning artwork, perfect for brain training and relaxation.',
        price: 1499,
        compareAtPrice: 1999,
        inventoryQuantity: 80,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop'
      },
      {
        name: 'STEM Building Set Advanced',
        description: 'Advanced building set with gears, motors, and programmable components for creative engineering.',
        price: 8999,
        compareAtPrice: 11999,
        inventoryQuantity: 45,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: toysGames.id,
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&h=500&fit=crop'
      },
      {
        name: 'Car Tire Pressure Monitoring System',
        description: 'Real-time tire pressure monitoring system with app notifications and alarm alerts.',
        price: 7599,
        compareAtPrice: 9999,
        inventoryQuantity: 55,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop'
      },
      {
        name: 'LED Car Light Upgrade Kit',
        description: 'Complete LED light upgrade kit with H4 to H7 adapters and professional installation guide.',
        price: 8599,
        compareAtPrice: 11999,
        inventoryQuantity: 40,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
      },
      {
        name: 'Car Phone Mount Magnetic',
        description: 'Heavy-duty magnetic phone mount with quick release and 360° rotation for hands-free use.',
        price: 1599,
        compareAtPrice: 2399,
        inventoryQuantity: 95,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: automotive.id,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop'
      },
      {
        name: 'Self-Help Personal Growth Guide',
        description: 'Inspiring book on personal development, goal setting, and achieving life-changing results.',
        price: 1299,
        compareAtPrice: 1799,
        inventoryQuantity: 120,
        productType: 'PHYSICAL',
        status: 'ACTIVE',
        categoryId: books.id,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
      },
      {
        name: 'Cooking Masterclass Digital Course',
        description: 'Complete cooking course with 50+ recipes, technique videos, and expert chef demonstrations.',
        price: 4999,
        inventoryQuantity: 300,
        productType: 'DIGITAL',
        status: 'ACTIVE',
        categoryId: books.id,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop'
      }
    ]

    for (const productData of productsData) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          inventoryQuantity: productData.inventoryQuantity,
          productType: productData.productType,
          status: productData.status,
          categoryId: productData.categoryId,
        },
      })

      // Create product image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: productData.imageUrl,
          alt: productData.name,
        },
      })

      // Create sample review
      const ratings = [4, 5]
      const rating = ratings[Math.floor(Math.random() * ratings.length)]
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: product.id,
          rating,
          content: rating === 5 ? 'Excellent product! Highly recommend.' : 'Good quality and fast delivery.',
          verified: Math.random() > 0.5,
        },
      })
    }

    console.log('✅ Products and reviews created')
    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('📋 Sample accounts created:')
    console.log('   Admin: admin@example.com / password123')
    console.log('   Customer: customer@example.com / password123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
