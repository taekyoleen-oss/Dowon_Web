/**
 * Office NAP (Name · Address · Phone) — single source of truth.
 *
 * Used by:
 *   - /about/contact (map embed + deep links)
 *   - LegalService JSON-LD (home page SEO)
 *   - Footer (when wired up)
 *
 * To pin the building precisely on every map service and rich result,
 * update lat/lng here. Verify on map.kakao.com (우클릭 → 좌표복사).
 */
export const OFFICE = {
  name: "법무법인 도원",
  nameEn: "Dowon Law",
  // Postal
  address: "서울특별시 서초구 서초대로55길 3, 애니빌딩 4-5층",
  addressShort: "서초구 서초대로55길 3",
  streetAddress: "서초대로55길 3, 애니빌딩 4-5층",
  addressLocality: "서초구",
  addressRegion: "서울특별시",
  addressCountry: "KR",
  // Approximate — verify on the ground.
  lat: 37.4862,
  lng: 127.0312,
  // Contact
  phone: "02-3481-6540",
  phoneIntl: "+82-2-3481-6540",
  fax: "02-3481-6541",
  email: "dowonlaw@dowonlaw.com",
  // Hours (schema.org format)
  hoursHumanKo: "평일 09:00–18:00 (점심 12:00–13:00)",
  hoursSchema: "Mo-Fr 09:00-18:00",
} as const;
