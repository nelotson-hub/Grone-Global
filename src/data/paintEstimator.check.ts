// Self-check for estimatePaint: run with `node <this file>` (Node strips TS types).
import assert from 'node:assert/strict';
import { estimatePaint } from './paintEstimator.ts';

// 100 m2, emulsion (10 m2/L), 2 coats -> 20 L -> exactly one 20L bucket
assert.deepEqual(estimatePaint(100, 'emulsion', 2), { litres: 20, buckets20: 1, buckets4: 0 });
// 50 m2, 2 coats -> 10 L -> three 4L buckets (12 L)
assert.deepEqual(estimatePaint(50, 'emulsion', 2), { litres: 10, buckets20: 0, buckets4: 3 });
// 85 m2, 2 coats -> 17 L -> five 4L would cost more, so one 20L
assert.deepEqual(estimatePaint(85, 'emulsion', 2), { litres: 17, buckets20: 1, buckets4: 0 });
// 130 m2, silk (13 m2/L), 1 coat -> 10 L
assert.deepEqual(estimatePaint(130, 'silk', 1), { litres: 10, buckets20: 0, buckets4: 3 });
// zero area -> nothing
assert.deepEqual(estimatePaint(0, 'oil', 2), { litres: 0, buckets20: 0, buckets4: 0 });
console.log('estimatePaint: all checks passed');


