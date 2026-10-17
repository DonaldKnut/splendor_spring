import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.env.NGO_HEAD_ADMIN_EMAIL ?? "admin@ngo.local").toLowerCase();
  const password = process.env.NGO_HEAD_ADMIN_PASSWORD ?? "ChangeMeOnFirstLogin!";
  const name = process.env.NGO_HEAD_ADMIN_NAME ?? "NGO Administrator";
  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      role: "HEAD_ADMIN",
      status: "ACTIVE",
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
    },
    update: {
      name,
      passwordHash,
      role: "HEAD_ADMIN",
      status: "ACTIVE",
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
    },
  });

  const defaults: Record<string, string> = {
    org_name: "Splendor Community Initiative",
    org_tagline: "Serving communities with integrity",
    org_intro:
      "<p>We fund community programmes, publish grants, and host events that lift local families. Administrators manage every appeal from the control room.</p>",
    mission: "<p>Equip communities with education, care, and opportunity.</p>",
    vision: "<p>A region where every child and caregiver can thrive.</p>",
    values: "<p>Integrity · Compassion · Accountability · Partnership</p>",
    whatsapp_number: process.env.NGO_WHATSAPP_NUMBER ?? "",
    whatsapp_default_message:
      process.env.NGO_WHATSAPP_DEFAULT_MESSAGE ??
      "Hello, I would like to learn more about your organisation.",
  };

  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const about = await db.contentPage.findUnique({ where: { slug: "about" } });
  if (!about) {
    await db.contentPage.create({
      data: {
        title: "About",
        slug: "about",
        pageType: "about",
        status: "PUBLISHED",
        publishedAt: new Date(),
        content:
          "<p>About content is configurable. Administrators should publish verified organisational information only.</p>",
      },
    });
  }

  const programme = await db.programme.upsert({
    where: { slug: "community-care" },
    create: {
      title: "Community Care",
      slug: "community-care",
      summary: "Support for families and neighbourhood learning hubs.",
      content: "<p>Direct support for learning materials, family care, and safe gathering spaces.</p>",
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(),
    },
    update: {},
  });

  const eventStarts = new Date();
  eventStarts.setDate(eventStarts.getDate() + 21);
  const event = await db.event.upsert({
    where: { slug: "spring-community-day" },
    create: {
      title: "Spring Community Day",
      slug: "spring-community-day",
      summary: "A family day of learning, music, and giving.",
      description:
        "<p>Join neighbours for workshops, youth performances, and a fundraising drive for classroom materials.</p>",
      venue: "Community Hall",
      location: "Lagos",
      startsAt: eventStarts,
      capacity: 200,
      featured: true,
      status: "PUBLISHED",
      programmeId: programme.id,
      publishedAt: new Date(),
    },
    update: {},
  });

  await db.campaign.upsert({
    where: { slug: "classroom-materials-drive" },
    create: {
      title: "Classroom Materials Drive",
      slug: "classroom-materials-drive",
      summary: "Books, kits, and supplies for neighbourhood learners.",
      description:
        "Every verified gift goes toward learning kits for children in partner programmes.",
      goalAmount: 2500000,
      currency: "NGN",
      featured: true,
      status: "PUBLISHED",
      programmeId: programme.id,
      eventId: event.id,
      publishedAt: new Date(),
    },
    update: {},
  });

  await db.grant.upsert({
    where: { slug: "youth-micro-grants-2026" },
    create: {
      title: "Youth Micro-Grants 2026",
      slug: "youth-micro-grants-2026",
      summary: "Small grants for youth-led community projects.",
      description:
        "<p>Open to youth groups with a clear community benefit plan. Awards support materials, training, and local delivery.</p>",
      amountMin: 50000,
      amountMax: 250000,
      currency: "NGN",
      category: "Youth",
      eligibility: "Youth-led groups (18–30) operating within partner communities.",
      applicationUrl: "mailto:grants@example.org",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      featured: true,
      status: "OPEN",
      programmeId: programme.id,
      publishedAt: new Date(),
    },
    update: {},
  });

  const existingPoll = await db.poll.findUnique({ where: { slug: "priority-for-next-outreach" } });
  if (!existingPoll) {
    await db.poll.create({
      data: {
        title: "What should we prioritise at the next outreach?",
        slug: "priority-for-next-outreach",
        description: "Help us plan Spring Community Day.",
        status: "OPEN",
        eventId: event.id,
        publishedAt: new Date(),
        options: {
          create: [
            { label: "Learning kits for children", sortOrder: 0 },
            { label: "Family health screening", sortOrder: 1 },
            { label: "Youth skills workshop", sortOrder: 2 },
          ],
        },
      },
    });
  }

  console.log("NGO seed complete.");
  console.log(`Head Admin email: ${email}`);
  console.log(`Head Admin password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
