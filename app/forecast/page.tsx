import { Suspense } from "react";
import { ForecastClient } from "./forecast-client";

export default function ForecastPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell page-enter" style={{ padding: 48, textAlign: "center", color: "#5f6b60" }}>
          Loading forecast…
        </div>
      }
    >
      <ForecastClient />
    </Suspense>
  );
}
