"use client";

import { useEffect, useRef, useState } from "react";
import BackLink from "@/components/BackLink";

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setBounds(bounds: KakaoLatLngBounds): void;
  getLevel(): number;
  setLevel(level: number, options?: { anchor?: KakaoLatLng }): void;
  relayout(): void;
}

interface KakaoMarker {
  setPosition(latlng: KakaoLatLng): void;
}

interface KakaoCircle {
  setMap(map: KakaoMap | null): void;
}

interface KakaoMapMouseEvent {
  latLng: KakaoLatLng;
}

interface KakaoPlaceSearchResult {
  x: string;
  y: string;
  place_name: string;
  address_name: string;
}

interface KakaoPlacesService {
  keywordSearch(
    query: string,
    callback: (data: KakaoPlaceSearchResult[], status: string) => void
  ): void;
}

interface KakaoMapsNamespace {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng; map: KakaoMap }) => KakaoMarker;
  Circle: new (options: {
    center: KakaoLatLng;
    radius: number;
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
    fillColor: string;
    fillOpacity: number;
  }) => KakaoCircle;
  event: {
    addListener(target: KakaoMap, type: "click", handler: (event: KakaoMapMouseEvent) => void): void;
  };
  services: {
    Places: new () => KakaoPlacesService;
    Status: { OK: string; ZERO_RESULT: string; ERROR: string };
  };
  load(callback: () => void): void;
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsNamespace };
  }
}

type Trim = "standard" | "long-2wd" | "long-4wd";
type WheelSize = "17" | "19";
type Spec = { batteryKWh: number; rangeKm: number };

const VEHICLE_SPECS: Record<Trim, Partial<Record<WheelSize, Spec>>> = {
  standard: {
    "17": { batteryKWh: 58.3, rangeKm: 350 },
    "19": { batteryKWh: 58.3, rangeKm: 347 },
  },
  "long-2wd": {
    "17": { batteryKWh: 81.4, rangeKm: 500 },
    "19": { batteryKWh: 81.4, rangeKm: 478 },
  },
  "long-4wd": {
    "19": { batteryKWh: 81.4, rangeKm: 450 },
  },
};

const TRIM_OPTIONS: { value: Trim; label: string }[] = [
  { value: "long-2wd", label: "롱레인지 2WD" },
  { value: "long-4wd", label: "롱레인지 4WD" },
  { value: "standard", label: "스탠다드" },
];

const WHEEL_OPTIONS: { value: WheelSize; label: string }[] = [
  { value: "17", label: "17인치" },
  { value: "19", label: "19인치" },
];

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

// 실제 도로는 직선이 아니라 항상 더 돌아가므로, 계산된 직선거리를 이 비율만큼만 반영해 보수적으로 표시한다.
const ROAD_SAFETY_FACTOR = 0.8;

type Ranges = {
  totalRangeKm: number;
  distanceTo20: number;
  distanceTo10: number;
  battery: number;
};

