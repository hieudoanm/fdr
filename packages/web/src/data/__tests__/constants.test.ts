import { countries, FOOD_OPTIONS, foods } from '@/data';

describe('food data', () => {
  it('contains 200 foods', () => {
    expect(foods.length).toBe(200);
    expect(foods).toHaveLength(foods.length);
  });

  it('has unique food values and non-empty labels', () => {
    const values = foods.map((food) => food.value);
    expect(new Set(values).size).toBe(values.length);
    foods.forEach((food) => {
      expect(food.label.length).toBeGreaterThan(0);
      expect(food.emoji.length).toBeGreaterThan(0);
    });
  });

  it('assigns every food to a known cuisine', () => {
    const cuisineValues = countries.map((cuisine) => cuisine.value);
    foods.forEach((food) => {
      expect(cuisineValues).toContain(food.country);
    });
  });

  it('exposes options per cuisine plus a combined all list', () => {
    expect(FOOD_OPTIONS.all).toHaveLength(foods.length);
    countries.forEach((cuisine) => {
      const expected = foods
        .filter((food) => food.country === cuisine.value)
        .map((food) => food.label);
      expect(FOOD_OPTIONS[cuisine.value]).toEqual(expected);
    });
  });

  it('maps a locked dish to itself so spins always land', () => {
    expect(FOOD_OPTIONS.sushi).toEqual(['Sushi']);
    expect(Object.keys(FOOD_OPTIONS)).toHaveLength(
      foods.length + countries.length + 1
    );
  });

  it('gives every cuisine exactly 20 foods', () => {
    countries.forEach((cuisine) => {
      expect(
        foods.filter((food) => food.country === cuisine.value)
      ).toHaveLength(20);
    });
  });

  it('covers the USA, China, India, Italy, Japan, Korea, Mexico, Thailand, Turkey and Vietnam', () => {
    expect(countries.map((cuisine) => cuisine.value)).toEqual([
      'american',
      'chinese',
      'indian',
      'italian',
      'japanese',
      'korean',
      'mexican',
      'thai',
      'turkish',
      'vietnamese',
    ]);
  });
});
