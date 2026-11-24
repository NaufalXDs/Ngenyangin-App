import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to connect to MySQL.');
}

const connection = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: connection.hostname,
  port: Number(connection.port || 3306),
  user: decodeURIComponent(connection.username),
  password: decodeURIComponent(connection.password),
  database: decodeURIComponent(connection.pathname.slice(1)),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with 5 dummy users and 25 recipes...');

  const hashedPassword = await bcrypt.hash('12345678', 10);

  // 1. Define 5 Users
  const userProfiles = [
    { email: 'dummy1@mail.com', username: 'chef_marco', name: 'Marco Italian' },
    { email: 'dummy2@mail.com', username: 'chef_siti', name: 'Siti Nusantara' },
    { email: 'dummy3@mail.com', username: 'chef_alex', name: 'Alex Baker' },
    { email: 'dummy4@mail.com', username: 'chef_kenji', name: 'Kenji Tokyo' },
    { email: 'dummy5@mail.com', username: 'chef_elena', name: 'Elena Maria' },
  ];

  // 2. Fetch recipes from DummyJSON API (limit 30 to get plenty of categories)
  try {
    const response = await fetch('https://dummyjson.com/recipes?limit=30');
    const data = await response.json();
    const apiRecipes = data.recipes || [];

    if (apiRecipes.length === 0) {
      console.log('No recipes fetched from API.');
      return;
    }

    let recipeIndex = 0;

    for (const [userIndex, profile] of userProfiles.entries()) {
      const user = await prisma.user.upsert({
        where: { email: profile.email },
        update: {},
        create: {
          email: profile.email,
          username: profile.username,
          name: profile.name,
          password: hashedPassword,
          role: 'USER',
        },
      });

      console.log(`User ${userIndex + 1} ready: ${user.email} (ID: ${user.id})`);

      // Assign 5 recipes to this user with different categories
      for (let i = 0; i < 5; i++) {
        if (recipeIndex >= apiRecipes.length) recipeIndex = 0;
        const r = apiRecipes[recipeIndex++];

        const ingredientsText = Array.isArray(r.ingredients) ? r.ingredients.join('\n') : r.ingredients;
        const instructionsText = Array.isArray(r.instructions) ? r.instructions.join('\n') : r.instructions;
        const category = r.cuisine || r.mealType?.[0] || `Category-${i + 1}`;
        const baseSlug = `${r.name}-${profile.name.split(' ')[0]}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const slug = `${baseSlug}-${userIndex + 1}-${i + 1}`;

        await prisma.recipe.create({
          data: {
            title: `${r.name} (${profile.name.split(' ')[0]})`,
            slug,
            description: `An exquisite ${category} dish crafted by ${profile.name}. Perfect for food lovers!`,
            ingredients: ingredientsText,
            instructions: instructionsText,
            category: category,
            imageUrl: r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            status: 'APPROVED',
            authorId: user.id,
          },
        });

        console.log(`   -> Created recipe: ${r.name} [Category: ${category}] for ${profile.name}`);
      }
    }

    console.log('Seeding of 5 users and 25 recipes completed successfully!');
  } catch (err) {
    console.error('Failed to fetch and seed recipes from API:', err.message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
