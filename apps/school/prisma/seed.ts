import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const ABOUT_HTML = `
<p><strong>Splendor Spring School Ltd</strong> is a child-centred school located in Makoko, Lagos, established with a simple but powerful conviction: every child deserves the opportunity to learn, grow and fulfil their God-given potential, regardless of their family's financial circumstances.</p>
<p>The school was founded by <strong>Opeyemi Elebiju Josephine (née Ojaekomo)</strong> out of a deep passion for education and a desire to make quality learning accessible to children in underserved communities.</p>
<p>Located at <strong>26, Aganmayo Lane, Apollo, Makoko, Lagos</strong>, Splendor Spring School serves children from nursery through primary education. We provide <strong>affordable education</strong> to children from low-income families, and we offer <strong>free education</strong> to those whose parents genuinely cannot afford school fees. Our vision goes beyond the classroom — we are building a school where children who might otherwise be left behind can discover their abilities, develop confidence and prepare for a brighter future.</p>
<p>This commitment reflects our belief that poverty should never be a barrier to a child's education.</p>
<p>Today, Splendor Spring School serves <strong>over 200 children</strong> with a dedicated team of teachers committed to nurturing every child. We continue to grow with the long-term vision of building a sustainable institution that will serve generations of children in the community.</p>
<p>Our motto, <em>“Nurturing to Greater Heights,”</em> captures what we desire for every child who passes through our doors.</p>
`.trim();

const MISSION_HTML = `
<p>To provide accessible, affordable and quality education in a safe, nurturing and stimulating environment where every child can develop academically, socially, creatively and morally, regardless of their socio-economic background.</p>
`.trim();

const VISION_HTML = `
<p>To raise confident, knowledgeable, compassionate and responsible children who are equipped to reach their full potential and make meaningful contributions to their families, communities and the wider world.</p>
<p>We envision Splendor Spring School becoming a sustainable institution that will continue to transform lives and provide quality education for generations to come.</p>
`.trim();

const VALUES_HTML = `
<ul>
  <li><strong>Excellence</strong> – We encourage every child to give their best and continually improve.</li>
  <li><strong>Integrity</strong> – We teach honesty, responsibility and good character.</li>
  <li><strong>Compassion</strong> – We care about others and recognise the dignity and needs of every child.</li>
  <li><strong>Godly values and moral integrity</strong> – We encourage strong moral foundations that guide the choices children make.</li>
  <li><strong>Inclusiveness</strong> – We believe every child deserves an opportunity to learn and thrive.</li>
  <li><strong>Service</strong> – We encourage children to understand their responsibility towards their community and society.</li>
</ul>
`.trim();

const APPROACH_HTML = `
<p>We combine strong reading, writing and mathematics with practical learning, creative arts and character development. We want our pupils not only to know what they have been taught, but also to understand how to apply their knowledge in everyday life.</p>
<p>Our learning experiences include literacy and numeracy, phonics and early reading, mathematics and problem-solving, science and discovery, creative arts and cultural activities, English language and communication, social and moral development, practical and hands-on learning, environmental awareness, and teamwork.</p>
<p>We also expose our pupils to learning experiences beyond the traditional classroom through educational partnerships, exhibitions, cultural activities and practical projects.</p>
`.trim();

/** Brand keys are refreshed on every seed so the public site stays aligned with official copy. */
const BRAND_KEYS = new Set([
  "school_name",
  "school_tagline",
  "school_intro",
  "school_address",
  "school_phone",
  "school_email",
  "school_facebook",
  "mission",
  "vision",
  "values",
  "school_motto",
  "school_proprietor",
  "educational_approach",
  "coming_soon",
  "whatsapp_number",
  "whatsapp_default_message",
]);

const COMING_SOON =
  "School events, pupils' achievements, classroom activities, educational projects and community initiatives will be shared regularly through our website and social media platforms.";

