// =============================================================
// biHelpers.js — All Business Intelligence calculation logic
//
// These are plain JavaScript functions (no React).
// They take project and task data and return analysis objects.
// Import only what you need in each component.
// =============================================================

// ---- Currency formatting (EUR) --------------------------------

export function formatEUR(amount) {
  // Safely format a number as EUR. Returns "Missing data" if invalid.
  if (amount === null || amount === undefined || isNaN(amount) || !isFinite(amount)) {
    return "Missing data";
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---- Safe date helpers ----------------------------------------

// Parse a date string safely. Returns a Date object or null if invalid.
//
// WHY the normalization: JavaScript parses date-only strings like "2026-05-10"
// as UTC midnight. But everywhere we compare against "today" we use local
// midnight (setHours(0,0,0,0)). In a UTC+2 timezone, UTC midnight May 10 is
// actually 02:00 local, so May 11 local midnight minus UTC midnight May 10
// is only -22h → Math.ceil gives 0, not -1 → the project looks "on time"
// when it is actually one day overdue. Appending T00:00:00 forces local-time
// parsing, keeping both dates in the same time reference.
export function safeDate(dateStr) {
  if (!dateStr) return null;
  const normalized =
    typeof dateStr === "string" && !dateStr.includes("T")
      ? dateStr + "T00:00:00"   // date-only string → parse as local midnight
      : dateStr;                 // datetime string already has timezone info
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

// Returns how many days until a deadline (negative = overdue).
// Returns null if no valid date given.
export function getDaysUntilDeadline(dateStr) {
  const date = safeDate(dateStr);
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

// ---- Timeline status for a project ----------------------------

// Returns one of: "Completed" | "Overdue" | "Due Soon" | "Upcoming" | "On Track" | "No Deadline"
export function getTimelineStatus(project) {
  // Completed projects are never shown as overdue
  if (project.status === "Completed") return "Completed";

  const days = getDaysUntilDeadline(project.deadline);

  if (days === null)     return "No Deadline";
  if (days < 0)          return "Overdue";
  if (days <= 7)         return "Due Soon";
  if (days <= 30)        return "Upcoming";
  return "On Track";
}

// ---- Budget variance calculation ------------------------------

// Returns { variance, variancePct, status }
// variance = actual - planned (positive = over budget)
// variancePct = variance as a % of planned budget
// status = "Under Budget" | "On Track" | "Over Budget" | "Missing Data"
export function calculateBudgetVariance(project) {
  const budget = project.budget;
  const actual = project.actualCost;

  // Guard: if budget is missing, zero, or invalid → no calculation possible
  if (!budget || budget <= 0 || actual === undefined || actual === null || isNaN(actual)) {
    return { variance: null, variancePct: null, status: "Missing Data" };
  }

  const variance    = actual - budget;
  const variancePct = (variance / budget) * 100;

  let status;
  if (variancePct < -5)  status = "Under Budget"; // more than 5% below planned
  else if (variancePct <= 5) status = "On Track";  // within ±5%
  else                   status = "Over Budget";    // more than 5% above planned

  return { variance, variancePct, status };
}

// Convenience wrapper — returns just the status string
export function getBudgetStatus(project) {
  return calculateBudgetVariance(project).status;
}

// ---- Point-based risk scoring --------------------------------

// Each risk factor adds points. Total determines overall health status.
//   0–1 points → Healthy
//   2–4 points → At Risk
//   5+  points → Critical
//
// Returns { status, score, reasons, action }
// reasons = array of { points, level, text } explaining what triggered the score
export function calculateProjectRisk(project, tasks) {
  let score = 0;
  const reasons = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline    = safeDate(project.deadline);
  const isCompleted = project.status === "Completed";
  const progress    = project.progress    ?? 0;
  const budget      = project.budget      ?? 0;
  const actual      = project.actualCost  ?? 0;

  // Find tasks belonging to this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // +3 — Deadline has already passed and project is not finished
  if (deadline && deadline < today && !isCompleted) {
    score += 3;
    const daysLate = Math.abs(Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
    reasons.push({ points: 3, level: "Critical", text: `Deadline passed ${daysLate} day(s) ago and project is not completed` });
  }

  // +2 — Deadline is within 7 days and project is less than 80% done
  if (deadline && !isCompleted) {
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    if (daysLeft >= 0 && daysLeft <= 7 && progress < 80) {
      score += 2;
      reasons.push({ points: 2, level: "High", text: `Deadline in ${daysLeft} day(s) with only ${progress}% progress` });
    }
  }

  // +2 — Actual cost is more than 10% above planned budget
  if (budget > 0 && actual > budget * 1.10) {
    score += 2;
    const overPct = Math.round(((actual - budget) / budget) * 100);
    reasons.push({ points: 2, level: "High", text: `${overPct}% over planned budget` });
  // +1 — Actual cost is 5–10% above planned budget (warning zone)
  } else if (budget > 0 && actual > budget * 1.05) {
    score += 1;
    const overPct = Math.round(((actual - budget) / budget) * 100);
    reasons.push({ points: 1, level: "Medium", text: `${overPct}% above planned budget (approaching limit)` });
  }

  // +2 — Active project with less than 50% progress (stalled)
  if (project.status === "Active" && progress < 50) {
    score += 2;
    reasons.push({ points: 2, level: "High", text: `Project is active but only ${progress}% complete` });
  }

  // Check for overdue high-priority tasks
  const highPriorityTasks    = projectTasks.filter((t) => t.priority === "High");
  const overdueHighPriority  = highPriorityTasks.filter((t) => {
    if (t.status === "Done") return false;
    const due = safeDate(t.dueDate);
    return due && due < today;
  });
  const openHighPriority     = highPriorityTasks.filter((t) => t.status !== "Done");

  // +2 — There are overdue high-priority tasks
  if (overdueHighPriority.length > 0) {
    score += 2;
    reasons.push({
      points: 2, level: "High",
      text: `${overdueHighPriority.length} high-priority task(s) are past their due date`,
    });
  // +1 — There are open (not overdue) high-priority tasks
  } else if (openHighPriority.length > 0) {
    score += 1;
    reasons.push({
      points: 1, level: "Medium",
      text: `${openHighPriority.length} high-priority task(s) still open`,
    });
  }

  // +1 — No planned budget set
  if (!budget || budget <= 0) {
    score += 1;
    reasons.push({ points: 1, level: "Low", text: "Planned budget data is missing" });
  }

  // +1 — No deadline set
  if (!project.deadline) {
    score += 1;
    reasons.push({ points: 1, level: "Low", text: "No deadline has been set for this project" });
  }

  // Determine overall health status from total score
  let status;
  if (score >= 5)       status = "Critical";
  else if (score >= 2)  status = "At Risk";
  else                  status = "Healthy";

  // Suggest a next action based on health status
  let action;
  if (status === "Critical")  action = "Escalate to management — review budget, timeline, and open blockers immediately.";
  else if (status === "At Risk") action = "Schedule a project review and address the identified risk factors.";
  else                        action = "Continue standard weekly monitoring.";

  return { status, score, reasons, action };
}

// ---- Executive insights --------------------------------------

// Generates 3–7 plain-English business insight strings for the Executive Summary.
// Each insight is { icon, text }.
export function generateExecutiveInsights(projects, tasks) {
  if (projects.length === 0) {
    return [{ icon: "ℹ", text: "No project data available. Add projects to see insights." }];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const insights = [];

  // Active / completed counts
  const active    = projects.filter((p) => p.status === "Active");
  const completed = projects.filter((p) => p.status === "Completed");
  insights.push({
    icon: "◈",
    text: `${active.length} project${active.length !== 1 ? "s are" : " is"} currently active${completed.length > 0 ? `, with ${completed.length} completed` : ""}.`,
  });

  // Risk counts
  const riskCounts = projects.reduce(
    (acc, p) => {
      const { status } = calculateProjectRisk(p, tasks);
      if (status === "Critical")  acc.critical++;
      else if (status === "At Risk") acc.atRisk++;
      return acc;
    },
    { critical: 0, atRisk: 0 }
  );
  const totalUnhealthy = riskCounts.critical + riskCounts.atRisk;
  if (totalUnhealthy > 0) {
    insights.push({
      icon: "▲",
      text: `${totalUnhealthy} project${totalUnhealthy !== 1 ? "s require" : " requires"} management attention — ${riskCounts.critical} critical, ${riskCounts.atRisk} at risk.`,
    });
  }

  // Budget variance (only for projects with valid budget data)
  const budgeted    = projects.filter((p) => p.budget > 0);
  const totalBudget = budgeted.reduce((s, p) => s + p.budget, 0);
  const totalActual = budgeted.reduce((s, p) => s + (p.actualCost || 0), 0);
  const variance    = totalActual - totalBudget;
  if (budgeted.length > 0) {
    if (variance > 0) {
      insights.push({
        icon: "↑",
        text: `Actual costs exceed planned budget by ${formatEUR(variance)} across tracked projects.`,
      });
    } else if (variance < 0) {
      insights.push({
        icon: "↓",
        text: `Projects are ${formatEUR(Math.abs(variance))} under planned budget overall — good financial performance.`,
      });
    } else {
      insights.push({ icon: "✓", text: "Actual costs are exactly on budget across all tracked projects." });
    }
  }

  // Overdue tasks
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "Done") return false;
    const due = safeDate(t.dueDate);
    return due && due < today;
  });
  if (overdueTasks.length > 0) {
    insights.push({
      icon: "!",
      text: `${overdueTasks.length} task${overdueTasks.length !== 1 ? "s are" : " is"} past due and still open.`,
    });
  }

  // High-priority open tasks
  const highPriorityOpen = tasks.filter((t) => t.priority === "High" && t.status !== "Done");
  if (highPriorityOpen.length > 0) {
    insights.push({
      icon: "▲",
      text: `${highPriorityOpen.length} high-priority task${highPriorityOpen.length !== 1 ? "s are" : " is"} still open across active projects.`,
    });
  }

  // Upcoming deadlines within 7 days
  const upcomingSoon = projects.filter((p) => {
    if (p.status === "Completed") return false;
    const days = getDaysUntilDeadline(p.deadline);
    return days !== null && days >= 0 && days <= 7;
  });
  if (upcomingSoon.length > 0) {
    insights.push({
      icon: "◷",
      text: `${upcomingSoon.length} project${upcomingSoon.length !== 1 ? "s have" : " has"} a deadline within the next 7 days.`,
    });
  }

  // Task completion rate
  const doneTasks      = tasks.filter((t) => t.status === "Done");
  const completionRate = tasks.length > 0
    ? Math.round((doneTasks.length / tasks.length) * 100)
    : 0;
  insights.push({
    icon: "◎",
    text: `Overall task completion rate is ${completionRate}% (${doneTasks.length} of ${tasks.length} tasks done).`,
  });

  return insights;
}

// ---- Management recommendations ------------------------------

// Generates a list of actionable recommendations for each project.
// Each item: { project, responsible, issue, action, priority, reason, daysLeft }
// Sorted: High → Medium → Low, then by urgency (daysLeft ascending).
export function generateRecommendations(projects, tasks) {
  const recs  = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  projects.forEach((project) => {
    const { status, score, reasons } = calculateProjectRisk(project, tasks);
    const days     = getDaysUntilDeadline(project.deadline);
    const budget   = project.budget    ?? 0;
    const actual   = project.actualCost ?? 0;
    const progress = project.progress   ?? 0;
    const owner    = project.responsible || "Unassigned";
    const projectTasks = tasks.filter((t) => t.projectId === project.id);

    // Track if we already added a recommendation for this specific project (by id)
    const added = () => recs.some((r) => r.projectId === project.id);

    // Helper to build a recommendation with projectId always included
    const rec = (fields) => ({ projectId: project.id, project: project.name, responsible: owner, daysLeft: days, ...fields });

    // Critical projects get one high-level rec that covers everything
    if (status === "Critical") {
      recs.push(rec({
        issue:    "Critical project risk",
        action:   "Review budget, timeline, and open blockers immediately. Escalate to senior management.",
        priority: "High",
        reason:   reasons.map((r) => r.text).join("; "),
      }));
      return; // Skip more granular recs for this project
    }

    // Budget overrun > 10%
    if (budget > 0 && actual > budget * 1.10) {
      const overPct = Math.round(((actual - budget) / budget) * 100);
      recs.push(rec({
        issue:    "Budget overrun",
        action:   "Investigate cost drivers and update the project budget forecast.",
        priority: "High",
        reason:   `Actual spend is ${overPct}% above planned budget.`,
      }));
    // Budget overrun 5–10%
    } else if (budget > 0 && actual > budget * 1.05) {
      const overPct = Math.round(((actual - budget) / budget) * 100);
      recs.push(rec({
        issue:    "Budget approaching limit",
        action:   "Monitor spend closely and flag if costs continue to rise.",
        priority: "Medium",
        reason:   `Actual spend is ${overPct}% above planned budget.`,
      }));
    }

    // Overdue deadline
    if (days !== null && days < 0 && project.status !== "Completed") {
      recs.push(rec({
        issue:    "Overdue project deadline",
        action:   "Escalate the timeline risk and define a recovery plan with the project team.",
        priority: "High",
        reason:   `Project is ${Math.abs(days)} day(s) past its deadline with ${progress}% progress.`,
      }));
    }

    // Deadline within 7 days and progress < 80%
    if (days !== null && days >= 0 && days <= 7 && progress < 80 && project.status !== "Completed") {
      recs.push(rec({
        issue:    "Upcoming deadline risk",
        action:   "Review remaining tasks and assign additional support if needed.",
        priority: days <= 3 ? "High" : "Medium",
        reason:   `Deadline in ${days} day(s) with only ${progress}% progress.`,
      }));
    }

    // Overdue high-priority tasks
    const overdueHighPrio = projectTasks.filter((t) => {
      if (t.priority !== "High" || t.status === "Done") return false;
      const due = safeDate(t.dueDate);
      return due && due < today;
    });
    if (overdueHighPrio.length > 0) {
      recs.push(rec({
        issue:    "Overdue high-priority tasks",
        action:   `Escalate ${overdueHighPrio.length} overdue high-priority task(s) to the responsible owner.`,
        priority: "High",
        reason:   `${overdueHighPrio.length} high-priority task(s) are past their due date.`,
      }));
    }

    // Low progress while active (only add if no other rec exists for this project yet)
    if (project.status === "Active" && progress < 50 && !added()) {
      recs.push(rec({
        issue:    "Low delivery progress",
        action:   "Review blockers and clarify next milestones with the project team.",
        priority: "Medium",
        reason:   `Project is active but only ${progress}% complete.`,
      }));
    }

    // Healthy — standard monitoring recommendation
    if (status === "Healthy" && !added()) {
      recs.push(rec({
        issue:    "No major risk detected",
        action:   "Continue standard weekly monitoring.",
        priority: "Low",
        reason:   "Project is on track with no significant risk factors identified.",
      }));
    }
  });

  // Sort: High first, then Medium, then Low. Within same priority, most urgent (smallest daysLeft) first.
  const ORDER = { High: 0, Medium: 1, Low: 2 };
  return recs.sort((a, b) => {
    const pDiff = ORDER[a.priority] - ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    if (a.daysLeft === null && b.daysLeft === null) return 0;
    if (a.daysLeft === null) return 1;
    if (b.daysLeft === null) return -1;
    return a.daysLeft - b.daysLeft;
  });
}

// ---- Management report export --------------------------------

// Generates a plain-text management report and triggers a browser download.
export function exportManagementReport(projects, tasks) {
  const today     = new Date();
  const dateStr   = today.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr   = today.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const todayMid  = new Date(); todayMid.setHours(0, 0, 0, 0);

  // Calculate data for the report.
  // Budget totals use the same filter as Executive Summary (projects with budget > 0)
  // so the numbers in the report match what the dashboard shows.
  const insights         = generateExecutiveInsights(projects, tasks);
  const recommendations  = generateRecommendations(projects, tasks);
  const budgeted         = projects.filter((p) => p.budget > 0);
  const totalBudget      = budgeted.reduce((s, p) => s + p.budget, 0);
  const totalActual      = budgeted.reduce((s, p) => s + (p.actualCost || 0), 0);
  const variance         = totalActual - totalBudget;
  const criticalProjects = projects.filter((p) => calculateProjectRisk(p, tasks).status === "Critical");
  const atRiskProjects   = projects.filter((p) => calculateProjectRisk(p, tasks).status === "At Risk");
  const overBudget       = projects.filter((p) => calculateBudgetVariance(p).status === "Over Budget");
  const overdueTasks     = tasks.filter((t) => {
    if (t.status === "Done") return false;
    const due = safeDate(t.dueDate);
    return due && due < todayMid;
  });
  const highPriorityOpen = tasks.filter((t) => t.priority === "High" && t.status !== "Done");
  const doneTasks        = tasks.filter((t) => t.status === "Done");
  const completionRate   = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  const sep   = "=".repeat(52);
  const dash  = "-".repeat(52);

  const lines = [
    sep,
    "  OPSFLOW AI — MANAGEMENT REPORT",
    sep,
    `  Generated: ${dateStr} at ${timeStr}`,
    `  Projects in scope: ${projects.length}   Tasks in scope: ${tasks.length}`,
    "",
    dash,
    "  EXECUTIVE SUMMARY",
    dash,
    ...insights.map((i) => `  ${i.icon}  ${i.text}`),
    "",
    dash,
    "  KPI OVERVIEW",
    dash,
    `  Total Projects:          ${projects.length}`,
    `  Active Projects:         ${projects.filter((p) => p.status === "Active").length}`,
    `  Completed Projects:      ${projects.filter((p) => p.status === "Completed").length}`,
    `  Critical Projects:       ${criticalProjects.length}`,
    `  At-Risk Projects:        ${atRiskProjects.length}`,
    `  Total Tasks:             ${tasks.length}`,
    `  Task Completion Rate:    ${completionRate}%`,
    `  Overdue Tasks:           ${overdueTasks.length}`,
    `  High-Priority Open:      ${highPriorityOpen.length}`,
    "",
    dash,
    "  BUDGET OVERVIEW",
    dash,
    `  Total Planned Budget:    ${formatEUR(totalBudget)}`,
    `  Total Actual Cost:       ${formatEUR(totalActual)}`,
    `  Total Variance:          ${variance >= 0 ? "+" : ""}${formatEUR(variance)}`,
    `  Over-Budget Projects:    ${overBudget.length}`,
    "",
  ];

  // Critical projects section
  lines.push(dash, "  CRITICAL PROJECTS", dash);
  if (criticalProjects.length > 0) {
    criticalProjects.forEach((p) => {
      const { score, reasons, action } = calculateProjectRisk(p, tasks);
      lines.push(`  • ${p.name}  (Owner: ${p.responsible || "Unassigned"})  Risk score: ${score}`);
      reasons.forEach((r) => lines.push(`    - ${r.text}`));
      lines.push(`    Action: ${action}`);
    });
  } else {
    lines.push("  No critical projects at this time.");
  }
  lines.push("");

  // Over-budget projects
  lines.push(dash, "  OVER-BUDGET PROJECTS", dash);
  if (overBudget.length > 0) {
    overBudget.forEach((p) => {
      const { variance: v, variancePct } = calculateBudgetVariance(p);
      lines.push(`  • ${p.name}  Overrun: ${formatEUR(v)} (+${Math.round(variancePct)}%)`);
    });
  } else {
    lines.push("  No over-budget projects at this time.");
  }
  lines.push("");

  // Overdue tasks
  lines.push(dash, "  OVERDUE TASKS", dash);
  if (overdueTasks.length > 0) {
    overdueTasks.forEach((t) => {
      lines.push(`  • ${t.title}  [${t.priority}]  Owner: ${t.responsible || "Unassigned"}  Due: ${t.dueDate || "unknown"}`);
    });
  } else {
    lines.push("  No overdue tasks at this time.");
  }
  lines.push("");

  // Recommendations (High + Medium only to keep report concise)
  lines.push(dash, "  MANAGEMENT RECOMMENDATIONS", dash);
  const actionableRecs = recommendations.filter((r) => r.priority !== "Low");
  if (actionableRecs.length > 0) {
    let lastPriority = "";
    actionableRecs.forEach((r) => {
      if (r.priority !== lastPriority) {
        lines.push(`  [${r.priority.toUpperCase()} PRIORITY]`);
        lastPriority = r.priority;
      }
      lines.push(`  • ${r.project}  —  ${r.issue}`);
      lines.push(`    Action: ${r.action}`);
      lines.push(`    Reason: ${r.reason}`);
    });
  } else {
    lines.push("  No critical recommendations. Continue regular monitoring.");
  }

  lines.push("", sep, "  End of report — Generated by OpsFlow AI", sep);

  // Trigger browser download
  const content = lines.join("\n");
  const blob    = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  a.href        = url;
  a.download    = `OpsFlow-Report-${today.toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
