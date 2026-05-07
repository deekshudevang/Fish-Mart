require('dotenv').config();
const sequelize = require('./models/db');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Admin = require('./models/Admin');
const Settings = require('./models/Settings');

const fishData = [
  {
    name: 'Platinum Arowana',
    description: 'The legendary "dragon fish" — a rare platinum-colored specimen prized by collectors worldwide.',
    price: 124999,
    category: 'Rare Findings',
    stock: 3,
    images: ['/products/arowana.png'],
    reviews: [{ rating: 5, comment: 'Majestic and healthy!', user: 'DragonCollector' }],
  },
  {
    name: 'Discus — Pigeon Blood',
    description: 'The King of the Aquarium — vibrant red-orange with fine blue-white striping.',
    price: 7499,
    category: 'Freshwater',
    stock: 30,
    images: ['/products/discus.png'],
    reviews: [{ rating: 5, comment: 'Breathtaking colors!', user: 'DiscusLover' }],
  },
  {
    name: 'Clownfish — Ocellaris',
    description: 'The iconic orange clownfish. Hardy, reef-safe, and full of personality.',
    price: 2499,
    category: 'Saltwater',
    stock: 60,
    images: ['/products/clownfish.png'],
    reviews: [{ rating: 5, comment: 'Active and healthy.', user: 'ReefBuilder' }],
  },
  {
    name: 'Flowerhorn — Red Dragon',
    description: 'Impressive hybrid cichlid with a massive nuchal hump and fiery coloring.',
    price: 16999,
    category: 'Rare Findings',
    stock: 12,
    images: ['/products/flowerhorn.png'],
    reviews: [{ rating: 5, comment: 'Incredible personality.', user: 'CichlidGuy' }],
  },
  {
    name: 'Japanese Koi — Kohaku',
    description: 'Premium red and white Kohaku Koi. Bred for pristine color separation.',
    price: 14999,
    category: 'Freshwater',
    stock: 10,
    images: ['/products/koi.png'],
    reviews: [{ rating: 5, comment: 'Stunning patterns.', user: 'PondMaster' }],
  },
  {
    name: 'Halfmoon Betta — Royal Blue',
    description: 'Show-quality Betta with massive flowing fins and deep royal blue scales.',
    price: 1299,
    category: 'Freshwater',
    stock: 25,
    images: ['/products/betta.png'],
    reviews: [{ rating: 5, comment: 'Beautiful betta.', user: 'BettaFan' }],
  },
  {
    name: 'Zebra Pleco — L046',
    description: 'The holy grail of plecos. Striking black and white zebra stripes.',
    price: 28999,
    category: 'Rare Findings',
    stock: 5,
    images: ['/products/pleco.png'],
    reviews: [{ rating: 5, comment: 'Immaculate specimen.', user: 'RareAqua' }],
  },
  {
    name: 'Fancy Tail Guppy',
    description: 'Vibrant, multi-colored fan tail guppies. Hardy and active.',
    price: 499,
    category: 'Freshwater',
    stock: 80,
    images: ['/products/guppy.png'],
    reviews: [{ rating: 4, comment: 'Very lively.', user: 'GuppyClub' }],
  },
  {
    name: 'Neon Tetra School',
    description: 'Brilliant electric blue and red stripes. Mesmerizing schooling effect.',
    price: 999,
    category: 'Freshwater',
    stock: 150,
    images: ['/products/tetra.png'],
    reviews: [{ rating: 5, comment: 'Look incredible.', user: 'AquaScaper' }],
  },
  {
    name: 'Oranda Goldfish',
    description: 'Premium Red and White Oranda with a prominent wen. A classic pond beauty.',
    price: 3499,
    category: 'Freshwater',
    stock: 40,
    images: ['/products/goldfish.png'],
    reviews: [{ rating: 5, comment: 'So cute and healthy!', user: 'GoldieFan' }],
  },
  {
    name: 'Tiger Oscar',
    description: 'A large, intelligent cichlid with striking orange and black markings.',
    price: 2999,
    category: 'Freshwater',
    stock: 15,
    images: ['/products/oscar.png'],
    reviews: [{ rating: 5, comment: 'Huge and full of life.', user: 'BigFishKeeper' }],
  },
  {
    name: 'Silver Angelfish',
    description: 'Graceful and elegant freshwater angelfish with long, flowing fins.',
    price: 1999,
    category: 'Freshwater',
    stock: 50,
    images: ['/products/angelfish.png'],
    reviews: [{ rating: 5, comment: 'Perfect for my community tank.', user: 'AngelLover' }],
  },
  {
    name: 'Royal Blue Tang',
    description: 'The iconic "Dory" fish. Vivid blue body with a bright yellow tail.',
    price: 6999,
    category: 'Saltwater',
    stock: 20,
    images: ['/products/bluetang.png'],
    reviews: [{ rating: 5, comment: 'Just keep swimming! Beautiful fish.', user: 'ReefExpert' }],
  },
  {
    name: 'Yellow Seahorse',
    description: 'Mesmerizing yellow seahorse. A unique addition for specialized marine tanks.',
    price: 8999,
    category: 'Saltwater',
    stock: 10,
    images: ['/products/seahorse.png'],
    reviews: [{ rating: 5, comment: 'A true marvel of nature.', user: 'MarineMagic' }],
  },
  {
    name: 'Yellow Tang',
    description: 'Vibrant yellow marine fish. A classic and active reef dweller.',
    price: 5999,
    category: 'Saltwater',
    stock: 35,
    images: ['/products/yellowtang.png'],
    reviews: [{ rating: 5, comment: 'Brightens up the whole tank!', user: 'CoralCraze' }],
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@exoticfishmart.com',
      password: process.env.ADMIN_PASSWORD || 'ExoticFish2024!',
      name: 'Super Admin',
      role: 'super-admin',
    });

    await Settings.bulkCreate([
      { key: 'hero_title', value: 'Exotic Fish' },
      { key: 'hero_subtitle', value: 'Mart' },
      { key: 'hero_description', value: 'Discover the world\'s most stunning exotic fish. Hand-picked, live-delivered, with a satisfaction guarantee.' },
    ]);

    for (const fish of fishData) {
      const { reviews, ...productData } = fish;
      const product = await Product.create(productData);
      if (reviews) {
        await Review.bulkCreate(reviews.map(r => ({ ...r, productId: product.id })));
      }
    }

    console.log(`✅ Database seeded with ${fishData.length} premium fish products!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
