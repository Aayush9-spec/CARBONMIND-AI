import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a number as kg CO₂e with appropriate precision.
 */
export function formatEmissions(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t CO₂e`;
  }
  if (kg >= 10) {
    return `${Math.round(kg)} kg CO₂e`;
  }
  if (kg >= 1) {
    return `${kg.toFixed(1)} kg CO₂e`;
  }
  return `${(kg * 1000).toFixed(0)} g CO₂e`;
}

/**
 * Format emissions as a compact number (no unit).
 */
export function formatEmissionsCompact(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  if (kg >= 10) {
    return `${Math.round(kg)} kg`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Format a percentage change with sign indicator.
 */
export function formatChange(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Format a confidence score as a percentage.
 */
export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Format a date for display in activity lists.
 */
export function formatActivityDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a relative time string.
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a date range (e.g., for weekly reports).
 */
export function formatDateRange(start: Date, end: Date): string {
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Format points with thousands separator.
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('en-US');
}

/**
 * Get a human-readable category name.
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    transport: 'Transportation',
    food: 'Food & Diet',
    energy: 'Energy',
    shopping: 'Shopping',
  };
  return labels[category] ?? category;
}

/**
 * Get a human-readable subcategory name.
 */
export function getSubcategoryLabel(subcategory: string): string {
  const labels: Record<string, string> = {
    car_gasoline: 'Car (Gasoline)',
    car_diesel: 'Car (Diesel)',
    car_electric: 'Car (Electric)',
    bus: 'Bus',
    train: 'Train',
    flight_domestic: 'Domestic Flight',
    flight_international: 'International Flight',
    bicycle: 'Bicycle',
    walking: 'Walking',
    motorcycle: 'Motorcycle',
    beef: 'Beef',
    chicken: 'Chicken',
    pork: 'Pork',
    fish: 'Fish',
    dairy: 'Dairy',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    grains: 'Grains',
    processed_food: 'Processed Food',
    electricity: 'Electricity',
    natural_gas: 'Natural Gas',
    heating_oil: 'Heating Oil',
    solar: 'Solar',
    lpg: 'LPG',
    clothing: 'Clothing',
    electronics: 'Electronics',
    furniture: 'Furniture',
    general: 'General Shopping',
    books: 'Books',
    personal_care: 'Personal Care',
  };
  return labels[subcategory] ?? subcategory;
}

/**
 * Get the color associated with a carbon category.
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    transport: '#3b82f6',
    food: '#f59e0b',
    energy: '#ef4444',
    shopping: '#8b5cf6',
  };
  return colors[category] ?? '#6b7280';
}

/**
 * Get the icon name (Lucide) for a category.
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    transport: 'Car',
    food: 'UtensilsCrossed',
    energy: 'Zap',
    shopping: 'ShoppingBag',
  };
  return icons[category] ?? 'Leaf';
}
