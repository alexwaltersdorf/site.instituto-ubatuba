import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ── Posts do Blog ── */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array serializado
  published: boolean("published").default(false).notNull(),
  authorId: int("authorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/* ── Galeria de Fotos ── */
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: text("imageKey"),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = typeof gallery.$inferInsert;

/* ── Mensagens de Contato ── */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["geral", "voluntariado", "doacao", "parceria", "imprensa"]).default("geral"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/* ── Canal de Ética (denúncias anônimas) ── */
export const ethicsReports = mysqlTable("ethics_reports", {
  id: int("id").autoincrement().primaryKey(),
  protocol: varchar("protocol", { length: 20 }).notNull().unique(), // Código de acompanhamento
  category: mysqlEnum("category", [
    "corrupcao",
    "assedio",
    "fraude",
    "conflito_interesses",
    "desvio_recursos",
    "discriminacao",
    "outros",
  ]).notNull(),
  description: text("description").notNull(),
  evidence: text("evidence"), // URL ou descrição de evidências
  anonymous: boolean("anonymous").default(true).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }), // Opcional, se não anônimo
  status: mysqlEnum("status", ["recebido", "em_analise", "concluido", "arquivado"]).default("recebido").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EthicsReport = typeof ethicsReports.$inferSelect;
export type InsertEthicsReport = typeof ethicsReports.$inferInsert;