export default function RangeMapToolPage() {
  const [trim, setTrim] = useState<Trim>("long-2wd");
  const [wheelSize, setWheelSize] = useState<WheelSize>("17");
  const [customEfficiency, setCustomEfficiency] = useState("");
  const [batteryPercent, setBatteryPercent] = useState("50");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapReady, setMapReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.kakao?.maps)
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const circle20Ref = useRef<KakaoCircle | null>(null);
  const circle10Ref = useRef<KakaoCircle | null>(null);

  const effectiveWheelSize: WheelSize = trim === "long-4wd" ? "19" : wheelSize;
  const spec = VEHICLE_SPECS[trim][effectiveWheelSize];

  const ranges: Ranges | null = (() => {
    if (!spec) return null;
    const battery = parseFloat(batteryPercent);
    if (!Number.isFinite(battery) || battery < 0) return null;

    const customEff = parseFloat(customEfficiency);
    const totalRangeKm =
      Number.isFinite(customEff) && customEff > 0 ? customEff * spec.batteryKWh : spec.rangeKm;

    return {
      totalRangeKm,
      distanceTo20: totalRangeKm * (Math.max(battery - 20, 0) / 100) * ROAD_SAFETY_FACTOR,
      distanceTo10: totalRangeKm * (Math.max(battery - 10, 0) / 100) * ROAD_SAFETY_FACTOR,
      battery,
    };
  })();

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (!KAKAO_APP_KEY || mapReady) return;

    const handleLoaded = () => window.kakao?.maps.load(() => setMapReady(true));

    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-map-sdk]");
    if (existing) {
      existing.addEventListener("load", handleLoaded);
      return () => existing.removeEventListener("load", handleLoaded);
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapSdk = "true";
    script.addEventListener("load", handleLoaded);
    document.head.appendChild(script);
    return () => script.removeEventListener("load", handleLoaded);
  }, [mapReady]);

  // 지도 초기화 (최초 1회)
  useEffect(() => {
    const kakao = window.kakao;
    if (!mapReady || !kakao || !mapContainerRef.current || mapRef.current) return;
    const center = new kakao.maps.LatLng(37.5665, 126.978);
    const map = new kakao.maps.Map(mapContainerRef.current, { center, level: 9 });
    mapRef.current = map;

    kakao.maps.event.addListener(map, "click", (e) => {
      setLocationError(null);
      setPosition({ lat: e.latLng.getLat(), lng: e.latLng.getLng() });
    });
  }, [mapReady]);

  // 화면 폭이 바뀌어 지도 비율(모바일 정사각형 / 데스크톱 와이드)이 달라지면 다시 그리기
  useEffect(() => {
    if (!mapReady) return;
    const handleResize = () => {
      const map = mapRef.current;
      const kakao = window.kakao;
      if (!map || !kakao) return;
      map.relayout();
      if (position) {
        map.setCenter(new kakao.maps.LatLng(position.lat, position.lng));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mapReady, position]);

  // 위치/반경이 바뀔 때마다 마커와 원 다시 그리기
  useEffect(() => {
    const kakao = window.kakao;
    if (!mapReady || !kakao || !mapRef.current || !position) return;
    const center = new kakao.maps.LatLng(position.lat, position.lng);

    mapRef.current.setCenter(center);

    if (!markerRef.current) {
      markerRef.current = new kakao.maps.Marker({ position: center, map: mapRef.current });
    } else {
      markerRef.current.setPosition(center);
    }

    circle10Ref.current?.setMap(null);
    circle20Ref.current?.setMap(null);

    if (ranges && ranges.distanceTo10 > 0) {
      circle10Ref.current = new kakao.maps.Circle({
        center,
        radius: ranges.distanceTo10 * 1000,
        strokeWeight: 2,
        strokeColor: "#dc2626",
        strokeOpacity: 0.6,
        strokeStyle: "solid",
        fillColor: "#dc2626",
        fillOpacity: 0.12,
      });
      circle10Ref.current.setMap(mapRef.current);
    }

    if (ranges && ranges.distanceTo20 > 0) {
      circle20Ref.current = new kakao.maps.Circle({
        center,
        radius: ranges.distanceTo20 * 1000,
        strokeWeight: 2,
        strokeColor: "#2563eb",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
        fillColor: "#2563eb",
        fillOpacity: 0.18,
      });
      circle20Ref.current.setMap(mapRef.current);
    }

    const outerRadiusKm = ranges ? Math.max(ranges.distanceTo10, ranges.distanceTo20) : 0;
    if (outerRadiusKm > 0) {
      const latOffset = outerRadiusKm / 111;
      const lngOffset = outerRadiusKm / (111 * Math.cos((position.lat * Math.PI) / 180));
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(new kakao.maps.LatLng(position.lat + latOffset, position.lng + lngOffset));
      bounds.extend(new kakao.maps.LatLng(position.lat - latOffset, position.lng - lngOffset));
      mapRef.current.setBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, position, ranges?.distanceTo10, ranges?.distanceTo20]);

  const handleUseMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("이 브라우저는 위치 기능을 지원하지 않습니다. 지도를 눌러 위치를 직접 지정해주세요.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () =>
        setLocationError(
          "위치 권한이 거부되었거나 위치를 가져올 수 없습니다. 지도를 눌러 위치를 직접 지정해주세요."
        ),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSearch = () => {
    const kakao = window.kakao;
    const query = searchQuery.trim();
    if (!kakao || !query) return;

    setLocationError(null);
    const places = new kakao.maps.services.Places();
    places.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK && data.length > 0) {
        setPosition({ lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) });
      } else {
        setLocationError("검색 결과가 없습니다. 다른 지역명으로 시도하거나 지도를 눌러 지정해주세요.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <BackLink href="/" label="홈으로" />

      <h1 className="mt-6 text-3xl font-bold tracking-tight">주행 가능 범위 지도</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        현재 위치와 남은 배터리를 기준으로, 배터리 20%와 10%가 남을 때까지 갈 수 있는 대략적인 범위를
        지도에 보여줍니다. 도로 사정을 감안해 보수적으로 계산했습니다.{" "}
        <a href="#notice" className="text-blue-600 hover:underline">
          자세히
        </a>
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">차량 정보</h2>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <span className="text-sm">배터리·구동방식</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {TRIM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTrim(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    trim === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {trim !== "long-4wd" && (
            <div>
              <span className="text-sm">휠 사이즈</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {WHEEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setWheelSize(opt.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      wheelSize === opt.value
                        ? "bg-blue-600 text-white"
                        : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {spec && (
            <p className="text-xs text-black/40 dark:text-white/40">
              배터리 {spec.batteryKWh}kWh · 공인 1회 충전 주행거리 약 {spec.rangeKm}km
              (기후에너지환경부(전 환경부) 인증 기준)
            </p>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm">최근 실제 전비 (선택, km/kWh)</span>
            <input
              type="number"
              inputMode="decimal"
              value={customEfficiency}
              onChange={(e) => setCustomEfficiency(e.target.value)}
              placeholder="비워두면 공인 주행거리로 계산합니다"
              className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
            />
            <span className="text-xs text-black/40 dark:text-white/40">
              계기판이나 앱에서 확인한 본인의 실제 전비를 입력하면 계절, 운전 습관이 반영되어 더
              정확해집니다.
            </span>
          </label>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">현재 배터리</h2>
        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-sm">현재 배터리 잔량 (%)</span>
          <input
            type="number"
            inputMode="numeric"
            step={1}
            min={0}
            max={100}
            value={batteryPercent}
            onChange={(e) => {
              const digitsOnly = e.target.value.split(".")[0].replace(/[^0-9]/g, "");
              if (digitsOnly === "") {
                setBatteryPercent("");
                return;
              }
              const clamped = Math.min(100, parseInt(digitsOnly, 10));
              setBatteryPercent(String(clamped));
            }}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
          />
        </label>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">현재 위치</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            내 위치 사용
          </button>
          <span className="text-xs text-black/40 dark:text-white/40">
            또는 지역명을 검색하거나, 아래 지도를 눌러 위치를 직접 지정하세요.
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            aria-label="위치 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="예: 현대차 본사, HMG 드라이빙 익스피리언스, 강남구"
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/10"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 rounded-lg bg-black/5 px-4 py-2 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/60"
          >
            검색
          </button>
        </div>
        {locationError && <p className="mt-2 text-xs text-red-600">{locationError}</p>}

        <div className="mt-4">
          {KAKAO_APP_KEY ? (
            <div
              ref={mapContainerRef}
              className="aspect-square w-full rounded-xl border border-black/10 sm:aspect-video dark:border-white/10"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-black/40 sm:aspect-video dark:border-white/10 dark:text-white/40">
              지도 API 키가 아직 설정되지 않았습니다. 아래 계산 결과는 위치와 무관하게 확인할 수
              있습니다.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm font-semibold text-black/60 dark:text-white/60">
          예상 주행 가능 범위{" "}
          <span className="font-normal text-black/40 dark:text-white/40">(편도 기준)</span>
        </p>
        {!spec ? (
          <p className="mt-3 text-sm text-black/40 dark:text-white/40">차량 정보를 선택해주세요.</p>
        ) : !ranges ? (
          <p className="mt-3 text-sm text-black/40 dark:text-white/40">
            현재 배터리 잔량을 입력해주세요.
          </p>
        ) : ranges.battery <= 10 ? (
          <p className="mt-3 text-sm text-red-600">
            배터리가 이미 10% 이하입니다. 거리 계산 대신 가까운 충전소를 먼저 확인하세요.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {ranges.battery > 20 && (
              <p>
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />약{" "}
                <strong>{Math.round(ranges.distanceTo20)}km</strong>까지 이동 가능 (도착하면 배터리
                20% 남음)
              </p>
            )}
            <p>
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />약{" "}
              <strong>{Math.round(ranges.distanceTo10)}km</strong>까지 이동 가능 (도착하면 배터리
              10% 남음)
            </p>
            {ranges.battery <= 20 && (
              <p className="text-xs text-red-600">
                이미 배터리 20% 이하입니다. 충전 계획을 먼저 세우는 걸 권장합니다.
              </p>
            )}
          </div>
        )}
        <p className="mt-4 text-xs text-black/40 dark:text-white/40">
          도로 사정을 감안해 보수적으로 표시한 값입니다. 배터리 0%까지의 거리는 표시하지 않습니다.
          계산 방식은 아래 &quot;자세히&quot; 내용을 확인하세요.
        </p>
      </section>

      <div
        id="notice"
        className="mt-6 rounded-xl bg-black/[0.03] p-4 text-xs text-black/50 dark:bg-white/[0.05] dark:text-white/50"
      >
        <p className="font-semibold text-black/70 dark:text-white/70">이 도구는 이렇게 계산합니다</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          <li>
            내비게이션 실제 경로가 아니라 직선거리 기준입니다. 실제 도로는 직선이 아니라 항상 더
            돌아가기 때문에, 계산된 직선거리보다 낮춰서 보수적으로 표시합니다. 실제로는 표시된
            범위보다 더 멀리 갈 수 있습니다.
          </li>
          <li>
            배터리가 0%가 되는 지점이 아니라 20%, 10%가 남는 시점까지만 계산하고, 여기에 위 안전
            마진을 추가로 적용합니다.
          </li>
          <li>
            최근 실제 전비를 입력하면 그 값과 배터리 용량으로 계산하고, 입력하지 않으면
            기후에너지환경부(전 환경부) 인증 1회 충전 주행거리를 기준으로 계산합니다.
          </li>
          <li>
            겨울철 저온, 고속 주행, 에어컨·히터 사용이 많으면 표시된 범위보다 실제로 갈 수 있는
            거리가 더 짧아질 수 있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
