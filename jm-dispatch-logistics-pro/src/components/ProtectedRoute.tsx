import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const sub = localStorage.getItem("subscription");

    if (!user.email || sub !== "active") {
      router.push("/subscribe");
    }
  }, []);

  return <>{children}</>;
}
