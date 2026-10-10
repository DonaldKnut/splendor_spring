import { SessionProvider } from "@/components/session-provider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
