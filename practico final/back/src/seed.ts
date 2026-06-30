import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CategoryEntity } from './categories/entities/category.entity';
import { ProductEntity } from './products/entities/product.entity';
import { UserEntity } from './users/user.entity';
import { UserRole } from './users/user-role.enum';

// Carga el mismo .env que usa la app (back/.env)
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'tpids',
  entities: [CategoryEntity, ProductEntity, UserEntity],
  synchronize: true, // crea las tablas si no existen (igual que la app)
});

const CATEGORIES = ['Electrónica', 'Hogar', 'Indumentaria', 'Libros'];

// price/stock de prueba; la categoría se resuelve por nombre más abajo
const PRODUCTS: Array<{ name: string; price: number; stock: number; category: string }> = [
  { name: 'Notebook 14"', price: 850000, stock: 12, category: 'Electrónica' },
  { name: 'Auriculares Bluetooth', price: 45000, stock: 50, category: 'Electrónica' },
  { name: 'Smartphone 128GB', price: 620000, stock: 8, category: 'Electrónica' },
  { name: 'Cafetera express', price: 130000, stock: 20, category: 'Hogar' },
  { name: 'Juego de sábanas', price: 38000, stock: 35, category: 'Hogar' },
  { name: 'Remera básica', price: 12000, stock: 100, category: 'Indumentaria' },
  { name: 'Campera de abrigo', price: 89000, stock: 15, category: 'Indumentaria' },
  { name: 'El Quijote', price: 22000, stock: 40, category: 'Libros' },
  { name: 'Clean Code', price: 48000, stock: 25, category: 'Libros' },
];

const USERS: Array<{ email: string; password: string; role: UserRole }> = [
  { email: 'admin@tpids.local', password: 'Admin123!', role: UserRole.ADMIN },
  { email: 'user@tpids.local', password: 'User123!', role: UserRole.USER },
];

async function run(): Promise<void> {
  await dataSource.initialize();
  console.log('🔌 Conectado a la DB:', process.env.DB_NAME, 'en', process.env.DB_HOST + ':' + process.env.DB_PORT);

  const rounds = Number(process.env.BCRYPT_COST ?? '12');
  const catRepo = dataSource.getRepository(CategoryEntity);
  const prodRepo = dataSource.getRepository(ProductEntity);
  const userRepo = dataSource.getRepository(UserEntity);

  // --- Categorías (idempotente por nombre) ---
  const catByName = new Map<string, CategoryEntity>();
  for (const name of CATEGORIES) {
    let cat = await catRepo.findOne({ where: { name } });
    if (!cat) {
      cat = await catRepo.save(catRepo.create({ name }));
      console.log('  + categoría:', name);
    }
    catByName.set(name, cat);
  }

  // --- Productos (idempotente por nombre) ---
  for (const p of PRODUCTS) {
    const exists = await prodRepo.findOne({ where: { name: p.name } });
    if (exists) continue;
    const cat = catByName.get(p.category)!;
    await prodRepo.save(
      prodRepo.create({ name: p.name, price: p.price, stock: p.stock, categoryId: cat.id }),
    );
    console.log('  + producto:', p.name);
  }

  // --- Usuarios (idempotente por email, ya verificados para poder loguear) ---
  // El corrector (test-api.html) promueve/degrada roles y no los restaura, así
  // que si el usuario ya existe le reseteamos rol e isVerified a los valores
  // canónicos para dejar la DB en estado conocido en cada seed.
  for (const u of USERS) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (exists) {
      if (exists.role !== u.role || !exists.isVerified) {
        exists.role = u.role;
        exists.isVerified = true;
        await userRepo.save(exists);
        console.log(`  ~ usuario: ${u.email} → rol restaurado a (${u.role})`);
      }
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, rounds);
    await userRepo.save(
      userRepo.create({
        email: u.email,
        passwordHash,
        role: u.role,
        isVerified: true,
      }),
    );
    console.log(`  + usuario: ${u.email} (${u.role}) / pass: ${u.password}`);
  }

  await dataSource.destroy();
  console.log('✅ Seed completado.');
}

run().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
