// Realistic demo data — no real personal information

export const DEMO_PROJECTS = [
  {
    id: 1,
    name: "Riverside Quarter – Apartment Renovation",
    client: "Meridian Real Estate Group",
    category: "Residential",
    status: "Active",
    startDate: "2026-02-01",
    deadline: "2026-06-30",
    responsible: "Sarah Mitchell",
    budget: 45000,
    actualCost: 38500,
    progress: 65,
    notes: "Full gut-refurbishment of 6 apartments. Structural works completed; fit-out in progress.",
  },
  {
    id: 2,
    name: "Highgate Portfolio Acquisition",
    client: "Apex Properties Ltd",
    category: "Acquisitions",
    status: "Planning",
    startDate: "2026-04-01",
    deadline: "2026-10-31",
    responsible: "James Thornton",
    budget: 120000,
    actualCost: 8200,
    progress: 10,
    notes: "Acquisition of 4 commercial units in Highgate. Board approval and finance sign-off pending.",
  },
  {
    id: 3,
    name: "Central Business Tower – Tenant Fit-Out",
    client: "Pinnacle Commercial Estates",
    category: "Commercial",
    status: "Active",
    startDate: "2026-01-15",
    deadline: "2026-05-15",
    responsible: "Emma Clarke",
    budget: 28000,
    actualCost: 31500,
    progress: 85,
    notes: "Grade-A office fit-out for new anchor tenant. Currently 12% over budget on MEP works.",
  },
  {
    id: 4,
    name: "Oakridge Estate – Planning Permission",
    client: "Hartwell Developments",
    category: "Residential",
    status: "Blocked",
    startDate: "2026-03-01",
    deadline: "2026-07-31",
    responsible: "Daniel Foster",
    budget: 55000,
    actualCost: 12000,
    progress: 22,
    notes: "Blocked — community consultation objections require revised design drawings before resubmission.",
  },
  {
    id: 5,
    name: "Lettings Management System Upgrade",
    client: "Internal – Property Management",
    category: "Property Management",
    status: "Active",
    startDate: "2026-02-15",
    deadline: "2026-06-15",
    responsible: "Laura Bennett",
    budget: 32000,
    actualCost: 27500,
    progress: 72,
    notes: "Migrating 1,200 tenancy records to new platform. Staff training sessions underway.",
  },
  {
    id: 6,
    name: "Luxury Waterfront Penthouse Launch",
    client: "BlueSky Residential Sales",
    category: "Sales & Marketing",
    status: "Planning",
    startDate: "2026-06-01",
    deadline: "2026-08-31",
    responsible: "Tom Whitfield",
    budget: 18000,
    actualCost: 0,
    progress: 0,
    notes: "Premium sales campaign for 3 top-floor units. Requires professional photography and CGI renders.",
  },
  {
    id: 7,
    name: "Maple Court – Residential Handover",
    client: "GreenLeaf Housing Association",
    category: "Residential",
    status: "Completed",
    startDate: "2025-11-01",
    deadline: "2026-02-28",
    responsible: "Sarah Mitchell",
    budget: 12000,
    actualCost: 11400,
    progress: 100,
    notes: "Handover of 14 affordable housing units completed on time and within budget.",
  },
  {
    id: 8,
    name: "Retail Unit Lease Renewal Programme",
    client: "Internal – Commercial Portfolio",
    category: "Commercial",
    status: "Active",
    startDate: "2026-03-15",
    deadline: "2026-05-31",
    responsible: "Emma Clarke",
    budget: 8000,
    actualCost: 9200,
    progress: 90,
    notes: "4 of 5 retail leases renewed. Final tenant negotiation in final stage.",
  },
];

