import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function isAuthWithRole(role: "ADMIN" | "TECHNICIAN", fallbackUrl?: string) {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") return;
  if (!session || (session.data?.user && role !== session.data?.user.role)) router.replace(fallbackUrl ?? "/");
}