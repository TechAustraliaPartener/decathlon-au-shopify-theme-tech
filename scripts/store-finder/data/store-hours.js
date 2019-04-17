/**
 * - Store properties range from 0 (Sunday) - 6 (Saturday)
 * - Store values are in Military Time
 * - "adr_GezSSC9M"/"adr_K6s3Kaja" are the IDs of each store
 * found in ./stores.js
 * - "0: [9, 19]" is equivalent to "Sunday: [9am, 7pm]"
 */
export default {
  adr_GezSSC9M: {
    0: [9, 19],
    1: [9, 20],
    2: [9, 20],
    3: [9, 20],
    4: [9, 20],
    5: [9, 20],
    6: [9, 20]
  },
  adr_K6s3Kaja: {
    0: [9, 21],
    1: [9, 21],
    2: [9, 21],
    3: [9, 21],
    4: [9, 21],
    5: [9, 21],
    6: [9, 21]
  },
  adr_oak: {
    0: [7, 18],
    1: [7, 19],
    2: [7, 19],
    3: [7, 19],
    4: [7, 19],
    5: [7, 19],
    6: [7, 18]
  }
};
