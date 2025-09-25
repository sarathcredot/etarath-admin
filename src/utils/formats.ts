import { format } from "date-fns";

export const formatNumberShort = (num: number) => {
  const format = (value: number, suffix: string) =>
    parseFloat(value.toFixed(1)).toString() + suffix;

  if (num >= 1_000_000_000) return format(num / 1_000_000_000, "B");
  if (num >= 1_000_000) return format(num / 1_000_000, "M");
  if (num >= 1_000) return format(num / 1_000, "K");
  return num.toString();
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy", { useAdditionalDayOfYearTokens: true });
};

export const formatText = (str: string = "") =>
  str
    .replace(/_/g, " ") // Replace underscores with space
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
