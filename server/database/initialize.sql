CREATE TABLE IF NOT EXISTS multi_modal_sensor_station_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ,
  sensor_id VARCHAR(100),
  temperature NUMERIC,
  humidity NUMERIC,
  frequency_in_hz DOUBLE PRECISION,
  carbon_dioxide_in_ppm DOUBLE PRECISION,
  light_intensity_in_lux DOUBLE PRECISION
);

INSERT INTO multi_modal_sensor_station_data (
  timestamp, sensor_id, temperature, humidity, frequency_in_hz, carbon_dioxide_in_ppm, light_intensity_in_lux
) VALUES
  ('2025-07-06T12:10:00Z', 'park-station-tiergarten', 25.3, 52.3, 445.0, 410.0, 360.0),
  ('2025-07-06T12:15:00Z', 'forest-station-grunewald', 23.8, 47.7, 438.0, 398.5, 345.0),
  ('2025-07-06T12:20:00Z', 'forest-station-schoeneweide', 26.1, 53.9, 441.2, 420.0, 385.0),
  ('2025-07-06T12:25:00Z', 'park-station-golm', 21.9, 49.5, 439.5, 387.0, 330.0);