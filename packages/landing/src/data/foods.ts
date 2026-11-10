import countries from './json/countries.json';
import foods from './json/foods.json';

export const FOOD_OPTIONS: Record<string, string[]> = {
  all: foods.map((food) => food.label),
};

countries.forEach((cuisine: { value: string }) => {
  FOOD_OPTIONS[cuisine.value] = foods
    .filter((food) => food.country === cuisine.value)
    .map((food) => food.label);
});

foods.forEach((food: { value: string; label: string }) => {
  FOOD_OPTIONS[food.value] = [food.label];
});
