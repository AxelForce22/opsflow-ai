// Shared helper functions used across components

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Returns true if the item is not done and its due date is in the past
export function isOverdue(dueDate, status) {
  if (!dueDate || status === "Done" || status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

// Maps status/priority values to CSS badge modifier class names
export const BADGE_CLASS = {
  Planning:     "badge--planning",
  Active:       "badge--active",
  Blocked:      "badge--blocked",
  Completed:    "badge--completed",
  Open:         "badge--open",
  "In Progress": "badge--in-progress",
  Done:         "badge--done",
  Low:          "badge--low",
  Medium:       "badge--medium",
  High:         "badge--high",
};
