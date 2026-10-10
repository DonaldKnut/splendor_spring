/**
 * Shared hero ↔ header wash. Keep identical so a fixed transparent header
 * sits on the hero without a visible seam at rest.
 */
/** School — chocolate plaid wash + crest/tan glow (uniform palette). */
export const HERO_WASH =
  "linear-gradient(115deg, rgba(28,16,10,0.90) 0%, rgba(42,24,16,0.55) 42%, rgba(42,24,16,0.22) 100%)";

export const HERO_GLOW =
  "radial-gradient(ellipse 70% 55% at 88% 12%, rgba(201,160,106,0.22), transparent 50%)";

/** NGO brand wash — ocean / coral, same seamless header↔hero trick. */
export const NGO_HERO_WASH =
  "linear-gradient(105deg, rgba(27,36,48,0.94) 0%, rgba(31,92,112,0.62) 48%, rgba(27,36,48,0.34) 100%)";

export const NGO_HERO_GLOW =
  "radial-gradient(ellipse at top right, rgba(217,120,69,0.28), transparent 45%)";

/**
 * Shared placeholder / brand imagery.
 * School assets point at Splendor Spring Cloudinary uploads.
 */
export const PLACEHOLDERS = {
  schoolHero:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791613388/joinf.jpg",
  schoolClassroom:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791613388/kiddies.jpg",
  schoolPlay:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791613388/kidsss.jpg",
  schoolLibrary:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791613388/kidds.jpg",
  schoolLogo:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791613389/logo_school.jpg",
  schoolProprietor:
    "https://res.cloudinary.com/ls40ecmc/image/upload/v1791611598/miss_yemi.jpg",

  ngoHero1:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80",
  ngoHero2:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=2000&q=80",
  ngoHero3:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=2000&q=80",
  ngoCommunity:
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
  ngoVolunteer:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
  abstractSoft:
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80",
} as const;

export type PlaceholderKey = keyof typeof PLACEHOLDERS;