async function main() {
  const email = (
    process.env.SCHOOL_HEAD_ADMIN_EMAIL ?? "admin@splendorschool.local"
  ).toLowerCase();
  const password =
    process.env.SCHOOL_HEAD_ADMIN_PASSWORD ?? "ChangeMeOnFirstLogin!";
  const name = process.env.SCHOOL_HEAD_ADMIN_NAME ?? "Head Administrator";

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
    school_name: "Splendor Spring School",
    school_tagline: "Nurturing to Greater Heights",
    school_intro: ABOUT_HTML,
    school_address: "26, Aganmayo Lane, Apollo, Makoko",
    school_phone: "09029308463 / 07068447585",
    school_email: "deroyalesplendorschool@gmail.com",
    school_facebook: "https://www.facebook.com/share/19hd4TypHj/",
    mission: MISSION_HTML,
    vision: VISION_HTML,
    values: VALUES_HTML,
    school_motto: "Nurturing to Greater Heights",
    school_proprietor: "Mrs. Opeyemi Elebiju Josephine",
    educational_approach: APPROACH_HTML,
    coming_soon: COMING_SOON,
    ca_max: "40",
    exam_max: "60",
    whatsapp_number: process.env.SCHOOL_WHATSAPP_NUMBER ?? "08186431261",
    whatsapp_default_message:
      process.env.SCHOOL_WHATSAPP_DEFAULT_MESSAGE ??
      "Hello Splendor Spring School, I would like to enquire about admissions.",
  };

  for (const [key, value] of Object.entries(defaults)) {
    const shouldRefresh = BRAND_KEYS.has(key);
    await db.setting.upsert({
      where: { key },
      create: { key, value },
      update: shouldRefresh ? { value } : {},
    });
  }

  const grading = [
    { name: "Excellent", minScore: 70, maxScore: 100, grade: "A", remark: "Excellent", sortOrder: 1 },
    { name: "Very Good", minScore: 60, maxScore: 69.99, grade: "B", remark: "Very Good", sortOrder: 2 },
    { name: "Good", minScore: 50, maxScore: 59.99, grade: "C", remark: "Good", sortOrder: 3 },
    { name: "Pass", minScore: 40, maxScore: 49.99, grade: "D", remark: "Pass", sortOrder: 4 },
    { name: "Fail", minScore: 0, maxScore: 39.99, grade: "F", remark: "Fail", sortOrder: 5 },
  ];

  for (const g of grading) {
    const existing = await db.gradingScale.findFirst({
      where: { grade: g.grade, name: g.name },
    });
    if (!existing) {
      await db.gradingScale.create({ data: g });
    }
  }

  await db.assessmentComponent.upsert({
    where: { code: "CA" },
    create: { name: "Continuous Assessment", code: "CA", maxScore: 40, weight: 1, sortOrder: 1 },
    update: {},
  });
  await db.assessmentComponent.upsert({
    where: { code: "EXAM" },
    create: { name: "Examination", code: "EXAM", maxScore: 60, weight: 1, sortOrder: 2 },
    update: {},
  });

  await db.contentPage.upsert({
    where: { slug: "about" },
    create: {
      title: "About Splendor Spring School",
      slug: "about",
      pageType: "about",
      status: "PUBLISHED",
      publishedAt: new Date(),
      excerpt:
        "Affordable education for low-income families in Makoko — and free education for children whose parents genuinely cannot afford school fees.",
      content: ABOUT_HTML,
      metaTitle: "About | Splendor Spring School",
      metaDescription:
        "Learn about Splendor Spring School in Makoko, Lagos — affordable fees, free education for those who cannot pay, mission, vision and values.",
    },
    update: {
      title: "About Splendor Spring School",
      excerpt:
        "Affordable education for low-income families in Makoko — and free education for children whose parents genuinely cannot afford school fees.",
      content: ABOUT_HTML,
      metaTitle: "About | Splendor Spring School",
      metaDescription:
        "Learn about Splendor Spring School in Makoko, Lagos — affordable fees, free education for those who cannot pay, mission, vision and values.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  const news = [
    {
      title: "2026/2027 Academic Session",
      slug: "2026-2027-academic-session",
      excerpt:
        "Splendor Spring School welcomes pupils into a new academic session of learning, growth and discovery.",
      content:
        "<p>Splendor Spring School welcomes pupils into a new academic session of learning, growth and discovery. We look forward to another year of nurturing every child to greater heights.</p>",
    },
    {
      title: "Learning Beyond the Classroom",
      slug: "learning-beyond-the-classroom",
      excerpt:
        "Our pupils continue to participate in creative, cultural, environmental and practical learning activities.",
      content:
        "<p>Our pupils continue to participate in creative, cultural, environmental and practical learning activities that deepen understanding and build confidence beyond the traditional classroom.</p>",
    },
    {
      title: "Community Impact",
      slug: "community-impact",
      excerpt:
        "Affordable education for struggling families — and free education for children whose parents genuinely cannot afford school fees.",
      content:
        "<p>At Splendor Spring School, we provide affordable education to children from low-income families and free education to those whose parents genuinely cannot afford school fees. Poverty should never be a barrier to a child's education — we are building a school where children who might otherwise be left behind can discover their abilities and prepare for a brighter future.</p>",
    },
    {
      title: "School Development",
      slug: "school-development",
      excerpt:
        "We are continually improving our learning environment and facilities to create a more comfortable and inspiring space for our pupils.",
      content:
        "<p>We are continually improving our learning environment and facilities to create a more comfortable and inspiring space for our pupils.</p>",
    },
    {
      title: "Educational Partnerships",
      slug: "educational-partnerships",
      excerpt:
        "We value partnerships that expose our pupils to new ideas, cultures, creative experiences and opportunities beyond their immediate environment.",
      content:
        "<p>We value partnerships that expose our pupils to new ideas, cultures, creative experiences and opportunities beyond their immediate environment.</p>",
    },
  ];

  for (const item of news) {
    await db.announcement.upsert({
      where: { slug: item.slug },
      create: {
        ...item,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        status: "PUBLISHED",
      },
    });
  }

  // Baseline academic structure (only if empty)
  const classCount = await db.schoolClass.count();
  if (classCount === 0) {
    const classDefs = [
      {
        name: "Kindergarten",
        code: "KG",
        level: "Early Years",
        sortOrder: 1,
        description: "Play, songs and early learning in a warm classroom.",
      },
      {
        name: "Nursery 1",
        code: "NUR1",
        level: "Nursery",
        sortOrder: 2,
        description: "Phonics, early literacy and numeracy in a caring classroom.",
      },
      {
        name: "Nursery 2",
        code: "NUR2",
        level: "Nursery",
        sortOrder: 3,
        description: "Stronger foundations preparing children for primary learning.",
      },
      {
        name: "Primary 1",
        code: "PRI1",
        level: "Primary",
        sortOrder: 10,
        description: "Primary foundations in literacy, numeracy and character.",
      },
      {
        name: "Primary 2",
        code: "PRI2",
        level: "Primary",
        sortOrder: 11,
        description: "Building confidence across core subjects and practical learning.",
      },
      {
        name: "Primary 3",
        code: "PRI3",
        level: "Primary",
        sortOrder: 12,
        description: "Deepening academic skills with creativity and discovery.",
      },
      {
        name: "Primary 4",
        code: "PRI4",
        level: "Primary",
        sortOrder: 13,
        description: "Stronger problem-solving, communication and teamwork.",
      },
      {
        name: "Primary 5",
        code: "PRI5",
        level: "Primary",
        sortOrder: 14,
        description: "Preparing pupils for higher primary expectations with care.",
      },
      {
        name: "Primary 6",
        code: "PRI6",
        level: "Primary",
        sortOrder: 15,
        description: "Culminating primary year — confidence, character and readiness.",
      },
    ];

    const createdClasses = [];
    for (const c of classDefs) {
      createdClasses.push(await db.schoolClass.create({ data: c }));
    }

    const subjects = [
      { name: "English Language", code: "ENG" },
      { name: "Mathematics", code: "MATH" },
      { name: "Basic Science", code: "SCI" },
      { name: "Creative Arts", code: "ART" },
      { name: "Social & Moral Education", code: "SME" },
    ];
    for (const s of subjects) {
      const subject = await db.subject.upsert({
        where: { code: s.code },
        create: s,
        update: {},
      });
      for (const cls of createdClasses) {
        await db.classSubject.upsert({
          where: {
            classId_subjectId: { classId: cls.id, subjectId: subject.id },
          },
          create: { classId: cls.id, subjectId: subject.id },
          update: {},
        });
      }
    }
  }

  const sessionCount = await db.academicSession.count();
  if (sessionCount === 0) {
    const year = new Date().getFullYear();
    const session = await db.academicSession.create({
      data: {
        name: `${year}/${year + 1}`,
        isCurrent: true,
        isActive: true,
      },
    });
    await db.term.createMany({
      data: [
        { sessionId: session.id, name: "First Term", sortOrder: 1, isCurrent: true },
        { sessionId: session.id, name: "Second Term", sortOrder: 2 },
        { sessionId: session.id, name: "Third Term", sortOrder: 3 },
      ],
    });
  }

  console.log("School seed complete.");
  console.log(`Head Admin email: ${email}`);
  console.log("Set SCHOOL_HEAD_ADMIN_PASSWORD via env before production use.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
