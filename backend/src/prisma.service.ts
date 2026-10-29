import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
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

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
