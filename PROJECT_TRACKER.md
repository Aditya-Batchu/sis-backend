# RGUKT SIS (Student Information System) - Project Tracker & Roadmap

> **System Overview**: 6-Year Integrated B.Tech (2-Year PUC + 4-Year B.Tech) Student Information System for RGUKT (AP - Nuzvid, RK Valley, Ongole, Srikakulam).
> **Tech Stack**: 100% Free MERN (MongoDB + Express.js + React Vite + Node.js) with Tailwind CSS, AG-Grid Community, Redux Toolkit, Lucide Icons.
> **Architecture Principle**: Multi-campus tenant isolation via `campusId`, partial unique indexes, soft deletes, bulk operations, and minimal/clean diffs (Lazy Developer rules).
>
> [!IMPORTANT]
> **Synchronization Rule**: This tracker is mirrored across `./PROJECT_TRACKER.md`, `backend/PROJECT_TRACKER.md`, and `frontend/PROJECT_TRACKER.md`. Whenever code updates occur, all three copies must be updated and kept strictly identical.

---

## 📊 Global Project Phase Roadmap

| Phase | Module | Status | Description |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **System Setup & Master Data** | 🟢 **Block 1 Completed** | Campuses (Done), Programs, Batches, Departments, Academic Terms, and Reservation Categories. |
| **Phase 2** | **Admissions & Student Management** | ⚪ Pending | SSC merit lists, reservation quotas, campus allocation, student profile & permanent ID generation. |
| **Phase 3** | **PUC Academics & Remedials** | ⚪ Pending | MPC/MBiPC streams, course registration, attendance bucket aggregation, remedials tracking. |
| **Phase 4** | **B.Tech Branch Allocation** | ⚪ Pending | PUC CGPA merit ranking, category quotas, branch counseling & allocation engine. |
| **Phase 5** | **B.Tech Academics & Electives** | ⚪ Pending | Branch departments, curriculum, mandatory electives, minors (e.g. Quantum Computing), labs. |
| **Phase 6** | **Examination & Grading System** | ⚪ Pending | Mid 1/2/3 (best 2 of 3 = 30) + 10 internals + 60 end sem = 100 marks, Grade points (Ex, A, B, C, D, F). |
| **Phase 7** | **Portals & Role-Based Access** | ⚪ Pending | Super Admin, Campus Admin, HOD, Faculty, Student, and Examination Cell portals. |

---

## 🏗️ Phase 1: System Setup - Detailed Block Breakdown

```
Phase 1: System Setup
├── Block 1: Campus Management (✅ Completed & Ready for Testing)
│   ├── Backend: Campus Model, Controller, Routes, Soft Delete, Seed Script
│   └── Frontend: AG-Grid Campus Table, Add/Edit Modal, View Side Drawer, Redux & Axios Service
├── Block 2: Batch Management & Stage-Adaptive Student Roster (🔥 Next Up)
│   ├── Architecture: Multi-Campus Tenant Isolation (Role-based access: SKLM Admin sees only SKLM batches)
│   ├── Backend: Batch Model (campusId, name, startYear, endYear, currentStage [PUC1/2, E1/2/3/4], pucSectionCount, activeBranches)
│   ├── Frontend:
│   │   ├── Top-Level Batch Management Table (Nav Placement above/alongside Dashboard, Campus-Filtered)
│   │   └── Dynamic Batch Drill-Down View (/batches/:batchId):
│   │       ├── Case A (PUC Stage): Dynamic Section Tabs (All, Sec 1 to Sec 7 flexible) -> Section Student Roster
│   │       └── Case B (B.Tech Stage): Engineering Branch Tabs (All, CSE, ECE, EEE, MECH, CIVIL, MME, CHEM) -> Branch Student Roster
├── Block 3: Departments & Engineering Branches
│   ├── Backend: Department/Branch Models with Campus mapping (PUC Sciences, CSE, ECE, EEE, MECH, CIVIL, MME)
│   └── Frontend: AG-Grid Department/Branch Management UI
└── Block 4: Academic Terms, Semesters & Reservation Categories
    ├── Backend: Semester/Term Configuration, Reservation Matrix (OC, EWS, BC-A/B/C/D/E, SC, ST, Sports, PH, AU/SVU)
    └── Frontend: Academic Calendar & Reservation Quota Settings UI
```

---

## 📝 Phase 1 Block 1: Campus Management Specification

