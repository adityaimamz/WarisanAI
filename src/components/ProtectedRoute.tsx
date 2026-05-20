import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@syraui/core";
import { getNeonAuthToken } from "../lib/auth";

type Props = { children: ReactNode };
const TOKEN_CHECK_INTERVAL_MS = 60_000; // Cek setiap 60 detik

export const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkToken = useCallback(async () => {
    const token = await getNeonAuthToken({ retries: 1, delayMs: 100 });
    if (!token) {
      setStatus("redirect");
      navigate("/auth/sign-in", { replace: true, state: { from: location } });
    }
  }, [location, navigate]);

  useEffect(() => {
    let cancelled = false;
    getNeonAuthToken({ retries: 8, delayMs: 350 }).then((token) => {
      if (!cancelled) setStatus(token ? "ok" : "redirect");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "ok") return;
    intervalRef.current = setInterval(checkToken, TOKEN_CHECK_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, checkToken]);

  if (status === "loading") {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <Skeleton loading={true}>
          <div className="rounded-2xl bg-sage-green/15 p-8">
            <p className="text-sm font-semibold text-text-muted">Verifying session...</p>
          </div>
        </Skeleton>
      </div>
    );
  }

  if (status === "redirect") {
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
