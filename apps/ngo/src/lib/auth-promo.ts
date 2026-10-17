import { PLACEHOLDERS, type AuthPromoSlide } from "@splendor/ui";

export const ngoAuthSlides: AuthPromoSlide[] = [
  {
    id: "impact",
    image: PLACEHOLDERS.ngoHero1,
    badge: "Impact",
    title: "Stewardship you can trust",
    subtitle: "Admin access protected with verified email and secure sessions.",
  },
  {
    id: "community",
    image: PLACEHOLDERS.ngoCommunity,
    badge: "Community",
    title: "Serve with confidence",
    subtitle: "Campaigns, donations, and content — behind a premium gate.",
  },
  {
    id: "volunteer",
    image: PLACEHOLDERS.ngoVolunteer,
    badge: "Transparency",
    title: "Every login verified",
    subtitle: "OTP email via Resend keeps leadership accounts accountable.",
  },
  {
    id: "hope",
    image: PLACEHOLDERS.ngoHero2,
    badge: "Mission",
    title: "Purpose-led access",
    subtitle: "Only authorised staff reach programmes, donors, and reports.",
  },
];
