import { PrismaClient } from 'prisma/generated/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Bun 不支持 better-sqlite3 所依赖的原生 SQLite 驱动程序（参见 node:sqlite 参考文档）。
// 如果目标是 Bun，请改用 @prisma/adapter-libsql 适配器
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
export default prisma;
