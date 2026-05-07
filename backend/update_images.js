const fs = require('fs');
const path = require('path');
const sequelize = require('./models/db');
const Product = require('./models/Product');

const artifactsDir = `C:\\Users\\deeks\\.gemini\\antigravity\\brain\\9bffc3fb-f5a7-4871-bfac-ff54fb5bf46d`;
const publicImagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Map of partial name -> image filename
const imagesMap = {
  'Neon Tetra': 'neon_tetra_1777911524850.png',
  'Fancy Guppy': 'fancy_guppy_1777911538548.png',
  'Halfmoon Betta': 'halfmoon_betta_1777911554479.png',
  'Ocellaris Clownfish': 'ocellaris_clownfish_1777911569047.png',
  'Regal Blue Tang': 'regal_blue_tang_1777911585008.png',
  'Platinum Asian Arowana': 'platinum_arowana_1777911601150.png',
  'Peppermint Angelfish': 'peppermint_angelfish_1777911616208.png',
  'Anubias Barteri': 'anubias_nana_1777911633086.png',
  'Java Fern': 'java_fern_1777911652753.png',
  'TetraMin Tropical Flakes': 'tetra_flakes_1777911667844.png',
  'Hikari Cichlid': 'hikari_pellets_1777911684022.png',
  'Fluval E300': 'aquarium_heater_1777911698940.png',
  'Hygger Aqua LED': 'aquarium_led_1777911713716.png'
};

async function update() {
  try {
    await sequelize.authenticate();
    console.log('DB Connected.');

    const products = await Product.findAll();
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      let matchedImg = null;
      for (const [key, filename] of Object.entries(imagesMap)) {
        if (product.name.includes(key)) {
          matchedImg = filename;
          break;
        }
      }

      if (matchedImg) {
        // Copy file
        const src = path.join(artifactsDir, matchedImg);
        const dest = path.join(publicImagesDir, matchedImg);
        
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`Copied ${matchedImg}`);
          
          // Update DB
          await product.update({ images: [`/images/${matchedImg}`] });
          console.log(`Updated ${product.name}`);
        } else {
          console.log(`Source not found: ${src}`);
        }
      }
    }

    console.log('Update complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

update();
