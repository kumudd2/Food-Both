// client/src/utils/categoryMatcher.js
// Universal category and filter matching utility across all FoodBooth portals

export const CANONICAL_CATEGORIES = [
  {
    id: 'all',
    name: 'All Dishes',
    aliases: ['all', 'alldishes', 'allitems', 'every'],
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    aliases: ['breakfast', 'morning', 'dosa', 'idli', 'south indian', 'upma', 'paratha'],
  },
  {
    id: 'main',
    name: 'Mains & Thalis',
    aliases: [
      'main',
      'mains',
      'thali',
      'thalis',
      'mainsthalis',
      'mains & thalis',
      'meals',
      'lunch',
      'dinner',
      'curry',
      'rice',
      'roti',
    ],
  },
  {
    id: 'fastfood',
    name: 'Burgers & Pizza',
    aliases: [
      'fastfood',
      'fast food',
      'burgers & pizza',
      'burgers & pizzas',
      'burger',
      'burgers',
      'pizza',
      'pizzas',
      'sandwich',
      'sandwiches',
      'wrap',
      'wraps',
    ],
  },
  {
    id: 'snacks',
    name: 'Snacks & Chaat',
    aliases: [
      'snacks',
      'snack',
      'chaat',
      'chaat & snacks',
      'snacks & chaat',
      'samosa',
      'fries',
      'pakora',
      'cutlet',
      'bhel',
    ],
  },
  {
    id: 'healthy',
    name: 'Healthy Bowls',
    aliases: [
      'healthy',
      'healthy bowls',
      'salad',
      'salads',
      'bowl',
      'bowls',
      'fruit',
      'sprouts',
      'diet',
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    aliases: [
      'beverages',
      'beverage',
      'drink',
      'drinks',
      'coffee',
      'tea',
      'chai',
      'juice',
      'shake',
      'shakes',
      'smoothie',
      'cold coffee',
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    aliases: [
      'desserts',
      'dessert',
      'sweet',
      'sweets',
      'bakery',
      'cake',
      'cakes',
      'brownie',
      'brownies',
      'ice cream',
      'pastry',
      'halwa',
      'gulab jamun',
    ],
  },
];

export function normalizeCategoryString(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Robustly matches an item's category against a filter selection.
 * Works seamlessly whether categories are stored as slugs ('fastfood'),
 * full names ('Burgers & Pizzas'), or UI labels ('Burgers & Pizza').
 */
export function matchesCategory(itemCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'all') return true;
  if (!itemCategory) return false;

  const normItem = normalizeCategoryString(itemCategory);
  const normSelected = normalizeCategoryString(selectedCategory);

  if (normItem === normSelected) return true;

  // Resolve selectedCategory to canonical definition
  const selectedCanonical = CANONICAL_CATEGORIES.find((cat) => {
    if (normalizeCategoryString(cat.id) === normSelected) return true;
    if (normalizeCategoryString(cat.name) === normSelected) return true;
    return cat.aliases.some((alias) => normalizeCategoryString(alias) === normSelected);
  });

  // Resolve itemCategory to canonical definition
  const itemCanonical = CANONICAL_CATEGORIES.find((cat) => {
    if (normalizeCategoryString(cat.id) === normItem) return true;
    if (normalizeCategoryString(cat.name) === normItem) return true;
    return cat.aliases.some((alias) => normalizeCategoryString(alias) === normItem);
  });

  if (selectedCanonical && itemCanonical) {
    if (selectedCanonical.id === itemCanonical.id) return true;
  }

  // Fallback substring search
  if (normItem.includes(normSelected) || normSelected.includes(normItem)) return true;

  return false;
}
