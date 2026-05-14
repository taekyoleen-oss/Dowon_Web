"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { FilterSidebar } from "@/components/ui";
import { LawyerCard } from "./lawyer-card";
import { lawyers, practiceAreaLabels, type Lawyer, type PracticeAreaCode } from "@/lib/data/lawyers";
import { cn } from "@/lib/utils";

const practiceAreaCodes: PracticeAreaCode[] = [
  "auto","long-term","fire","liability","life",
  "medical","subrogation","investigation","advisory","criminal",
];

const roles = [
  { value: "대표변호사",       label: "대표변호사" },
  { value: "파트너변호사",     label: "파트너변호사" },
  { value: "변호사",           label: "변호사" },
  { value: "변호사 (비상임)",  label: "변호사 (비상임)" },
];

const specials = ["의사", "세무사", "회계사"];

function buildGroups(list: Lawyer[]) {
  return [
    {
      id: "practiceAreas",
      label: "전문분야",
      options: practiceAreaCodes.map((c) => ({
        value: c,
        label: practiceAreaLabels[c],
        count: list.filter((l) => l.practiceAreas.includes(c)).length,
      })),
    },
    {
      id: "role",
      label: "직책",
      options: roles.map((r) => ({
        value: r.value,
        label: r.label,
        count: list.filter((l) => l.role === r.value).length,
      })),
    },
    {
      id: "special",
      label: "특수자격",
      options: specials.map((s) => ({
        value: s,
        label: s,
        count: list.filter((l) => l.specialQualifications?.includes(s)).length,
      })),
    },
  ];
}

export function LawyerDirectory() {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
    practiceAreas: [],
    role: [],
    special: [],
  });

  const filtered = React.useMemo(() => {
    return lawyers
      .filter((l) => {
        if (
          query &&
          !l.nameKo.includes(query) &&
          !l.nameEn.toLowerCase().includes(query.toLowerCase())
        ) {
          return false;
        }
        if (filters.practiceAreas.length > 0) {
          const ok = filters.practiceAreas.some((pa) =>
            l.practiceAreas.includes(pa as PracticeAreaCode)
          );
          if (!ok) return false;
        }
        if (filters.role.length > 0 && !filters.role.includes(l.role)) {
          return false;
        }
        if (
          filters.special.length > 0 &&
          !filters.special.some((s) => l.specialQualifications?.includes(s))
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [query, filters]);

  const groups = React.useMemo(() => buildGroups(lawyers), []);

  const onChange = (groupId: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = prev[groupId] ?? [];
      return {
        ...prev,
        [groupId]: checked ? [...current, value] : current.filter((v) => v !== value),
      };
    });
  };

  const onClear = () => {
    setFilters({ practiceAreas: [], role: [], special: [] });
    setQuery("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-12">
      <FilterSidebar
        groups={groups}
        values={filters}
        onChange={onChange}
        onClear={onClear}
        resultCount={filtered.length}
      />

      <div>
        <div className="relative">
          <Search
            size={18}
            aria-hidden
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              "text-ink-mute"
            )}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="변호사명으로 검색"
            className={cn(
              "w-full pl-12 pr-12 py-4",
              "bg-paper border border-paper-3 rounded-sm",
              "font-serif-ko text-body-lg text-ink placeholder:text-ink-mute",
              "focus:border-ink focus:outline-none"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          {filtered.length}명 검색 결과
        </p>

        {filtered.length === 0 ? (
          <div className="mt-12 border border-dashed border-paper-3 rounded-md p-12 text-center">
            <p className="font-serif-ko text-h3 text-ink-soft">
              조건에 해당하는 변호사가 없습니다.
            </p>
            <button
              type="button"
              onClick={onClear}
              className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink underline-offset-4 hover:underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <li key={l.slug}>
                <LawyerCard lawyer={l} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
