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

// ---- Project Health / Risk Score ----
// Accepts one project object and the full tasks array.
// Returns { status: "Healthy" | "At Risk" | "Critical", reasons: string[] }
// where reasons is a human-readable list of why the project is at risk.
export function getProjectHealth(project, tasks) {
  const reasons = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline    = project.deadline ? new Date(project.deadline) : null;
  const isCompleted = project.status === "Completed";
  const progress    = project.progress    || 0;
  const budget      = project.budget      || 0;
  const actualCost  = project.actualCost  || 0;

  // Rule 1 — Critical: spending more than budgeted AND less than 70% done
  if (actualCost > budget && progress < 70) {
    reasons.push({
      level:  "Critical",
      text:   `Over budget and only ${progress}% complete`,
    });
  }

  // Rule 2 — Critical: deadline has already passed and project is not finished
  if (deadline && deadline < today && !isCompleted) {
    reasons.push({
      level: "Critical",
      text:  "Deadline has passed and the project is not completed",
    });
  }

  // Rule 3 — At Risk: deadline is coming up in ≤7 days and progress is below 80%
  if (deadline && !isCompleted) {
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    if (daysLeft >= 0 && daysLeft <= 7 && progress < 80) {
      reasons.push({
        level: "At Risk",
        text:  `Deadline in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — progress is only ${progress}%`,
      });
    }
  }

  // Rule 4 — At Risk: there are open High-priority tasks for this project
  const projectTasks     = tasks.filter((t) => t.projectId === project.id);
  const highPriorityOpen = projectTasks.filter(
    (t) => t.priority === "High" && t.status !== "Done"
  );
  if (highPriorityOpen.length > 0) {
    reasons.push({
      level: "At Risk",
      text:  `${highPriorityOpen.length} high-priority task${highPriorityOpen.length > 1 ? "s" : ""} still open`,
    });
  }

  // Rule 5 — Otherwise Healthy (no risk reasons found)
  if (reasons.some((r) => r.level === "Critical")) return { status: "Critical", reasons };
  if (reasons.some((r) => r.level === "At Risk"))  return { status: "At Risk",  reasons };
  return { status: "Healthy", reasons: [] };
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
