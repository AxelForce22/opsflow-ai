// Realistic demo data — no real personal information

export const DEMO_PROJECTS = [
  {
    id: 1,
    name: "City Center Office Onboarding",
    client: "Meridian Real Estate Group",
    category: "Real Estate",
    status: "Active",
    startDate: "2026-02-01",
    deadline: "2026-06-30",
    responsible: "Sarah Mitchell",
    budget: 45000,
    actualCost: 38500,
    progress: 65,
    notes: "New tenant fit-out and onboarding for 3rd floor unit.",
  },
  {
    id: 2,
    name: "Portfolio Expansion – North District",
    client: "Apex Properties Ltd",
    category: "Real Estate",
    status: "Planning",
    startDate: "2026-04-01",
    deadline: "2026-10-31",
    responsible: "James Thornton",
    budget: 120000,
    actualCost: 8200,
    progress: 10,
    notes: "Acquisition of 4 commercial units. Board approval pending.",
  },
  {
    id: 3,
    name: "Warehouse Process Improvement",
    client: "LogiCore Supply Co.",
    category: "Operations",
    status: "Active",
    startDate: "2026-01-15",
    deadline: "2026-05-15",
    responsible: "Emma Clarke",
    budget: 28000,
    actualCost: 31500,
    progress: 85,
    notes: "Lean methodology rollout. Currently 12% over budget.",
  },
  {
    id: 4,
    name: "Supply Chain Optimisation",
    client: "NordTrack Logistics",
    category: "Operations",
    status: "Blocked",
    startDate: "2026-03-01",
    deadline: "2026-07-31",
    responsible: "Daniel Foster",
    budget: 55000,
    actualCost: 12000,
    progress: 22,
    notes: "Blocked — vendor contract approval delayed by legal review.",
  },
  {
    id: 5,
    name: "CRM System Implementation",
    client: "BrightSales Europe",
    category: "Sales Operations",
    status: "Active",
    startDate: "2026-02-15",
    deadline: "2026-06-15",
    responsible: "Laura Bennett",
    budget: 32000,
    actualCost: 27500,
    progress: 72,
    notes: "Salesforce rollout. User training sessions in progress.",
  },
  {
    id: 6,
    name: "Q3 Sales Campaign Automation",
    client: "VantagePoint Marketing",
    category: "Sales Operations",
    status: "Planning",
    startDate: "2026-06-01",
    deadline: "2026-08-31",
    responsible: "Tom Whitfield",
    budget: 18000,
    actualCost: 0,
    progress: 0,
    notes: "Requires CRM data cleanup before launch.",
  },
  {
    id: 7,
    name: "Vendor Qualification Process",
    client: "Internal – Procurement",
    category: "Vendor Management",
    status: "Completed",
    startDate: "2025-11-01",
    deadline: "2026-02-28",
    responsible: "Sarah Mitchell",
    budget: 12000,
    actualCost: 11400,
    progress: 100,
    notes: "Approved vendor list published to all departments.",
  },
  {
    id: 8,
    name: "Supplier Contract Renewal",
    client: "Internal – Operations",
    category: "Vendor Management",
    status: "Active",
    startDate: "2026-03-15",
    deadline: "2026-05-31",
    responsible: "Emma Clarke",
    budget: 8000,
    actualCost: 9200,
    progress: 90,
    notes: "4 of 5 contracts renewed. Final supplier negotiation this week.",
  },
];

