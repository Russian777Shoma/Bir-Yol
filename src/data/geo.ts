import type { Destination, Hotel } from "./destinations";

export type LatLng = { lat: number; lng: number };

export const destinationCenters: Record<string, LatLng> = {
  qebele: { lat: 40.9819, lng: 47.8478 },
  seki: { lat: 41.1919, lng: 47.1706 },
  quba: { lat: 41.3608, lng: 48.5128 },
  qusar: { lat: 41.4275, lng: 48.4308 },
  lenkeran: { lat: 38.7529, lng: 48.8475 },
  samaxi: { lat: 40.6319, lng: 48.6414 },
  baki: { lat: 40.4093, lng: 49.8671 },
  naftalan: { lat: 40.5069, lng: 46.8189 },
};

const offsets: LatLng[] = [
  { lat: 0.022, lng: -0.028 },
  { lat: -0.016, lng: 0.031 },
  { lat: 0.008, lng: 0.014 },
];

export type MappedHotel = Hotel & { position: LatLng; address: string };

export function getHotelMarkers(destination: Destination, hotels = destination.hotels): MappedHotel[] {
  const center = destinationCenters[destination.slug];
  if (!center) return [];
  return hotels.map((hotel, i) => {
    const off = offsets[i % offsets.length]!;
    return {
      ...hotel,
      position: { lat: center.lat + off.lat, lng: center.lng + off.lng },
      address: `${destination.name}, ${hotel.location}`,
    };
  });
}
