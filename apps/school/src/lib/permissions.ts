export const PERMISSIONS = {
  VIEW_STUDENTS: "view_students",
  MANAGE_STUDENTS: "manage_students",
  MANAGE_PARENTS: "manage_parents",
  MANAGE_CLASSES: "manage_classes",
  MANAGE_SUBJECTS: "manage_subjects",
  MANAGE_SESSIONS: "manage_sessions",
  ENTER_RESULTS: "enter_results",
  EDIT_RESULTS: "edit_results",
  PUBLISH_RESULTS: "publish_results",
  MANAGE_CONTENT: "manage_content",
  VIEW_CONTACTS: "view_contacts",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_AUDIT: "view_audit",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/** Default least-privilege set for Teacher accounts. */
export const TEACHER_DEFAULT_PERMISSIONS: Permission[] = [
  PERMISSIONS.VIEW_STUDENTS,
  PERMISSIONS.ENTER_RESULTS,
  PERMISSIONS.EDIT_RESULTS,
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  view_students: "View students",
  manage_students: "Create and edit students",
  manage_parents: "Manage parents and guardians",
  manage_classes: "Manage classes",
  manage_subjects: "Manage subjects",
  manage_sessions: "Manage academic sessions and terms",
  enter_results: "Enter results",
  edit_results: "Edit unpublished results",
  publish_results: "Publish results",
  manage_content: "Manage website content",
  view_contacts: "View contact submissions",
  manage_settings: "Manage school settings",
  view_audit: "View audit logs",
};
