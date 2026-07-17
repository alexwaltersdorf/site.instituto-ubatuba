import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { certificates, contacts, courses, enrollments, ethicsReports, gallery, InsertContact, InsertCourse, InsertEthicsReport, InsertGalleryItem, InsertPost, InsertUser, newsletterSubscribers, posts, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/* ── Usuários ── */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/* ── Posts do Blog ── */
export async function getPublishedPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return result[0];
}

export async function getAllPosts(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(posts).values(data);
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(posts).where(eq(posts.id, id));
}

/* ── Galeria ── */
export async function getGalleryItems(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(gallery).where(eq(gallery.category, category)).orderBy(gallery.sortOrder);
  }
  return db.select().from(gallery).orderBy(gallery.sortOrder);
}

export async function getFeaturedGallery() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gallery).where(eq(gallery.featured, true)).orderBy(gallery.sortOrder).limit(12);
}

export async function createGalleryItem(data: InsertGalleryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(gallery).values(data);
}

/* ── Contatos ── */
export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contacts).values(data);
}

export async function getContacts(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(limit);
}

/* ── Canal de Ética ── */
export async function createEthicsReport(data: InsertEthicsReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ethicsReports).values(data);
}

export async function getEthicsReportByProtocol(protocol: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ethicsReports).where(eq(ethicsReports.protocol, protocol)).limit(1);
  return result[0];
}

export async function getEthicsReports(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ethicsReports).orderBy(desc(ethicsReports.createdAt)).limit(limit);
}

// ── Newsletter ──
export async function subscribeNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(newsletterSubscribers).values({ email, name: name ?? null, lgpdConsent: true }).onDuplicateKeyUpdate({ set: { active: true } });
}

export async function getNewsletterSubscribers(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.active, true)).orderBy(desc(newsletterSubscribers.createdAt)).limit(limit);
}

/* ── Cursos ── */
export async function getCourses(category?: string, level?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(courses.active, true)];
  if (category) conditions.push(eq(courses.category, category));
  if (level) conditions.push(eq(courses.level, level as "iniciante" | "intermediario" | "avancado"));
  return db.select().from(courses).where(and(...conditions)).orderBy(desc(courses.createdAt));
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.active, true))).limit(1);
  return result[0];
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courses).values(data);
}

/* ── Enrollments ── */
export async function createEnrollment(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if already enrolled
  const existing = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(enrollments).values({ userId, courseId, status: "active" });
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}

export async function getMyEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrolledAt));
}

export async function completeEnrollment(enrollmentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(enrollments).set({ status: "completed", completedAt: new Date() }).where(and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, userId)));
}

export async function getEnrollment(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}

/* ── Certificates ── */
export async function issueCertificate(enrollmentId: number, userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if already issued
  const existing = await db.select().from(certificates).where(and(eq(certificates.enrollmentId, enrollmentId), eq(certificates.userId, userId))).limit(1);
  if (existing.length > 0) return existing[0];
  const code = `IU${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await db.insert(certificates).values({ enrollmentId, userId, courseId, code });
  const result = await db.select().from(certificates).where(eq(certificates.code, code)).limit(1);
  return result[0];
}

export async function getMyCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ certificate: certificates, course: courses })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));
}

export async function getCertificateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({ certificate: certificates, course: courses })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.code, code))
    .limit(1);
  return result[0];
}
