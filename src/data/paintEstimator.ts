import type { PaintTypeKey } from './groneData';

// Square metres per litre for ONE coat, from the low end of each product spec (conservative).
export const ESTIMATOR_COVERAGE_M2_PER_LITRE: Record<PaintTypeKey, number> = {
  emulsion: 10,
  acrylic: 10,
  silk: 13,
  oil: 14,
  screeding: 2,
};

// shortcut: a "room" is treated as 40 m² of wall area; replace with per-room dimensions if buyers need precision.
export const WALL_AREA_PER_ROOM_M2 = 40;

// Litres needed, then the cheapest 4L/20L mix (five 4L buckets always cost more than one 20L).
export function estimatePaint(areaM2: number, paint: PaintTypeKey, coats: number) {
  const litres = Math.ceil((areaM2 * coats) / ESTIMATOR_COVERAGE_M2_PER_LITRE[paint]);
  let buckets20 = Math.floor(litres / 20);
  let buckets4 = Math.ceil((litres - buckets20 * 20) / 4);
  if (buckets4 >= 5) {
    buckets20 += 1;
    buckets4 = 0;
  }
  return { litres, buckets20, buckets4 };
}