export const DEMO_TASKS = [
  // Project 1 – City Center Office Onboarding
  { id: 1,  title: "Sign lease agreement",          projectId: 1, priority: "High",   status: "Done",        dueDate: "2026-02-15", responsible: "Sarah Mitchell", comment: "Signed and filed." },
  { id: 2,  title: "Coordinate fit-out contractors", projectId: 1, priority: "High",   status: "In Progress", dueDate: "2026-05-30", responsible: "James Thornton", comment: "2 of 3 contractors confirmed." },
  { id: 3,  title: "IT setup and network install",   projectId: 1, priority: "Medium", status: "Open",        dueDate: "2026-06-10", responsible: "Sarah Mitchell", comment: "" },

  // Project 2 – Portfolio Expansion
  { id: 4,  title: "Market research and site visits", projectId: 2, priority: "High",   status: "Done",        dueDate: "2026-03-31", responsible: "James Thornton", comment: "5 sites reviewed." },
  { id: 5,  title: "Legal due diligence",             projectId: 2, priority: "High",   status: "In Progress", dueDate: "2026-05-30", responsible: "Laura Bennett",  comment: "" },
  { id: 6,  title: "Finance and board approval",      projectId: 2, priority: "Medium", status: "Open",        dueDate: "2026-07-01", responsible: "James Thornton", comment: "Pending board meeting." },

  // Project 3 – Warehouse Improvement
  { id: 7,  title: "Current state process mapping",   projectId: 3, priority: "High",   status: "Done",        dueDate: "2026-02-10", responsible: "Emma Clarke",   comment: "" },
  { id: 8,  title: "Identify waste and bottlenecks",  projectId: 3, priority: "High",   status: "Done",        dueDate: "2026-03-01", responsible: "Emma Clarke",   comment: "Report submitted." },
  { id: 9,  title: "Implement new picking process",   projectId: 3, priority: "Medium", status: "In Progress", dueDate: "2026-04-30", responsible: "Daniel Foster", comment: "" },
  { id: 10, title: "Staff training sessions",         projectId: 3, priority: "Low",    status: "Open",        dueDate: "2026-05-10", responsible: "Emma Clarke",   comment: "" },

  // Project 4 – Supply Chain
  { id: 11, title: "Vendor contract review",          projectId: 4, priority: "High",   status: "In Progress", dueDate: "2026-04-15", responsible: "Daniel Foster", comment: "Legal review ongoing — delayed." },
  { id: 12, title: "Supplier performance analysis",   projectId: 4, priority: "Medium", status: "Open",        dueDate: "2026-05-01", responsible: "Daniel Foster", comment: "" },

  // Project 5 – CRM Implementation
  { id: 13, title: "Data migration from legacy CRM",  projectId: 5, priority: "High",   status: "Done",        dueDate: "2026-03-15", responsible: "Laura Bennett", comment: "45,000 records migrated." },
  { id: 14, title: "User training – sales team",      projectId: 5, priority: "High",   status: "In Progress", dueDate: "2026-05-25", responsible: "Tom Whitfield", comment: "8 of 12 sessions completed." },
  { id: 15, title: "Dashboard and reporting setup",   projectId: 5, priority: "Medium", status: "Open",        dueDate: "2026-06-05", responsible: "Laura Bennett", comment: "" },

  // Project 6 – Q3 Sales Campaign
  { id: 16, title: "Define campaign targets",         projectId: 6, priority: "High",   status: "Open",        dueDate: "2026-06-15", responsible: "Tom Whitfield", comment: "" },
  { id: 17, title: "CRM data cleanup",                projectId: 6, priority: "High",   status: "Open",        dueDate: "2026-06-10", responsible: "Laura Bennett", comment: "Prerequisite for campaign launch." },

  // Project 7 – Vendor Qualification (Completed)
  { id: 18, title: "Draft qualification criteria",    projectId: 7, priority: "High",   status: "Done",        dueDate: "2025-11-30", responsible: "Sarah Mitchell", comment: "" },
  { id: 19, title: "Vendor interviews and scoring",   projectId: 7, priority: "High",   status: "Done",        dueDate: "2026-01-31", responsible: "Sarah Mitchell", comment: "12 vendors assessed." },
  { id: 20, title: "Publish approved vendor list",    projectId: 7, priority: "Medium", status: "Done",        dueDate: "2026-02-28", responsible: "Sarah Mitchell", comment: "" },

  // Project 8 – Supplier Contract Renewal
  { id: 21, title: "Review existing contract terms",  projectId: 8, priority: "High",   status: "Done",        dueDate: "2026-03-25", responsible: "Emma Clarke",   comment: "" },
  { id: 22, title: "Negotiate renewals with suppliers",projectId: 8, priority: "High",   status: "In Progress", dueDate: "2026-04-30", responsible: "Emma Clarke",   comment: "4 of 5 completed." },
  { id: 23, title: "Final sign-off and filing",       projectId: 8, priority: "Medium", status: "Open",        dueDate: "2026-05-20", responsible: "Daniel Foster", comment: "" },
];

export const DEMO_ACTIVITY = [
  { id: 1, datetime: "2026-05-11T09:15:00", message: "Project 'City Center Office Onboarding' created" },
  { id: 2, datetime: "2026-05-10T14:30:00", message: "Task 'Sign lease agreement' marked as Done" },
  { id: 3, datetime: "2026-05-09T11:00:00", message: "Project 'Warehouse Process Improvement' updated" },
  { id: 4, datetime: "2026-05-08T16:45:00", message: "Task 'IT setup and network install' created" },
  { id: 5, datetime: "2026-05-07T10:00:00", message: "Project 'Supplier Contract Renewal' created" },
  { id: 6, datetime: "2026-05-06T13:20:00", message: "Task 'Vendor contract review' status changed to In Progress" },
  { id: 7, datetime: "2026-05-05T09:00:00", message: "Project 'Vendor Qualification Process' marked as Completed" },
];
