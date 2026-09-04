export type AvailableBike = {
  bike_id: string;
  is_disabled: boolean;
  is_reserved: boolean;
  lat: number;
  lon: number;
  pricing_plan_id: string;
  rental_uris: { android: string; ios: string; web: string };
  station_id: string;
  vehicle_type_id: string;
};
