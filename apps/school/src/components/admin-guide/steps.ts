export type AdminRole = "HEAD_ADMIN" | "SUB_ADMIN" | "TEACHER" | string;

export type TourStep = {
  id: string;
  /** Matches data-tour="..." on the page */
  target?: string;
  title: string;
  body: string;
  tip?: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right" | "center";
};

const COMMON_FINISH: TourStep = {
  id: "finish",
  target: "tour-help",
  title: "Need this again?",
  body: "Tap Guide anytime to replay this walkthrough. Short tips also appear when you hover the little (i) icons.",
  tip: "You can skip the tour and come back later.",
  placement: "left",
};

export function getTourSteps(role: AdminRole): TourStep[] {
  if (role === "TEACHER") {
    return [
      {
        id: "welcome",
        target: "tour-welcome",
        title: "Welcome, teacher",
        body: "This is your school desk. From here you can see pupils, enter results, and check what still needs work.",
        tip: "Everything uses simple words — follow the steps.",
        placement: "bottom",
      },
      {
        id: "menu",
        target: "tour-sidebar",
        title: "Your menu",
        body: "Use the side menu to open Students and Results. Only the tools you are allowed to use will show.",
        placement: "right",
      },
      {
        id: "overview",
        target: "tour-overview",
        title: "Quick numbers",
        body: "These cards show counts at a glance — like how many draft results are waiting. Tap a card to learn more.",
        tip: "Hover the (i) for a short tip.",
        placement: "auto",
      },
      {
        id: "results",
        target: "tour-session",
        title: "School year & tasks",
        body: "Check the current academic session here. Pending tasks remind you about draft results that are not published yet.",
        placement: "auto",
      },
      {
        id: "howto-results",
        title: "How results work",
        body: "1) Open Results and enter scores as drafts. 2) Double-check the numbers. 3) Publish only when ready — then parents can see them.",
        tip: "Drafts are private. Published results go to the family portal.",
        placement: "center",
      },
      COMMON_FINISH,
    ];
  }

  if (role === "SUB_ADMIN") {
    return [
      {
        id: "welcome",
        target: "tour-welcome",
        title: "Welcome, school admin",
        body: "You help run the school system. Your menu shows only the areas you are allowed to manage.",
        tip: "If a page is missing, ask the Head Admin for access.",
        placement: "bottom",
      },
      {
        id: "menu",
        target: "tour-sidebar",
        title: "Side menu",
        body: "This is your map of the school app — people, classes, results, website, and more.",
        placement: "right",
      },
      {
        id: "issue",
        target: "tour-issue",
        title: "Issue accounts",
        body: "Create logins for students and parents (when you have permission). Each person gets an email with a temporary password.",
        tip: "They must change the password the first time they sign in.",
        placement: "bottom",
      },
      {
        id: "overview",
        target: "tour-overview",
        title: "Dashboard overview",
        body: "These numbers show how the school is doing today. Tap any card for a plain-English explanation and a shortcut button.",
        placement: "auto",
      },
      {
        id: "session",
        target: "tour-session",
        title: "Session & pending work",
        body: "See the current school year, plus draft results and new website messages that still need attention.",
        placement: "auto",
      },
      {
        id: "activity",
        target: "tour-activity",
        title: "Recent activity",
        body: "This list shows important actions done in the system — useful if you need to check what changed.",
        placement: "auto",
      },
      COMMON_FINISH,
    ];
  }

  // HEAD_ADMIN (default / most complete)
  return [
    {
      id: "welcome",
      target: "tour-welcome",
      title: "Welcome, Head Admin",
      body: "You are in charge of the whole school system. This short tour shows where to create accounts, publish results, and update the website.",
      tip: "About 1 minute. You can skip anytime.",
      placement: "bottom",
    },
    {
      id: "menu",
      target: "tour-sidebar",
      title: "Your control menu",
      body: "Every school tool lives here: people, classes, results, website content, settings, and security logs.",
      tip: "On phones, open the menu with the button at the top.",
      placement: "right",
    },
    {
      id: "issue",
      target: "tour-issue",
      title: "Create logins",
      body: "Start here when a new student, parent, or teacher needs access. The system emails a temporary password safely.",
      tip: "Teachers and sub-admins are created under Administrators.",
      placement: "bottom",
    },
    {
      id: "overview",
      target: "tour-overview",
      title: "See the school at a glance",
      body: "Active pupils, parents, classes, drafts, published results, and new contact messages — all in one place. Tap a card for details.",
      placement: "auto",
    },
    {
      id: "session",
      target: "tour-session",
      title: "School year & to-dos",
      body: "Confirm the current academic session. Pending tasks flag draft results and unread website enquiries.",
      tip: "Set or change the session under Sessions & Terms.",
      placement: "auto",
    },
    {
      id: "activity",
      target: "tour-activity",
      title: "Who did what",
      body: "Recent activity keeps a simple trail of important changes — helpful for accountability.",
      placement: "auto",
    },
    {
      id: "flow",
      placement: "center",
      title: "Recommended daily flow",
      body: "1) Create student & parent logins. 2) Set classes and subjects. 3) Teachers enter draft results. 4) You (or an allowed teacher) publish. 5) Reply to contact messages.",
      tip: "Publish only after scores are checked.",
    },
    COMMON_FINISH,
  ];
}

export function roleLabel(role: AdminRole): string {
  if (role === "HEAD_ADMIN") return "Head Admin";
  if (role === "SUB_ADMIN") return "School Admin";
  if (role === "TEACHER") return "Teacher";
  return "Staff";
}

export const TOUR_STORAGE_KEY = "splendor-admin-tour-v1";
