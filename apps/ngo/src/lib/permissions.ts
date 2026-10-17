export const PERMISSIONS = {
  MANAGE_CONTENT: "manage_content",
  MANAGE_PROGRAMMES: "manage_programmes",
  MANAGE_CAMPAIGNS: "manage_campaigns",
  MANAGE_GRANTS: "manage_grants",
  MANAGE_EVENTS: "manage_events",
  MANAGE_POLLS: "manage_polls",
  VIEW_DONATIONS: "view_donations",
  EXPORT_DONATIONS: "export_donations",
  VIEW_CONTACTS: "view_contacts",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_ADMINS: "manage_admins",
  VIEW_AUDIT: "view_audit",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_LABELS: Record<Permission, string> = {
  manage_content: "Manage website content",
  manage_programmes: "Manage programmes",
  manage_campaigns: "Manage fundraising campaigns",
  manage_grants: "Manage grants",
  manage_events: "Manage events",
  manage_polls: "Manage polls",
  view_donations: "View donations",
  export_donations: "Export donations",
  view_contacts: "View contact submissions",
  manage_settings: "Manage organisation settings",
  manage_admins: "Manage administrators",
  view_audit: "View audit logs",
};