### Backend Specs
- **Model**: `Campus` (`name`, `code` [NUZ, RKV, ONG, SKL], `location`, `district`, `region` [AU, SVU], `contactEmail`, `contactPhone`, `status` [Active, Inactive], `isDeleted`, timestamps).
- **Index**: Unique index on `code` and `name` where `isDeleted: false`.
- **API Endpoints**:
  - `POST /api/v1/system-setup/campuses` - Create campus
  - `GET /api/v1/system-setup/campuses` - List all active campuses (with search & filter)
  - `GET /api/v1/system-setup/campuses/:id` - Get campus details
  - `PUT /api/v1/system-setup/campuses/:id` - Update campus details
  - `DELETE /api/v1/system-setup/campuses/:id` - Soft delete campus
- **Validations**: Express-validator / Joi schema validation for campus codes and required fields.

### Frontend Specs
- **UI Component**: `CampusManagement.jsx`
- **Grid**: `AG-Grid Community` (React wrapper) with custom status badge cell renderer, action buttons (View, Edit, Delete), column filters, and sorting.
- **Modals**:
  - `CampusFormModal.jsx` (Add & Edit modes)
  - `CampusDetailsModal.jsx` (Quick preview)
  - `ConfirmDeleteModal.jsx` (Soft-delete confirmation)
- **State**: Redux Toolkit `campusSlice.js` + Axios service `campusService.js`.

---

## 📝 Phase 1 Block 2: Batch Management & Adaptive Roster Specification

### 1. Role-Based Multi-Campus Isolation
- **Campus Admin Access**: When an admin (e.g. Srikakulam SKLM Admin) logs in, all Batch queries are automatically filtered by `campusId: sklmCampusId`. Admins cannot access or view other campuses' data.
- **Super Admin Access**: Super Admin can view all campus batches or switch between campuses using a Global Campus Switcher dropdown.

### 2. Batch Master Data Model
- **Model**: `Batch`
  - `campusId`: Reference to `Campus` (ObjectId, indexed).
  - `name`: String (e.g., `2024-2030 Batch (PUC-1)`).
  - `startYear`: Number (e.g., `2024`).
  - `endYear`: Number (e.g., `2030`).
  - `currentStage`: Enum (`PUC-1`, `PUC-2`, `E1`, `E2`, `E3`, `E4`, `Graduated`).
  - `pucSectionCount`: Number (Default: 7, flexible configuration for PUC sections).
  - `activeBranches`: Array of Branch codes (e.g., `['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MME', 'CHEM']`).
  - `totalStrength`: Number (e.g., 1000).
  - `status`: Enum (`Active`, `Archived`).
  - `isDeleted`: Boolean (Soft delete).

### 3. Frontend UX & Stage-Adaptive Views
- **Top Navigation Link**: Prominent **Batch Management** menu item placed right alongside the main dashboard navigation.
- **Batch Management Table**: AG-Grid table showing all campus batches with year, stage badge (PUC vs B.Tech), strength, and "View Roster / Drill Down" action.
- **Stage-Adaptive Batch View Component (`BatchDetailsPage.jsx`)**:
  - 🏫 **When Batch is in PUC (PUC-1 / PUC-2)**:
    - Renders **Section Tabs**: `[All Students] | [Section 1] | [Section 2] | [Section 3] | [Section 4] | [Section 5] | [Section 6] | [Section 7] ...`
    - Displays students assigned to that section.
  - ⚙️ **When Batch is in B.Tech (E1, E2, E3, E4)**:
    - Renders **Branch Tabs**: `[All Branches] | [CSE] | [ECE] | [EEE] | [MECH] | [CIVIL] | [MME] | [CHEM]`
    - Displays students allocated to that engineering branch (Branch counseling results, CGPA, category).

---

## 📈 Change Log & Progress Updates

- **[2026-10-06]**: Project initialized.
- **[2026-10-06]**: `AGENTS.md` and `lazy-developer` skill configured.
- **[2026-10-06]**: Created `PROJECT_TRACKER.md` with complete Phase 1 breakdown.
- **[2026-10-08]**: Updated Block 2 roadmap with Role-Based Multi-Campus Isolation and Stage-Adaptive Section (PUC) vs Branch (B.Tech) tab views.
- **[2026-11-09]**: Campus `updateCampus` and `deleteCampus` left as homework stubs (request lookup only, with step comments). `getCampuses`, `getCampusStats`, `getCampusById`, and `createCampus` stay implemented.
