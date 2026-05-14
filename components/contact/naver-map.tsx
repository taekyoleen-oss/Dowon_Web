"use client";

import * as React from "react";
import { OFFICE } from "@/lib/data/office";

/**
 * Naver Maps SDK embed — interactive, brand-recognisable to Korean users.
 *
 * Requires NEXT_PUBLIC_NAVER_MAP_CLIENT_ID (Naver Cloud Platform → AI/NAVER
 * API → Maps → Application). The "Client ID" is intentionally public —
 * Naver protects against abuse by verifying the request's referrer against
 * the URLs registered on the Application in NCP console.
 *
 * To set up (~5 minutes, free):
 *   1. https://www.ncloud.com → 회원가입
 *   2. Console → AI·Application Service → Maps → Application 등록
 *   3. Web 서비스 URL에 운영 도메인 + http://localhost:3000 추가
 *   4. Client ID 복사 → .env.local 의 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 에 붙여넣기
 *   5. dev 서버 재시작
 */

declare global {
  interface Window {
    // Naver Maps API namespace. We type the bits we touch.
    naver?: {
      maps: {
        Map: new (
          el: HTMLElement,
          options: { center: unknown; zoom: number; [k: string]: unknown }
        ) => unknown;
        Marker: new (options: { position: unknown; map: unknown }) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
      };
    };
  }
}

const SCRIPT_ID = "naver-maps-sdk";

export function NaverMap({ clientId }: { clientId: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !containerRef.current || !window.naver?.maps) return;
      const { Map, Marker, LatLng } = window.naver.maps;
      const center = new LatLng(OFFICE.lat, OFFICE.lng);
      const map = new Map(containerRef.current, {
        center,
        zoom: 17,
        // Defaults render typical Naver styling — colour roads, transit overlay
        // toggles available via control. Keeping minimal config so the
        // experience matches what users see on m.map.naver.com.
      });
      new Marker({ position: center, map });
    };

    // SDK already loaded (client-side navigation back to this page)
    if (window.naver?.maps) {
      init();
      return () => {
        cancelled = true;
      };
    }

    // Reuse the same script tag across remounts
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      // ncpKeyId is the current parameter name (2024+). The older
      // ncpClientId still works as an alias for transition; if NCP returns
      // an auth error mentioning the param name, swap to ncpClientId.
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(
        clientId
      )}`;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", init);
    };
  }, [clientId]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${OFFICE.addressShort} — 네이버지도`}
      className="absolute inset-0 h-full w-full"
    />
  );
}
