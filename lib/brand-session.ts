import type { BrandRecord } from "@/lib/project-types";

export const BRAND_STORAGE_KEY = "sellworks-brand";
export const ACTIVE_BRAND_ID_STORAGE_KEY = "sellworks-active-brand-id";
export const BRAND_CHANGED_EVENT = "sellworks:brand-changed";

export function getStoredBrand() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(BRAND_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BrandRecord;
  } catch {
    return null;
  }
}

export function getStoredActiveBrandId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(ACTIVE_BRAND_ID_STORAGE_KEY);
}

export function setStoredActiveBrand(brand: BrandRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(brand));
  window.sessionStorage.setItem(ACTIVE_BRAND_ID_STORAGE_KEY, brand.id);
}

export function emitBrandChanged(brand: BrandRecord) {
  if (typeof window === "undefined") {
    return;
  }

  setStoredActiveBrand(brand);
  window.dispatchEvent(
    new CustomEvent(BRAND_CHANGED_EVENT, {
      detail: {
        brand,
        brandId: brand.id,
      },
    })
  );
}

export function getBrandScopedCacheKey(baseKey: string, brandId: string | null) {
  return `${baseKey}:${brandId || "default"}`;
}
