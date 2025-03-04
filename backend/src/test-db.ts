import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const jobs = await prisma.job.findMany();
    console.log('Connection successful!');
    console.log('Jobs:', jobs);
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 