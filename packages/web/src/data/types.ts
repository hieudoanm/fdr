export interface Cuisine {
  emoji: string;
  value: string;
  label: string;
}

export interface Food {
  emoji: string;
  value: string;
  label: string;
  country: string;
  category: string;
  subcategory: string;
}

export interface ScheduleEntry {
  day: string;
  meal: string;
  emoji: string;
  restaurant: string;
  note: string;
}
