/**
 * Splendor Spring School media — Cloudinary delivery URLs.
 * Swap any `src` when new assets are uploaded; keep `id` stable.
 */

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

const CLOUD = "https://res.cloudinary.com/ls40ecmc/image/upload";

export const SCHOOL_BRAND = {
  logo: `${CLOUD}/v1791613389/logo_school.jpg`,
  proprietor: `${CLOUD}/v1791611598/miss_yemi.jpg`,
  proprietorName: "Mrs. Opeyemi Elebiju",
} as const;

export const SCHOOL_GALLERY = {
  hero: [
    {
      id: "hero-1",
      src: `${CLOUD}/v1791613388/joinf.jpg`,
      alt: "Educational partnership and book donation with Splendor Spring School",
      caption: "Learning with partners",
    },
    {
      id: "hero-2",
      src: `${CLOUD}/v1791613388/kiddies.jpg`,
      alt: "Splendor Spring School pupils celebrating Children's Day",
      caption: "Joyful pupils",
    },
    {
      id: "hero-3",
      src: `${CLOUD}/v1791613388/kidsss.jpg`,
      alt: "Pupils posing with their art exhibition at Splendor Spring School",
      caption: "Creative minds",
    },
    {
      id: "hero-4",
      src: `${CLOUD}/v1791613388/kidds.jpg`,
      alt: "Pupils enjoying a fun day on the school playground",
      caption: "Play & friendship",
    },
  ] satisfies GalleryImage[],

  campusLife: [
    {
      id: "campus-1",
      src: `${CLOUD}/v1791613388/kiddies.jpg`,
      alt: "Splendor Spring School pupils celebrating together",
      caption: "Happy Children Day",
    },
    {
      id: "campus-2",
      src: `${CLOUD}/v1791613388/kidsss.jpg`,
      alt: "Pupils with their creative art display",
      caption: "Creative arts",
    },
    {
      id: "campus-3",
      src: `${CLOUD}/v1791613388/kidds.jpg`,
      alt: "Pupils on the playground",
      caption: "Outdoor play",
    },
    {
      id: "campus-4",
      src: `${CLOUD}/v1791613388/joinf.jpg`,
      alt: "Partnership and learning resources for pupils",
      caption: "Educational partnerships",
    },
  ] satisfies GalleryImage[],

  /** Explore megamenu featured panel swiper. */
  megaFeatured: [
    {
      id: "mega-1",
      src: `${CLOUD}/v1791613388/joinf.jpg`,
      alt: "Educational partnership and book donation with Splendor Spring School",
      caption: "Learning with partners",
    },
    {
      id: "mega-2",
      src: `${CLOUD}/v1791628078/tiwa.jpg`,
      alt: "Splendor Spring School pupils and staff on stage",
      caption: "School life on stage",
    },
    {
      id: "mega-3",
      src: `${CLOUD}/v1791628221/xtdfgchj.jpg`,
      alt: "Splendor Spring School pupils posing together",
      caption: "Proud Splendor pupils",
    },
  ] satisfies GalleryImage[],

  /** Filmstrip under “Early years & community” on the homepage. */
  earlyYearsCommunity: [
    {
      id: "eyc-1",
      src: `${CLOUD}/v1791613388/kids.jpg`,
      alt: "Early years pupils learning together in the classroom",
      caption: "Classroom joy",
    },
    {
      id: "eyc-2",
      src: `${CLOUD}/v1791613388/kiddss.jpg`,
      alt: "Pupils in teal performance outfits posing together",
      caption: "Proud performers",
    },
    {
      id: "eyc-3",
      src: `${CLOUD}/v1791613389/makkoo.jpg`,
      alt: "Close-up of smiling pupils in Splendor Spring School uniforms",
      caption: "Friends at school",
    },
    {
      id: "eyc-4",
      src: `${CLOUD}/v1791613388/kidds.jpg`,
      alt: "Pupils enjoying a fun day on the school playground",
      caption: "Play & community",
    },
    {
      id: "eyc-5",
      src: `${CLOUD}/v1791628221/xtdfgchj.jpg`,
      alt: "Splendor Spring School pupils posing playfully together",
      caption: "Joyful class spirit",
    },
    {
      id: "eyc-6",
      src: `${CLOUD}/v1791628078/tiwa.jpg`,
      alt: "Pupils and staff on stage at a Splendor school event",
      caption: "Stage & celebration",
    },
  ] satisfies GalleryImage[],
} as const;

export const COMING_SOON_COPY =
  "School events, pupils' achievements, classroom activities, educational projects and community initiatives will be shared regularly through our website and social media platforms.";
