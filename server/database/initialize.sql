CREATE TABLE IF NOT EXISTS multi_modal_sensor_station_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ,
  sensor_id VARCHAR(20),
  temperature NUMERIC,
  humidity NUMERIC,
  frequency_in_hz DOUBLE PRECISION,
  carbon_dioxide_in_ppm DOUBLE PRECISION,
  light_intensity_in_lux DOUBLE PRECISION
);