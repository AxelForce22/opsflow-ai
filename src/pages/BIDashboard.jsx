import { useState, useMemo } from "react";

import { calculateProjectRisk, getBudgetStatus, getTimelineStatus, exportManagementReport } from "../bi/biHelpers.js";

import BiFilters               from "../components/bi/BiFilters.jsx";
import ExecutiveSummary        from "../components/bi/ExecutiveSummary.jsx";
import ManagementRecommendations from "../components/bi/ManagementRecommendations.jsx";
import BudgetIntelligence      from "../components/bi/BudgetIntelligence.jsx";
import TimelineIntelligence    from "../components/bi/TimelineIntelligence.jsx";
import RiskOverview            from "../components/RiskOverview.jsx";

// Default filter state — "All" means no filter applied for that dimension
const DEFAULT_FILTERS = {
  status:      "All",
  category:    "All",
  responsible: "All",
  riskLevel:   "All",
  budgetStatus:"All",
  timePeriod:  "All",
};

export default function BIDashboard({ projects, tasks }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Apply BI filters to projects
  // useMemo recalculates only when projects, tasks, or filters change
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Filter by project status
      if (filters.status !== "All" && p.status !== filters.status) return false;

      // Filter by category
      if (filters.category !== "All" && p.category !== filters.category) return false;

      // Filter by responsible person
      if (filters.responsible !== "All" && p.responsible !== filters.responsible) return false;

      // Filter by risk level (requires calculating risk — only when filter is active)
      if (filters.riskLevel !== "All") {
        const { status } = calculateProjectRisk(p, tasks);
        if (status !== filters.riskLevel) return false;
      }

      // Filter by budget status (requires calculating variance — only when filter is active)
      if (filters.budgetStatus !== "All") {
        if (getBudgetStatus(p) !== filters.budgetStatus) return false;
      }

      // Filter by time period
      if (filters.timePeriod !== "All") {
        const tStatus = getTimelineStatus(p);
        if (filters.timePeriod === "Overdue" && tStatus !== "Overdue") return false;
        if (filters.timePeriod === "7days"   && !["Overdue", "Due Soon"].includes(tStatus)) return false;
        if (filters.timePeriod === "30days"  && !["Overdue", "Due Soon", "Upcoming"].includes(tStatus)) return false;
      }

      return true;
    });
  }, [projects, tasks, filters]);

  // Filter tasks to those linked to a filtered project (or unlinked tasks)
  const filteredProjectIds = useMemo(
    () => new Set(filteredProjects.map((p) => p.id)),
    [filteredProjects]
  );
  const filteredTasks = useMemo(
    () => tasks.filter((t) => !t.projectId || filteredProjectIds.has(t.projectId)),
    [tasks, filteredProjectIds]
  );

  function handleExport() {
    exportManagementReport(filteredProjects, filteredTasks);
  }

  return (
    <div className="page">
      {/* Page header */}
      <div className="page__header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="page__title">Business Intelligence</div>
          <div className="page__subtitle">
            Operational analysis, risk scoring, budget intelligence, and management reporting
          </div>
        </div>
        <button className="btn btn--primary" onClick={handleExport}>
          ↓ Generate Management Report
        </button>
      </div>

      {/* BI Filters */}
      <BiFilters
        projects={projects}
        tasks={tasks}
        filters={filters}
        setFilters={setFilters}
        filteredCount={{ projects: filteredProjects.length, tasks: filteredTasks.length }}
      />

      {/* Executive Summary */}
      <ExecutiveSummary projects={filteredProjects} tasks={filteredTasks} />

      {/* Management Recommendations */}
      <ManagementRecommendations projects={filteredProjects} tasks={filteredTasks} />

      {/* Budget Intelligence */}
      <BudgetIntelligence projects={filteredProjects} />

      {/* Timeline Intelligence */}
      <TimelineIntelligence projects={filteredProjects} tasks={filteredTasks} />

      {/* Risk Overview */}
      <RiskOverview projects={filteredProjects} tasks={filteredTasks} />
    </div>
  );
}
