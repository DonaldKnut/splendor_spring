import {
  IconBook,
  IconCalendar,
  IconFileText,
  IconHash,
  IconLayers,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSearch,
  IconTag,
  IconUser,
} from "@splendor/ui";

/** Shared leading icons for school form fields */
export const FieldIcons = {
  user: <IconUser />,
  mail: <IconMail />,
  lock: <IconLock />,
  hash: <IconHash />,
  phone: <IconPhone />,
  map: <IconMapPin />,
  book: <IconBook />,
  calendar: <IconCalendar />,
  tag: <IconTag />,
  search: <IconSearch />,
  layers: <IconLayers />,
  file: <IconFileText />,
} as const;
