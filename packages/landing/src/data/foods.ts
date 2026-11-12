import countries from './json/countries.json';
import drinks from './json/meal-drinks.json';
import foodsJson from './json/meal-foods.json';
import snacks from './json/meal-snacks.json';

export const foodsAndDrinks = [...foodsJson, ...drinks, ...snacks];

type OptionItem = { country: string; value: string; label: string };

const buildOptions = (items: OptionItem[]): Record<string, string[]> => {
  const options: Record<string, string[]> = {
    all: items.map((item) => item.label),
  };

  countries.forEach((cuisine) => {
    options[cuisine.value] = items
      .filter((item) => item.country === cuisine.value)
      .map((item) => item.label);
  });

  items.forEach((item) => {
    options[item.value] = [item.label];
  });

  return options;
};

export const FOOD_OPTIONS = buildOptions(foodsJson);
export const DRINK_OPTIONS = buildOptions(drinks);
export const SNACK_OPTIONS = buildOptions(snacks);