export const DEMO_TASKS = [
  // Project 1 – Riverside Quarter Renovation
  { id: 1,  title: "Sign main contractor agreement",     projectId: 1, priority: "High",   status: "Done",        dueDate: "2026-02-15", responsible: "Sarah Mitchell", comment: "Contract signed and issued." },
  { id: 2,  title: "Oversee structural and shell works", projectId: 1, priority: "High",   status: "In Progress", dueDate: "2026-05-30", responsible: "James Thornton", comment: "Ground and first floor complete." },
  { id: 3,  title: "Interior fit-out and finishing",     projectId: 1, priority: "Medium", status: "Open",        dueDate: "2026-06-10", responsible: "Sarah Mitchell", comment: "" },

  // Project 2 – Highgate Acquisition
  { id: 4,  title: "Property market analysis & site visits", projectId: 2, priority: "High",   status: "Done",        dueDate: "2026-03-31", responsible: "James Thornton", comment: "6 sites reviewed, 4 shortlisted." },
  { id: 5,  title: "Legal due diligence & title search",     projectId: 2, priority: "High",   status: "In Progress", dueDate: "2026-05-30", responsible: "Laura Bennett",  comment: "" },
  { id: 6,  title: "Finance approval and board sign-off",    projectId: 2, priority: "Medium", status: "Open",        dueDate: "2026-07-01", responsible: "James Thornton", comment: "Pending board meeting in June." },

  // Project 3 – Central Business Tower Fit-Out
  { id: 7,  title: "Strip-out and structural demolition",    projectId: 3, priority: "High",   status: "Done",        dueDate: "2026-02-10", responsible: "Emma Clarke",   comment: "" },
  { id: 8,  title: "MEP and services installation",          projectId: 3, priority: "High",   status: "Done",        dueDate: "2026-03-01", responsible: "Emma Clarke",   comment: "Completed. Cost overrun flagged." },
  { id: 9,  title: "Partitioning and fit-out works",         projectId: 3, priority: "Medium", status: "In Progress", dueDate: "2026-04-30", responsible: "Daniel Foster", comment: "" },
  { id: 10, title: "Snagging inspection and handover",       projectId: 3, priority: "Low",    status: "Open",        dueDate: "2026-05-10", responsible: "Emma Clarke",   comment: "" },

  // Project 4 – Oakridge Planning
  { id: 11, title: "Revise planning drawings per objections",projectId: 4, priority: "High",   status: "In Progress", dueDate: "2026-04-15", responsible: "Daniel Foster", comment: "Architect instructed — delayed by consultation." },
  { id: 12, title: "Resubmit planning application",          projectId: 4, priority: "Medium", status: "Open",        dueDate: "2026-05-01", responsible: "Daniel Foster", comment: "" },

  // Project 5 – Lettings Management System
  { id: 13, title: "Migrate tenancy records to new platform",projectId: 5, priority: "High",   status: "Done",        dueDate: "2026-03-15", responsible: "Laura Bennett", comment: "1,200 records migrated successfully." },
  { id: 14, title: "Staff training – lettings team",         projectId: 5, priority: "High",   status: "In Progress", dueDate: "2026-05-25", responsible: "Tom Whitfield", comment: "8 of 12 sessions completed." },
  { id: 15, title: "Reporting dashboard configuration",      projectId: 5, priority: "Medium", status: "Open",        dueDate: "2026-06-05", responsible: "Laura Bennett", comment: "" },

  // Project 6 – Penthouse Launch
  { id: 16, title: "Define target buyer profile",            projectId: 6, priority: "High",   status: "Open",        dueDate: "2026-06-15", responsible: "Tom Whitfield", comment: "" },
  { id: 17, title: "Commission photography & CGI renders",   projectId: 6, priority: "High",   status: "Open",        dueDate: "2026-06-10", responsible: "Laura Bennett", comment: "Brief to be issued to agency." },

  // Project 7 – Maple Court Handover (Completed)
  { id: 18, title: "Final snagging inspection",              projectId: 7, priority: "High",   status: "Done",        dueDate: "2025-11-30", responsible: "Sarah Mitchell", comment: "" },
  { id: 19, title: "Defect remediation works",               projectId: 7, priority: "High",   status: "Done",        dueDate: "2026-01-31", responsible: "Sarah Mitchell", comment: "All defects cleared." },
  { id: 20, title: "Keys and documentation handover",        projectId: 7, priority: "Medium", status: "Done",        dueDate: "2026-02-28", responsible: "Sarah Mitchell", comment: "" },

  // Project 8 – Retail Lease Renewal
  { id: 21, title: "Review existing lease terms and breaks", projectId: 8, priority: "High",   status: "Done",        dueDate: "2026-03-25", responsible: "Emma Clarke",   comment: "" },
  { id: 22, title: "Negotiate renewals with tenants",        projectId: 8, priority: "High",   status: "In Progress", dueDate: "2026-04-30", responsible: "Emma Clarke",   comment: "4 of 5 leases agreed." },
  { id: 23, title: "Final sign-off and solicitor filing",    projectId: 8, priority: "Medium", status: "Open",        dueDate: "2026-05-20", responsible: "Daniel Foster", comment: "" },
];

export const DEMO_ACTIVITY = [
  { id: 1, datetime: "2026-05-11T09:15:00", message: "Project 'Riverside Quarter – Apartment Renovation' progress updated to 65%" },
  { id: 2, datetime: "2026-05-10T14:30:00", message: "Task 'Sign main contractor agreement' marked as Done" },
  { id: 3, datetime: "2026-05-09T11:00:00", message: "Project 'Central Business Tower – Tenant Fit-Out' flagged as over budget" },
  { id: 4, datetime: "2026-05-08T16:45:00", message: "Task 'Interior fit-out and finishing' created" },
  { id: 5, datetime: "2026-05-07T10:00:00", message: "Project 'Retail Unit Lease Renewal Programme' updated" },
  { id: 6, datetime: "2026-05-06T13:20:00", message: "Task 'Revise planning drawings per objections' status changed to In Progress" },
  { id: 7, datetime: "2026-05-05T09:00:00", message: "Project 'Maple Court – Residential Handover' marked as Completed" },
];
