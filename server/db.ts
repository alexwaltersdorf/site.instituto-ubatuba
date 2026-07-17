import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { certificates, contacts, courses, enrollments, ethicsReports, gallery, InsertContact, InsertEthicsReport, InsertGalleryItem, InsertPost, InsertUser, newsletterSubscribers, posts, users } from "../drizzle/schema";
import type { InsertCourse, InsertEnrollment } from "../drizzle/schema";
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
export async function getActiveCourses(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(courses).where(and(eq(courses.active, true), eq(courses.category, category as any))).orderBy(courses.sortOrder);
  }
  return db.select().from(courses).where(eq(courses.active, true)).orderBy(courses.sortOrder);
}

export async function getFeaturedCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(and(eq(courses.active, true), eq(courses.featured, true))).orderBy(courses.sortOrder).limit(6);
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

export async function getAllCourses(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).orderBy(desc(courses.createdAt)).limit(limit);
}

/* ── Inscrições ── */
export async function enrollInCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if already enrolled
  const existing = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  if (existing.length > 0) return existing[0];
  const [result] = await db.insert(enrollments).values({ userId, courseId }).$returningId();
  return { id: result.id, userId, courseId, status: "inscrito" as const, progress: 0, startedAt: new Date() };
}

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    enrollment: enrollments,
    course: courses,
  }).from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.startedAt));
}

export async function getEnrollment(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0];
}

export async function completeCourse(enrollmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(enrollments).set({ status: "concluido", progress: 100, completedAt: new Date() }).where(eq(enrollments.id, enrollmentId));
}

/* ── Certificados ── */
export async function createCertificate(data: { userId: number; courseId: number; enrollmentId: number; userName: string; courseName: string; institution: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const code = `IU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const [result] = await db.insert(certificates).values({ ...data, code }).$returningId();
  // Update enrollment with certificate ID
  await db.update(enrollments).set({ certificateId: result.id }).where(eq(enrollments.id, data.enrollmentId));
  return { id: result.id, code };
}

export async function getCertificateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.code, code)).limit(1);
  return result[0];
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issuedAt));
}
