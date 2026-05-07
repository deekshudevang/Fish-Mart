require('dotenv').config();
const sequelize = require('./models/db');
const Product = require('./models/Product');

const seedData = [
  // Freshwater
  {
    name: 'Neon Tetra (Paracheirodon innesi)',
    description: 'A popular freshwater fish with vibrant blue and red stripes.',
    price: 150,
    category: 'Freshwater',
    stock: 200,
    images: ['https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Fancy Guppy',
    description: 'Highly active freshwater fish known for their colorful, flowing tails.',
    price: 250,
    category: 'Freshwater',
    stock: 150,
    images: ['https://images.unsplash.com/photo-1544498308-f446ec39d528?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Halfmoon Betta - Royal Blue',
    description: 'A stunning Betta fish with a fully flared, 180-degree halfmoon tail.',
    price: 1200,
    category: 'Freshwater',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?auto=format&fit=crop&q=80&w=800'],
  },

  // Saltwater
  {
    name: 'Ocellaris Clownfish',
    description: 'The classic anemonefish, bright orange with three white bands.',
    price: 1500,
    category: 'Saltwater',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Regal Blue Tang',
    description: 'A vibrant blue saltwater fish with a yellow tail and dark palette-like markings.',
    price: 4500,
    category: 'Saltwater',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800'],
  },

  // Rare Findings
  {
    name: 'Platinum Asian Arowana',
    description: 'One of the rarest and most highly prized ornamental fish in the world, featuring flawless metallic scales.',
    price: 250000,
    category: 'Rare Findings',
    stock: 2,
    images: ['https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Peppermint Angelfish',
    description: 'An exceptionally rare deep-water angelfish with striking red and white vertical stripes.',
    price: 850000,
    category: 'Rare Findings',
    stock: 1,
    images: ['https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800'],
  },

  // Aquarium Plants
  {
    name: 'Anubias Barteri var. Nana',
    description: 'A hardy, slow-growing foreground plant that requires low light.',
    price: 450,
    category: 'Aquarium Plants',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1615818499660-30bb5816e1c7?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Java Fern (Microsorum pteropus)',
    description: 'An undemanding aquatic plant that easily attaches to driftwood and rocks.',
    price: 300,
    category: 'Aquarium Plants',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c811?auto=format&fit=crop&q=80&w=800'],
  },

  // Fish Food
  {
    name: 'TetraMin Tropical Flakes',
    description: 'Nutritionally balanced flake food for all tropical fish.',
    price: 250,
    category: 'Fish Food',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Hikari Cichlid Gold Sinking Pellets',
    description: 'Color-enhancing daily diet for all types of Cichlids.',
    price: 650,
    category: 'Fish Food',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800'],
  },

  // Aquarium Accessories
  {
    name: 'Fluval E300 Advanced Electronic Heater',
    description: '300-watt submersible heater with dual temperature sensors and LCD display.',
    price: 3500,
    category: 'Aquarium Accessories',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&q=80&w=800'],
  },
  {
    name: 'Hygger Aqua LED Light',
    description: 'Full spectrum LED aquarium light with built-in timer and customizable color settings.',
    price: 2800,
    category: 'Aquarium Accessories',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?auto=format&fit=crop&q=80&w=800'],
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Clear existing data (optional, but requested to "fill them")
    // Let's not clear, just add, or we can check. 
    // Actually, I'll just bulkCreate.
    
    for (const item of seedData) {
      await Product.create(item);
    }
    
    console.log('Successfully seeded database with ' + seedData.length + ' products.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
