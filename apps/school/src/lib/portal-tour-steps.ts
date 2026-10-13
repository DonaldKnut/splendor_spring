export type PortalRole = "STUDENT" | "PARENT" | "TEACHER";

export type PortalTourStep = {
  id: string;
  target?: string;
  title: string;
  body: string;
  tip?: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right" | "center";
};

export const PORTAL_TOUR_KEY = "splendor-portal-tour-v1";

export function portalHomePath(role: PortalRole) {
  if (role === "STUDENT") return "/portal/student";
  if (role === "PARENT") return "/portal/parent";
  return "/portal/teacher";
}

export function portalRoleLabel(role: PortalRole) {
  if (role === "STUDENT") return "Student";
  if (role === "PARENT") return "Parent";
  return "Teacher";
}

export function getPortalTourSteps(role: PortalRole): PortalTourStep[] {
  if (role === "STUDENT") {
    return [
      {
        id: "welcome",
        target: "portal-welcome",
        title: "Welcome to your portal",
        body: "This is your student home. Check published results and print your report sheet from here.",
        placement: "bottom",
      },
      {
        id: "nav",
        target: "portal-nav",
        title: "Your menu",
        body: "Use these links to move between Home and Help. Sign out when you are done.",
        placement: "bottom",
      },
      {
        id: "results",
        target: "portal-results",
        title: "My results",
        body: "When the school publishes a term, it appears here. Open a term to view scores and print.",
        tip: "If nothing shows yet, results have not been published.",
        placement: "auto",
      },
      {
        id: "finish",
        target: "portal-guide",
        title: "Need a reminder?",
        body: "Tap Guide anytime to replay this short walkthrough.",
        placement: "left",
      },
    ];
  }

  if (role === "PARENT") {
    return [
      {
        id: "welcome",
        target: "portal-welcome",
        title: "Welcome, parent",
        body: "This portal shows only the children linked to your account, and only published results.",
        placement: "bottom",
      },
      {
        id: "nav",
        target: "portal-nav",
        title: "Your menu",
        body: "Move between your children list and help. Sign out when you finish.",
        placement: "bottom",
      },
      {
        id: "children",
        target: "portal-children",
        title: "Your children",
        body: "Tap a child to open their published term results. You can print the report sheet from there.",
        tip: "Missing a child? Ask the school office to link them.",
        placement: "auto",
      },
      {
        id: "finish",
        target: "portal-guide",
        title: "Need this again?",
        body: "Tap Guide anytime to replay these steps.",
        placement: "left",
      },
    ];
  }

  return [
    {
      id: "welcome",
      target: "portal-welcome",
      title: "Welcome, teacher",
      body: "This is your teaching desk — quick links to pupils and results, without the full admin clutter.",
      placement: "bottom",
    },
    {
      id: "tasks",
      target: "portal-tasks",
      title: "Your main work",
      body: "Enter and edit results as drafts, then leave publishing to those who have permission. Open Students to check pupil details.",
      tip: "Drafts stay private until published.",
      placement: "auto",
    },
    {
      id: "counts",
      target: "portal-counts",
      title: "At a glance",
      body: "These numbers help you see draft vs published results and how many pupils are active.",
      placement: "auto",
    },
    {
      id: "finish",
      target: "portal-guide",
      title: "Guide anytime",
      body: "Tap Guide to replay this tour. Use the menu to jump straight into Results or Students.",
      placement: "left",
    },
  ];
}
