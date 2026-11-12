import {
  countries,
  DRINK_OPTIONS,
  FOOD_OPTIONS,
  foods,
  foodsAndDrinks,
  snacks,
  SNACK_OPTIONS,
} from '@/data';

describe('food data', () => {
  it('contains 480 foods, drinks, and snacks', () => {
    expect(foodsAndDrinks.length).toBe(480);
    expect(foodsAndDrinks).toHaveLength(foodsAndDrinks.length);
  });

  it('splits the data into foods, drinks, and snacks', () => {
    expect(foods).toHaveLength(360);
    expect(snacks).toHaveLength(60);
    expect(DRINK_OPTIONS.all).toHaveLength(60);
    expect(SNACK_OPTIONS.all).toHaveLength(60);
  });

  it('has unique values and non-empty labels', () => {
    const values = foodsAndDrinks.map((food) => food.value);
    expect(new Set(values).size).toBe(values.length);
    foodsAndDrinks.forEach((food) => {
      expect(food.label.length).toBeGreaterThan(0);
      expect(food.emoji.length).toBeGreaterThan(0);
    });
  });

  it('assigns every food to a known cuisine', () => {
    const cuisineValues = countries.map((cuisine) => cuisine.value);
    foodsAndDrinks.forEach((food) => {
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

  it('exposes drink and snack options scoped to their own sets', () => {
    expect(DRINK_OPTIONS.all).not.toContain('Sushi');
    expect(SNACK_OPTIONS.all).not.toContain('Sushi');
    expect(SNACK_OPTIONS.all).toContain('Apple Pie');
    countries.forEach((cuisine) => {
      expect(DRINK_OPTIONS[cuisine.value].length).toBeGreaterThan(0);
      expect(SNACK_OPTIONS[cuisine.value].length).toBeGreaterThan(0);
    });
  });

  it('maps a locked dish to itself so spins always land', () => {
    expect(FOOD_OPTIONS.sushi).toEqual(['Sushi']);
    expect(Object.keys(FOOD_OPTIONS)).toHaveLength(
      foods.length + countries.length + 1
    );
  });

  it('gives every cuisine exactly 30 foods plus 5 drinks and 5 snacks', () => {
    countries.forEach((cuisine) => {
      expect(
        foodsAndDrinks.filter((food) => food.country === cuisine.value)
      ).toHaveLength(40);
    });
  });

  it('covers the 12 cuisines', () => {
    expect(countries.map((cuisine) => cuisine.value)).toEqual([
      'chinese',
      'egypt',
      'indian',
      'italian',
      'japanese',
      'korean',
      'mexican',
      'thai',
      'turkish',
      'united-kingdom',
      'united-states',
      'vietnamese',
    ]);
  });
});
