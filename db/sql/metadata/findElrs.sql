SELECT
  elr,
  ROUND(MIN(start_mi),3) AS start_mi,
  ROUND(MAX(end_mi),3) AS end_mi,
  ROUND(MIN(start_km),3) AS start_km,
  ROUND(MAX(end_km),3) AS end_km
FROM nwr_elrs_split
  GROUP BY elr
  ORDER BY elr;
