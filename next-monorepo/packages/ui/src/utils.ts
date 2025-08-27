import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string) {
  return `${(firstName[0] || "").toUpperCase()}${(lastName[0] || "").toUpperCase()}`;
}

export function getRequestISODateRange(date: Date) {
  let from: string;
  const localDate = new Date(date.toISOString());
  const lastDateOfTheMonth = new Date(localDate.getFullYear(), localDate.getMonth() + 1, 0);

  const now = new Date();
  if (localDate.getMonth() === now.getMonth() && localDate.getFullYear() === now.getFullYear()) {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).toISOString();
  } else {
    from = new Date(localDate.getFullYear(), localDate.getMonth(), 1, 0, 0).toISOString();
  }

  const to = new Date(lastDateOfTheMonth.getFullYear(), lastDateOfTheMonth.getMonth(), lastDateOfTheMonth.getDate(), 23, 59).toISOString();
  return { from, to };
}
