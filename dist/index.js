// server/_core/index.ts
import "dotenv/config";
import express3 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  // JSON array serializado
  published: boolean("published").default(false).notNull(),
  authorId: int("authorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt")
});
var gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: text("imageKey"),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["geral", "voluntariado", "doacao", "parceria", "imprensa"]).default("geral"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var ethicsReports = mysqlTable("ethics_reports", {
  id: int("id").autoincrement().primaryKey(),
  protocol: varchar("protocol", { length: 20 }).notNull().unique(),
  // Código de acompanhamento
  category: mysqlEnum("category", [
    "corrupcao",
    "assedio",
    "fraude",
    "conflito_interesses",
    "desvio_recursos",
    "discriminacao",
    "outros"
  ]).notNull(),
  description: text("description").notNull(),
  evidence: text("evidence"),
  // URL ou descrição de evidências
  anonymous: boolean("anonymous").default(true).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }),
  // Opcional, se não anônimo
  status: mysqlEnum("status", ["recebido", "em_analise", "concluido", "arquivado"]).default("recebido").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  lgpdConsent: boolean("lgpdConsent").default(true).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  institution: varchar("institution", { length: 255 }).notNull(),
  institutionLogo: text("institutionLogo"),
  platform: varchar("platform", { length: 255 }),
  platformUrl: text("platformUrl").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  level: mysqlEnum("level", ["iniciante", "intermediario", "avancado"]).default("iniciante").notNull(),
  coverImage: text("coverImage"),
  tags: text("tags"),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt")
});
var certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull()
});
var studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  /** CPF normalizado (somente dígitos) — identificador único do aluno */
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  /** Data de nascimento em formato ISO YYYY-MM-DD */
  birthDate: varchar("birthDate", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var studentEnrollments = mysqlTable("student_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseId: int("courseId").notNull(),
  courseSlug: varchar("courseSlug", { length: 255 }).notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  // Fallbacks: em ambientes fora da Manus (ex.: Hostinger) essas envs nao
  // sao injetadas; valores oficiais do app deste projeto (HOSTINGER-DEPLOY.md).
  appId: process.env.VITE_APP_ID ?? "6EwoPvwoUEAd368Wyozqqt",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "https://api.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
function normalizeDatabaseUrl(raw) {
  const schemeIdx = raw.indexOf("://");
  if (schemeIdx === -1) return raw;
  const scheme = raw.slice(0, schemeIdx + 3);
  const rest = raw.slice(schemeIdx + 3);
  const lastAt = rest.lastIndexOf("@");
  if (lastAt === -1) return raw;
  const userinfo = rest.slice(0, lastAt);
  if (!userinfo.includes("@")) return raw;
  const colon = userinfo.indexOf(":");
  if (colon === -1) return raw;
  const user = userinfo.slice(0, colon);
  const pass = userinfo.slice(colon + 1);
  let hostpart = rest.slice(lastAt + 1);
  if (hostpart.startsWith("localhost") && user.startsWith("u666428935_")) {
    hostpart = hostpart.replace(/^localhost/, "srv722.hstgr.io");
  }
  return `${scheme}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostpart}`;
}
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(normalizeDatabaseUrl(process.env.DATABASE_URL));
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  const values = { openId: user.openId };
  const updateSet = {};
  const textFields = ["name", "email", "loginMethod"];
  const assignNullable = (field) => {
    const value = user[field];
    if (value === void 0) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== void 0) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== void 0) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getPublishedPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)).limit(limit).offset(offset);
}
async function getPostBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1);
  return result[0];
}
async function getAllPosts(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}
async function createPost(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(posts).values(data);
}
async function updatePost(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
}
async function deletePost(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(posts).where(eq(posts.id, id));
}
async function getGalleryItems(category) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(gallery).where(eq(gallery.category, category)).orderBy(gallery.sortOrder);
  }
  return db.select().from(gallery).orderBy(gallery.sortOrder);
}
async function getFeaturedGallery() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gallery).where(eq(gallery.featured, true)).orderBy(gallery.sortOrder).limit(12);
}
async function createGalleryItem(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(gallery).values(data);
}
async function createContact(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contacts).values(data);
}
async function getContacts(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(limit);
}
async function createEthicsReport(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ethicsReports).values(data);
}
async function getEthicsReportByProtocol(protocol) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(ethicsReports).where(eq(ethicsReports.protocol, protocol)).limit(1);
  return result[0];
}
async function getEthicsReports(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ethicsReports).orderBy(desc(ethicsReports.createdAt)).limit(limit);
}
async function subscribeNewsletter(email, name) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(newsletterSubscribers).values({ email, name: name ?? null, lgpdConsent: true }).onDuplicateKeyUpdate({ set: { active: true } });
}
async function getCourses(category, level) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(courses.active, true)];
  if (category) conditions.push(eq(courses.category, category));
  if (level) conditions.push(eq(courses.level, level));
  return db.select().from(courses).where(and(...conditions)).orderBy(desc(courses.createdAt));
}
async function getCourseBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.active, true))).limit(1);
  return result[0];
}
async function getCourseById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}
async function createEnrollment(userId, courseId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(enrollments).values({ userId, courseId, status: "active" });
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}
async function getMyEnrollments(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ enrollment: enrollments, course: courses }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.enrolledAt));
}
async function completeEnrollment(enrollmentId, userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(enrollments).set({ status: "completed", completedAt: /* @__PURE__ */ new Date() }).where(and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, userId)));
}
async function getEnrollment(userId, courseId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}
async function issueCertificate(enrollmentId, userId, courseId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(certificates).where(and(eq(certificates.enrollmentId, enrollmentId), eq(certificates.userId, userId))).limit(1);
  if (existing.length > 0) return existing[0];
  const code = `IU${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await db.insert(certificates).values({ enrollmentId, userId, courseId, code });
  const result = await db.select().from(certificates).where(eq(certificates.code, code)).limit(1);
  return result[0];
}
async function getMyCertificates(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ certificate: certificates, course: courses }).from(certificates).innerJoin(courses, eq(certificates.courseId, courses.id)).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issuedAt));
}
async function getCertificateByCode(code) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select({ certificate: certificates, course: courses }).from(certificates).innerJoin(courses, eq(certificates.courseId, courses.id)).where(eq(certificates.code, code)).limit(1);
  return result[0];
}
var studentTablesEnsured = false;
var CREATE_STUDENT_PROFILES = sql`
  CREATE TABLE IF NOT EXISTS \`student_profiles\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`cpf\` varchar(14) NOT NULL,
    \`fullName\` varchar(255) NOT NULL,
    \`address\` varchar(255) NOT NULL,
    \`number\` varchar(20) NOT NULL,
    \`neighborhood\` varchar(120) NOT NULL,
    \`city\` varchar(120) NOT NULL,
    \`cep\` varchar(9) NOT NULL,
    \`birthDate\` varchar(10) NOT NULL,
    \`phone\` varchar(30) NOT NULL,
    \`email\` varchar(320) NOT NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`student_profiles_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`student_profiles_cpf_unique\` UNIQUE(\`cpf\`)
  )
`;
async function ensureStudentTables(db) {
  if (studentTablesEnsured) return;
  await db.execute(CREATE_STUDENT_PROFILES);
  try {
    await db.execute(sql`SELECT \`cpf\` FROM \`student_profiles\` LIMIT 1`);
  } catch {
    await db.execute(sql`DROP TABLE \`student_profiles\``);
    await db.execute(CREATE_STUDENT_PROFILES);
  }
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS \`student_enrollments\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`studentId\` int NOT NULL,
      \`courseId\` int NOT NULL,
      \`courseSlug\` varchar(255) NOT NULL,
      \`enrolledAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT \`student_enrollments_id\` PRIMARY KEY(\`id\`)
    )
  `);
  studentTablesEnsured = true;
}
async function findStudentByCpf(cpf) {
  const db = await getDb();
  if (!db) return void 0;
  await ensureStudentTables(db);
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.cpf, cpf)).limit(1);
  return result[0];
}
async function saveStudentProfile(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureStudentTables(db);
  const { cpf, ...fields } = data;
  await db.insert(studentProfiles).values(data).onDuplicateKeyUpdate({ set: fields });
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.cpf, cpf)).limit(1);
  return result[0];
}
async function logStudentEnrollment(studentId, courseId, courseSlug) {
  const db = await getDb();
  if (!db) return;
  await ensureStudentTables(db);
  await db.insert(studentEnrollments).values({ studentId, courseId, courseSlug });
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      let redirectTo = "/";
      try {
        const decoded = Buffer.from(state, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed.returnPath && parsed.returnPath.startsWith("/")) {
          redirectTo = parsed.returnPath;
        }
      } catch {
      }
      res.redirect(302, redirectTo);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/routers.ts
import Stripe from "stripe";

// server/stripe-products.ts
var DONATION_TIERS = [
  {
    id: "doe-30",
    label: "R$ 30",
    amountBRL: 3e3,
    description: "Apoiador da Natureza",
    impact: "Cobre materiais esportivos para uma crian\xE7a por 1 m\xEAs nas escolinhas.",
    popular: false
  },
  {
    id: "doe-50",
    label: "R$ 50",
    amountBRL: 5e3,
    description: "Guardi\xE3o do Santu\xE1rio",
    impact: "Financia um exame de sa\xFAde preventivo para uma fam\xEDlia da comunidade.",
    popular: false
  },
  {
    id: "doe-100",
    label: "R$ 100",
    amountBRL: 1e4,
    description: "Protetor do Ecossistema",
    impact: "Garante 1 m\xEAs de atividades esportivas e educacionais para 3 crian\xE7as.",
    popular: true
  },
  {
    id: "doe-200",
    label: "R$ 200",
    amountBRL: 2e4,
    description: "Embaixador Socioambiental",
    impact: "Sustenta um m\xEAs completo do Projeto Itagu\xE1 Azul de conserva\xE7\xE3o marinha.",
    popular: false
  }
];
var DONATION_CURRENCY = "brl";
var DONATION_PRODUCT_NAME = "Doa\xE7\xE3o \u2014 Instituto Ubatuba Santu\xE1rio Ecol\xF3gico";
var DONATION_PRODUCT_DESCRIPTION = "Sua doa\xE7\xE3o apoia programas socioambientais em Ubatuba: escolinhas esportivas, a\xE7\xF5es de sa\xFAde e conserva\xE7\xE3o ambiental \u2014 alinhados \xE0 ODS 17 (Parcerias) e \xE0 Agenda 2030.";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
function isValidCPF(raw) {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const t2 of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < t2; i++) sum += parseInt(cpf[i]) * (t2 + 1 - i);
    const digit = sum * 10 % 11 % 10;
    if (digit !== parseInt(cpf[t2])) return false;
  }
  return true;
}
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  /* ── Blog / Posts ── */
  posts: router({
    list: publicProcedure.input(z2.object({ limit: z2.number().min(1).max(50).default(10), offset: z2.number().min(0).default(0) }).optional()).query(async ({ input }) => {
      return getPublishedPosts(input?.limit ?? 10, input?.offset ?? 0);
    }),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      const post = await getPostBySlug(input.slug);
      if (!post) throw new TRPCError3({ code: "NOT_FOUND", message: "Post n\xE3o encontrado." });
      return post;
    }),
    // Admin: listar todos (incluindo rascunhos)
    adminList: adminProcedure2.input(z2.object({ limit: z2.number().default(50), offset: z2.number().default(0) }).optional()).query(async ({ input }) => {
      return getAllPosts(input?.limit ?? 50, input?.offset ?? 0);
    }),
    create: adminProcedure2.input(
      z2.object({
        slug: z2.string().min(1),
        title: z2.string().min(1),
        excerpt: z2.string().optional(),
        content: z2.string().min(1),
        coverImage: z2.string().optional(),
        category: z2.string().optional(),
        tags: z2.string().optional(),
        published: z2.boolean().default(false)
      })
    ).mutation(async ({ input, ctx }) => {
      await createPost({
        ...input,
        authorId: ctx.user.id,
        publishedAt: input.published ? /* @__PURE__ */ new Date() : void 0
      });
      return { success: true };
    }),
    update: adminProcedure2.input(
      z2.object({
        id: z2.number(),
        slug: z2.string().optional(),
        title: z2.string().optional(),
        excerpt: z2.string().optional(),
        content: z2.string().optional(),
        coverImage: z2.string().optional(),
        category: z2.string().optional(),
        tags: z2.string().optional(),
        published: z2.boolean().optional()
      })
    ).mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (data.published) data.publishedAt = /* @__PURE__ */ new Date();
      await updatePost(id, data);
      return { success: true };
    }),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deletePost(input.id);
      return { success: true };
    })
  }),
  /* ── Galeria ── */
  gallery: router({
    list: publicProcedure.input(z2.object({ category: z2.string().optional() }).optional()).query(async ({ input }) => {
      return getGalleryItems(input?.category);
    }),
    featured: publicProcedure.query(async () => {
      return getFeaturedGallery();
    }),
    create: adminProcedure2.input(
      z2.object({
        title: z2.string().optional(),
        description: z2.string().optional(),
        imageUrl: z2.string().min(1),
        imageKey: z2.string().optional(),
        category: z2.string().optional(),
        featured: z2.boolean().default(false),
        sortOrder: z2.number().default(0)
      })
    ).mutation(async ({ input }) => {
      await createGalleryItem(input);
      return { success: true };
    })
  }),
  /* ── Contato ── */
  contact: router({
    submit: publicProcedure.input(
      z2.object({
        name: z2.string().min(2, "Nome obrigat\xF3rio"),
        email: z2.string().email("E-mail inv\xE1lido"),
        phone: z2.string().optional(),
        subject: z2.string().optional(),
        message: z2.string().min(10, "Mensagem muito curta"),
        type: z2.enum(["geral", "voluntariado", "doacao", "parceria", "imprensa"]).default("geral")
      })
    ).mutation(async ({ input }) => {
      await createContact(input);
      await notifyOwner({
        title: `Nova mensagem de contato: ${input.name}`,
        content: `**De:** ${input.name} (${input.email})
**Tipo:** ${input.type}
**Assunto:** ${input.subject ?? "\u2014"}

${input.message}`
      });
      return { success: true };
    }),
    list: adminProcedure2.query(async () => {
      return getContacts();
    })
  }),
  /* ── Doações (Stripe) ── */
  donation: router({
    createCheckout: publicProcedure.input(
      z2.object({
        tierId: z2.string().optional(),
        // ID do tier pré-definido
        customAmountBRL: z2.number().min(500).max(1e6).optional(),
        // valor livre em centavos
        donorName: z2.string().optional(),
        donorEmail: z2.string().email().optional(),
        origin: z2.string().url()
        // window.location.origin do frontend
      })
    ).mutation(async ({ input }) => {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Pagamentos n\xE3o configurados." });
      const stripe = new Stripe(stripeKey);
      let amountBRL;
      if (input.tierId) {
        const tier = DONATION_TIERS.find((t2) => t2.id === input.tierId);
        if (!tier) throw new TRPCError3({ code: "BAD_REQUEST", message: "Plano de doa\xE7\xE3o inv\xE1lido." });
        amountBRL = tier.amountBRL;
      } else if (input.customAmountBRL) {
        amountBRL = input.customAmountBRL;
      } else {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Informe um valor de doa\xE7\xE3o." });
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: DONATION_CURRENCY,
              unit_amount: amountBRL,
              product_data: {
                name: DONATION_PRODUCT_NAME,
                description: DONATION_PRODUCT_DESCRIPTION
              }
            },
            quantity: 1
          }
        ],
        customer_email: input.donorEmail,
        metadata: {
          customer_name: input.donorName ?? "",
          customer_email: input.donorEmail ?? "",
          tier_id: input.tierId ?? "custom",
          amount_brl_cents: amountBRL.toString()
        },
        allow_promotion_codes: true,
        success_url: `${input.origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/apoie`
      });
      if (!session.url) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao criar sess\xE3o de pagamento." });
      return { checkoutUrl: session.url };
    })
  }),
  /* ── Canal de Ética ── */
  ethics: router({
    submit: publicProcedure.input(
      z2.object({
        category: z2.enum(["corrupcao", "assedio", "fraude", "conflito_interesses", "desvio_recursos", "discriminacao", "outros"]),
        description: z2.string().min(20, "Descreva o ocorrido com pelo menos 20 caracteres"),
        evidence: z2.string().optional(),
        anonymous: z2.boolean().default(true),
        contactEmail: z2.string().email().optional()
      })
    ).mutation(async ({ input }) => {
      const protocol = `IU${(/* @__PURE__ */ new Date()).getFullYear()}${Math.floor(1e5 + Math.random() * 9e5)}`;
      await createEthicsReport({ ...input, protocol });
      await notifyOwner({
        title: `\u26A0\uFE0F Canal de \xC9tica: nova den\xFAncia recebida`,
        content: `**Protocolo:** ${protocol}
**Categoria:** ${input.category}
**An\xF4nimo:** ${input.anonymous ? "Sim" : "N\xE3o"}

${input.description.slice(0, 300)}${input.description.length > 300 ? "..." : ""}`
      });
      return { success: true, protocol };
    }),
    checkStatus: publicProcedure.input(z2.object({ protocol: z2.string().min(1) })).query(async ({ input }) => {
      const report = await getEthicsReportByProtocol(input.protocol);
      if (!report) throw new TRPCError3({ code: "NOT_FOUND", message: "Protocolo n\xE3o encontrado." });
      return { status: report.status, createdAt: report.createdAt, category: report.category };
    }),
    adminList: adminProcedure2.query(async () => {
      return getEthicsReports();
    })
  }),
  // ── Newsletter ──
  newsletter: router({
    subscribe: publicProcedure.input(z2.object({ email: z2.string().email(), name: z2.string().optional() })).mutation(async ({ input }) => {
      await subscribeNewsletter(input.email, input.name);
      return { success: true };
    })
  }),
  /* ── Cadastro de Alunos ──
   * SEM login/OAuth (o domínio próprio não é aceito pelo OAuth da Manus):
   * o cadastro é público, identificado por CPF e salvo direto no banco
   * MySQL do site hospedado na Hostinger. */
  students: router({
    register: publicProcedure.input(
      z2.object({
        fullName: z2.string().trim().min(5, "Informe o nome completo"),
        cpf: z2.string().trim().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inv\xE1lido").refine(isValidCPF, "CPF inv\xE1lido"),
        address: z2.string().trim().min(3, "Informe o endere\xE7o"),
        number: z2.string().trim().min(1, "Informe o n\xFAmero"),
        neighborhood: z2.string().trim().min(2, "Informe o bairro"),
        city: z2.string().trim().min(2, "Informe a cidade"),
        cep: z2.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inv\xE1lido"),
        birthDate: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inv\xE1lida").refine((d) => {
          const dt = /* @__PURE__ */ new Date(`${d}T00:00:00`);
          return !Number.isNaN(dt.getTime()) && dt < /* @__PURE__ */ new Date() && dt.getFullYear() > 1900;
        }, "Data de nascimento inv\xE1lida"),
        phone: z2.string().trim().min(10, "Informe o telefone com DDD"),
        email: z2.string().trim().email("E-mail inv\xE1lido")
      })
    ).mutation(async ({ input }) => {
      const cpf = input.cpf.replace(/\D/g, "");
      const existing = await findStudentByCpf(cpf);
      const profile = await saveStudentProfile({ ...input, cpf });
      if (!profile) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "N\xE3o foi poss\xEDvel salvar o cadastro. Tente novamente." });
      }
      if (!existing) {
        await notifyOwner({
          title: `\u{1F393} Novo aluno cadastrado: ${input.fullName}`,
          content: `**Nome:** ${input.fullName}
**E-mail:** ${input.email}
**Telefone:** ${input.phone}
**Cidade:** ${input.city}`
        });
      }
      return { success: true, id: profile.id, fullName: profile.fullName };
    }),
    enroll: publicProcedure.input(z2.object({ studentId: z2.number(), courseId: z2.number(), courseSlug: z2.string() })).mutation(async ({ input }) => {
      try {
        await logStudentEnrollment(input.studentId, input.courseId, input.courseSlug);
      } catch {
      }
      return { success: true };
    })
  }),
  /* ── Cursos Gratuitos ── */
  courses: router({
    list: publicProcedure.input(z2.object({ category: z2.string().optional(), level: z2.string().optional() }).optional()).query(async ({ input }) => {
      return getCourses(input?.category, input?.level);
    }),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      const course = await getCourseBySlug(input.slug);
      if (!course) throw new TRPCError3({ code: "NOT_FOUND", message: "Curso n\xE3o encontrado." });
      return course;
    }),
    enroll: protectedProcedure.input(z2.object({ courseId: z2.number() })).mutation(async ({ input, ctx }) => {
      const course = await getCourseById(input.courseId);
      if (!course) throw new TRPCError3({ code: "NOT_FOUND", message: "Curso n\xE3o encontrado." });
      const enrollment = await createEnrollment(ctx.user.id, input.courseId);
      return { success: true, enrollment, platformUrl: course.platformUrl };
    }),
    complete: protectedProcedure.input(z2.object({ enrollmentId: z2.number() })).mutation(async ({ input, ctx }) => {
      await completeEnrollment(input.enrollmentId, ctx.user.id);
      return { success: true };
    }),
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return getMyEnrollments(ctx.user.id);
    }),
    checkEnrollment: protectedProcedure.input(z2.object({ courseId: z2.number() })).query(async ({ input, ctx }) => {
      const enrollment = await getEnrollment(ctx.user.id, input.courseId);
      return enrollment ?? null;
    })
  }),
  /* ── Certificados ── */
  certificates: router({
    issue: protectedProcedure.input(z2.object({ enrollmentId: z2.number(), courseId: z2.number() })).mutation(async ({ input, ctx }) => {
      const cert = await issueCertificate(input.enrollmentId, ctx.user.id, input.courseId);
      return cert;
    }),
    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return getMyCertificates(ctx.user.id);
    }),
    verify: publicProcedure.input(z2.object({ code: z2.string() })).query(async ({ input }) => {
      const result = await getCertificateByCode(input.code);
      if (!result) throw new TRPCError3({ code: "NOT_FOUND", message: "Certificado n\xE3o encontrado." });
      return result;
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/routes-metadata.ts
var SITE_URL = "https://www.institutoubatuba.org.br";
var DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
var routesMetadata = {
  "": {
    title: "Instituto Ubatuba Santu\xE1rio Ecol\xF3gico | Sa\xFAde, Esporte e Meio Ambiente",
    description: "Instituto Ubatuba promove conserva\xE7\xE3o socioambiental em Ubatuba-SP por meio de esporte social, sa\xFAde comunit\xE1ria e preserva\xE7\xE3o ambiental. Conhe\xE7a nossas a\xE7\xF5es.",
    keywords: "instituto ubatuba, santu\xE1rio ecol\xF3gico, conserva\xE7\xE3o ambiental, esporte social, sa\xFAde comunit\xE1ria, ubatuba, ONG ubatuba",
    ogTitle: "Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    ogDescription: "Promovendo sa\xFAde, esporte e meio ambiente para as comunidades de Ubatuba. Some com a gente e fa\xE7a parte da rede.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: SITE_URL,
    priority: 1,
    changefreq: "weekly"
  },
  "sobre": {
    title: "Sobre N\xF3s | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Conhe\xE7a a hist\xF3ria, miss\xE3o, vis\xE3o e valores do Instituto Ubatuba. Atuamos desde 2019 promovendo inclus\xE3o social, sa\xFAde e conserva\xE7\xE3o ambiental em Ubatuba-SP.",
    keywords: "sobre instituto ubatuba, hist\xF3ria, miss\xE3o, vis\xE3o, valores, ODS, conserva\xE7\xE3o, ubatuba",
    ogTitle: "Sobre o Instituto Ubatuba",
    ogDescription: "Nossa hist\xF3ria, miss\xE3o e valores. Atuamos com sa\xFAde, esporte social e meio ambiente em Ubatuba-SP.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/sobre`,
    priority: 0.8,
    changefreq: "monthly"
  },
  "programas": {
    title: "A\xE7\xF5es e Programas | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Conhe\xE7a os programas do Instituto Ubatuba: Escolinhas de Surfe, Futebol e Futev\xF4lei, A\xE7\xF5es de Sa\xFAde, Projeto Itagu\xE1 Azul, Bituqueira Ecol\xF3gica e mais.",
    keywords: "programas sociais ubatuba, escolinha de surfe, futebol social, sa\xFAde comunit\xE1ria, itagu\xE1 azul, bituqueira ecol\xF3gica",
    ogTitle: "A\xE7\xF5es e Programas | Instituto Ubatuba",
    ogDescription: "Escolinhas de Surfe, Futebol, Futev\xF4lei, A\xE7\xF5es de Sa\xFAde, Projeto Itagu\xE1 Azul e Bituqueira Ecol\xF3gica.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/programas`,
    priority: 0.9,
    changefreq: "monthly"
  },
  "galeria": {
    title: "Galeria de Fotos | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Veja fotos das atividades do Instituto Ubatuba: esportes, a\xE7\xF5es de sa\xFAde, conserva\xE7\xE3o ambiental, festivais culturais e muito mais.",
    keywords: "galeria fotos ubatuba, fotos esporte social, fotos conserva\xE7\xE3o ambiental, instituto ubatuba fotos",
    ogTitle: "Galeria de Fotos | Instituto Ubatuba",
    ogDescription: "Registros fotogr\xE1ficos das nossas a\xE7\xF5es em esporte, sa\xFAde e meio ambiente em Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/galeria`,
    priority: 0.7,
    changefreq: "weekly"
  },
  "apoie": {
    title: "Apoie o Instituto Ubatuba | Doe, Seja Volunt\xE1rio ou Parceiro",
    description: "Apoie o Instituto Ubatuba: fa\xE7a uma doa\xE7\xE3o, seja volunt\xE1rio ou torne-se parceiro institucional. Juntos transformamos vidas em Ubatuba-SP.",
    keywords: "doar instituto ubatuba, volunt\xE1rio ubatuba, parceiro ONG, apoiar conserva\xE7\xE3o, doa\xE7\xE3o social ubatuba",
    ogTitle: "Apoie o Instituto Ubatuba",
    ogDescription: "Fa\xE7a uma doa\xE7\xE3o, seja volunt\xE1rio ou torne-se parceiro. Juntos transformamos vidas em Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/apoie`,
    priority: 0.9,
    changefreq: "monthly"
  },
  "contato": {
    title: "Contato | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Entre em contato com o Instituto Ubatuba. Envie sua mensagem, visite nosso endere\xE7o em Ubatuba-SP ou ligue para n\xF3s. Estamos prontos para atender.",
    keywords: "contato instituto ubatuba, endere\xE7o ubatuba, telefone instituto ubatuba, fale conosco",
    ogTitle: "Contato | Instituto Ubatuba",
    ogDescription: "Entre em contato conosco. Estamos em Ubatuba-SP prontos para atender voc\xEA.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/contato`,
    priority: 0.7,
    changefreq: "monthly"
  },
  "noticias": {
    title: "Not\xEDcias e Blog | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Acompanhe as \xFAltimas not\xEDcias do Instituto Ubatuba: a\xE7\xF5es realizadas, eventos, parcerias e resultados dos nossos programas socioambientais.",
    keywords: "not\xEDcias instituto ubatuba, blog ONG ubatuba, a\xE7\xF5es sociais ubatuba, eventos ubatuba",
    ogTitle: "Not\xEDcias | Instituto Ubatuba",
    ogDescription: "\xDAltimas not\xEDcias e artigos sobre nossas a\xE7\xF5es em sa\xFAde, esporte e meio ambiente.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/noticias`,
    priority: 0.8,
    changefreq: "weekly"
  },
  "transparencia": {
    title: "Transpar\xEAncia e Governan\xE7a | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Acesse documentos p\xFAblicos, relat\xF3rios financeiros, estatuto social e informa\xE7\xF5es de governan\xE7a do Instituto Ubatuba. Compromisso com a transpar\xEAncia.",
    keywords: "transpar\xEAncia ONG, governan\xE7a instituto ubatuba, relat\xF3rio financeiro, estatuto social, presta\xE7\xE3o de contas",
    ogTitle: "Transpar\xEAncia | Instituto Ubatuba",
    ogDescription: "Documentos p\xFAblicos, relat\xF3rios financeiros e informa\xE7\xF5es de governan\xE7a. Nosso compromisso com a transpar\xEAncia.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/transparencia`,
    priority: 0.8,
    changefreq: "monthly"
  },
  "mascotes": {
    title: "Mascotes | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Conhe\xE7a os mascotes do Instituto Ubatuba: personagens que representam a fauna local e educam sobre conserva\xE7\xE3o ambiental de forma l\xFAdica.",
    keywords: "mascotes instituto ubatuba, personagens fauna, educa\xE7\xE3o ambiental, conserva\xE7\xE3o l\xFAdica, animais ubatuba",
    ogTitle: "Mascotes | Instituto Ubatuba",
    ogDescription: "Personagens que representam a fauna local e educam sobre conserva\xE7\xE3o ambiental.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/mascotes`,
    priority: 0.6,
    changefreq: "monthly"
  },
  "obrigado": {
    title: "Obrigado pela Doa\xE7\xE3o | Instituto Ubatuba",
    description: "Agradecemos sua contribui\xE7\xE3o ao Instituto Ubatuba. Sua doa\xE7\xE3o ajuda a transformar vidas em Ubatuba atrav\xE9s de esporte, sa\xFAde e conserva\xE7\xE3o ambiental.",
    keywords: "obrigado doa\xE7\xE3o, confirma\xE7\xE3o pagamento, instituto ubatuba",
    ogTitle: "Obrigado! | Instituto Ubatuba",
    ogDescription: "Sua doa\xE7\xE3o faz a diferen\xE7a. Obrigado por apoiar o Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/obrigado`,
    priority: 0.3,
    changefreq: "yearly"
  },
  "cursos": {
    title: "Cursos Gratuitos | Instituto Ubatuba Santu\xE1rio Ecol\xF3gico",
    description: "Acesse cursos gratuitos de universidades como Harvard, MIT, USP, FGV e plataformas governamentais. Educa\xE7\xE3o de qualidade para todos, com certificado do Instituto Ubatuba.",
    keywords: "cursos gratuitos, harvard, mit, usp, fgv, educa\xE7\xE3o gratuita, certificado, instituto ubatuba",
    ogTitle: "Cursos Gratuitos | Instituto Ubatuba",
    ogDescription: "Cursos gratuitos das melhores universidades do mundo com certificado do Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/cursos`,
    priority: 0.9,
    changefreq: "weekly"
  },
  "meus-certificados": {
    title: "Meus Cursos e Certificados | Instituto Ubatuba",
    description: "Acompanhe seus cursos em andamento e certificados emitidos pelo Instituto Ubatuba.",
    keywords: "meus cursos, certificados, progresso, instituto ubatuba",
    ogTitle: "Meus Certificados | Instituto Ubatuba",
    ogDescription: "Acompanhe seus cursos e certificados no Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/meus-certificados`,
    priority: 0.4,
    changefreq: "monthly"
  }
};
function getRouteMetadata(path3) {
  const cleanPath = path3.replace(/^\//, "").replace(/\/$/, "");
  if (routesMetadata[cleanPath]) {
    return routesMetadata[cleanPath];
  }
  if (cleanPath.startsWith("noticias/")) {
    const slug = cleanPath.replace("noticias/", "");
    return {
      title: `${formatSlugToTitle(slug)} | Instituto Ubatuba`,
      description: `Leia sobre ${formatSlugToTitle(slug).toLowerCase()} no blog do Instituto Ubatuba Santu\xE1rio Ecol\xF3gico.`,
      keywords: `${slug.replace(/-/g, ", ")}, instituto ubatuba, blog`,
      ogTitle: `${formatSlugToTitle(slug)} | Instituto Ubatuba`,
      ogDescription: `Artigo do Instituto Ubatuba sobre ${formatSlugToTitle(slug).toLowerCase()}.`,
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${SITE_URL}/noticias/${slug}`,
      priority: 0.7,
      changefreq: "monthly"
    };
  }
  if (cleanPath.startsWith("cursos/")) {
    const slug = cleanPath.replace("cursos/", "");
    return {
      title: `${formatSlugToTitle(slug)} | Cursos Gratuitos | Instituto Ubatuba`,
      description: `Curso gratuito: ${formatSlugToTitle(slug)}. Acesse na plataforma parceira e receba certificado do Instituto Ubatuba.`,
      keywords: `${slug.replace(/-/g, ", ")}, curso gratuito, instituto ubatuba, certificado`,
      ogTitle: `${formatSlugToTitle(slug)} | Cursos | Instituto Ubatuba`,
      ogDescription: `Curso gratuito com certificado do Instituto Ubatuba.`,
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${SITE_URL}/cursos/${slug}`,
      priority: 0.7,
      changefreq: "monthly"
    };
  }
  return routesMetadata[""];
}
function formatSlugToTitle(slug) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function getAllStaticRoutes() {
  return Object.entries(routesMetadata).filter(([path3]) => path3 !== "obrigado").map(([path3, metadata]) => ({
    path: path3 === "" ? "/" : `/${path3}`,
    metadata
  }));
}

// server/_core/vite.ts
function injectSEOMetaTags(html, url) {
  const metadata = getRouteMetadata(url);
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${metadata.title}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`
  );
  const seoTags = `
    <meta name="keywords" content="${escapeHtml(metadata.keywords)}" />
    <link rel="canonical" href="${metadata.canonical}" />
    <meta property="og:title" content="${escapeHtml(metadata.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(metadata.ogDescription)}" />
    <meta property="og:image" content="${metadata.ogImage}" />
    <meta property="og:url" content="${metadata.canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Instituto Ubatuba Santu\xE1rio Ecol\xF3gico" />
    <meta property="og:locale" content="pt_BR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.ogDescription)}" />
    <meta name="twitter:image" content="${metadata.ogImage}" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Instituto Ubatuba Santu\xE1rio Ecol\xF3gico" />
    <meta name="geo.region" content="BR-SP" />
    <meta name="geo.placename" content="Ubatuba" />`;
  html = html.replace("</head>", `${seoTags}
  </head>`);
  return html;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      template = injectSEOMetaTags(template, url);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (req, res) => {
    const indexPath = path2.resolve(distPath, "index.html");
    let html = fs2.readFileSync(indexPath, "utf-8");
    html = injectSEOMetaTags(html, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}

// server/stripe-webhook.ts
import express2 from "express";
import Stripe2 from "stripe";
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe2(key);
}
function registerStripeWebhook(app) {
  app.post(
    "/api/stripe/webhook",
    express2.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;
      try {
        if (!webhookSecret) {
          event = JSON.parse(req.body.toString());
        } else {
          const stripe = getStripe();
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        res.status(400).send("Webhook signature verification failed");
        return;
      }
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }
      console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            const amountBRL = session.amount_total ? (session.amount_total / 100).toFixed(2) : "\u2014";
            const donorName = session.metadata?.customer_name ?? session.customer_details?.name ?? "An\xF4nimo";
            const donorEmail = session.metadata?.customer_email ?? session.customer_details?.email ?? "\u2014";
            await notifyOwner({
              title: `\u{1F49A} Nova doa\xE7\xE3o recebida: R$ ${amountBRL}`,
              content: `**Doador:** ${donorName}
**E-mail:** ${donorEmail}
**Valor:** R$ ${amountBRL}
**Status:** ${session.payment_status}
**ID da sess\xE3o:** ${session.id}`
            });
            break;
          }
          case "payment_intent.payment_failed": {
            const intent = event.data.object;
            console.warn(`[Stripe Webhook] Payment failed: ${intent.id}`);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }
      res.json({ received: true });
    }
  );
}

// server/seo.ts
import { eq as eq2 } from "drizzle-orm";
function registerSEORoutes(app) {
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

# Bloquear rotas internas
Disallow: /api/
Disallow: /obrigado

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robotsTxt);
  });
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const staticRoutes = getAllStaticRoutes();
      let dynamicUrls = [];
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const publishedPosts = await db.select({
          slug: posts.slug,
          updatedAt: posts.updatedAt
        }).from(posts).where(eq2(posts.published, true));
        dynamicUrls = publishedPosts.map((post) => ({
          loc: `${SITE_URL}/noticias/${post.slug}`,
          lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          changefreq: "monthly",
          priority: 0.7
        }));
      } catch {
        console.warn("[SEO] Could not fetch posts for sitemap, continuing with static routes only");
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const urls = [
        ...staticRoutes.map((route) => ({
          loc: route.metadata.canonical,
          lastmod: today,
          changefreq: route.metadata.changefreq,
          priority: route.metadata.priority
        })),
        ...dynamicUrls
      ];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(
        (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
      ).join("\n")}
</urlset>`;
      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("[SEO] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
}
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express3();
  const server = createServer(app);
  registerStripeWebhook(app);
  app.use(express3.json({ limit: "50mb" }));
  app.use(express3.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerSEORoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
