import Link from "next/link";
import type { ReactNode } from "react";

export type PlanAudience = "students" | "trainers";

export function PlanAudienceSwitcher({
  audience,
  studentPlans,
  trainerPlans,
}: {
  audience: PlanAudience;
  studentPlans: ReactNode;
  trainerPlans: ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto grid max-w-xl grid-cols-2 border border-[#111214] bg-white p-1" role="tablist" aria-label="Tipo de plan">
        <Link
          href="/premium?audience=students"
          role="tab"
          id="student-plans-tab"
          aria-controls="student-plans-panel"
          aria-selected={audience === "students"}
          className={`flex min-h-12 items-center justify-center px-4 py-3 text-center text-sm font-bold transition-colors ${audience === "students" ? "bg-[#111214] text-white" : "text-[#111214] hover:bg-[#f2f2f2]"}`}
        >
          Quiero entrenar
        </Link>
        <Link
          href="/premium?audience=trainers"
          role="tab"
          id="trainer-plans-tab"
          aria-controls="trainer-plans-panel"
          aria-selected={audience === "trainers"}
          className={`flex min-h-12 items-center justify-center px-4 py-3 text-center text-sm font-bold transition-colors ${audience === "trainers" ? "bg-[var(--accent)] text-[#111214]" : "text-[#111214] hover:bg-[#f2f2f2]"}`}
        >
          Soy entrenador
        </Link>
      </div>

      {audience === "students" ? (
        <div id="student-plans-panel" role="tabpanel" aria-labelledby="student-plans-tab" className="mt-8">
          {studentPlans}
        </div>
      ) : (
        <div id="trainer-plans-panel" role="tabpanel" aria-labelledby="trainer-plans-tab" className="mt-8">
          {trainerPlans}
        </div>
      )}
    </div>
  );
}
