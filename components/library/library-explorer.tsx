"use client";

import * as React from "react";
import { Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { FilterSidebar, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { LibraryCard } from "./library-card";
import { libraryItems, type LibraryItemType } from "@/lib/data/library";
import { lawyers, practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";
import { cn } from "@/lib/utils";

const practiceAreaCodes: PracticeAreaCode[] = [
  "auto","long-term","fire","liability","life",
  "medical","subrogation","investigation","advisory","criminal",
];

const years = ["2026", "2025", "2024", "2023"];

export function LibraryExplorer({ initialType = "all" }: { initialType?: "all" | LibraryItemType }) {
  const [tab, setTab] = React.useState<"all" | LibraryItemType>(initialType);
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
    practiceAreas: [],
    year: [],
    lawyer: [],
  });

  const filtered = React.useMemo(() => {
    return libraryItems
      .filter((it) => (tab === "all" ? true : it.type === tab))
      .filter((it) =>
        query
          ? it.title.toLowerCase().includes(query.toLowerCase()) ||
            it.excerpt.toLowerCase().includes(query.toLowerCase())
          : true
      )
      .filter((it) =>
        filters.practiceAreas.length > 0
          ? filters.practiceAreas.some((pa) =>
              it.practiceAreas.includes(pa as PracticeAreaCode)
            )
          : true
      )
      .filter((it) =>
        filters.year.length > 0
          ? filters.year.some((y) => it.publishedAt.startsWith(y))
          : true
      )
      .filter((it) =>
        filters.lawyer.length > 0
          ? filters.lawyer.some(
              (slug) =>
                it.authorSlug === slug ||
                (it.lawyerSlugs?.includes(slug) ?? false)
            )
          : true
      )
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [tab, query, filters]);

  const groups = [
    {
      id: "practiceAreas",
      label: "분야",
      options: practiceAreaCodes.map((c) => ({
        value: c,
        label: practiceAreaLabels[c],
        count: libraryItems.filter((it) => it.practiceAreas.includes(c)).length,
      })),
    },
    {
      id: "year",
      label: "연도",
      options: years.map((y) => ({
        value: y,
        label: y,
        count: libraryItems.filter((it) => it.publishedAt.startsWith(y)).length,
      })),
    },
    {
      id: "lawyer",
      label: "변호사",
      options: lawyers.map((l) => ({ value: l.slug, label: l.nameKo })),
    },
  ];

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
    setFilters({ practiceAreas: [], year: [], lawyer: [] });
    setQuery("");
  };

  return (
    <div className="space-y-10">
      {/* Search bar with AI hint */}
      <div>
        <div className="relative">
          <Search size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="키워드 검색 — 예: ‘무보험차상해 약관’"
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

        <Link
          href="/library/search"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-gold-deep hover:text-gold"
        >
          <Sparkles size={12} /> AI 의미 검색으로 전환 (Phase 2)
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="case">판례</TabsTrigger>
          <TabsTrigger value="column">칼럼</TabsTrigger>
          <TabsTrigger value="media">강의·미디어</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-12">
        <FilterSidebar
          groups={groups}
          values={filters}
          onChange={onChange}
          onClear={onClear}
          resultCount={filtered.length}
        />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
            {filtered.length}건 검색 결과
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 border border-dashed border-paper-3 rounded-md p-12 text-center">
              <p className="font-serif-ko text-h3 text-ink-soft">조건에 해당하는 자료가 없습니다.</p>
              <button
                type="button"
                onClick={onClear}
                className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink underline-offset-4 hover:underline"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {filtered.map((it) => (
                <li key={it.slug}>
                  <LibraryCard item={it} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
