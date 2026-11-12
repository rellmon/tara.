export const TRIP_SECTIONS = [
  { id: 'trip-travelers', label: 'Travelers' },
  { id: 'trip-costs', label: 'Costs' },
  { id: 'trip-budget', label: 'Budget' },
  { id: 'trip-expenses', label: 'Expenses' },
  { id: 'trip-itinerary', label: 'Itinerary' },
  { id: 'trip-packing', label: 'Packing' },
] as const

export type TripSectionId = (typeof TRIP_SECTIONS)[number]['id']