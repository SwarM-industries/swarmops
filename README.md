<div align="center">

<img src="https://placehold.co/900x200/0d1117/ffffff?text=SwarmOps&font=montserrat" alt="SwarmOps" />

# 🛰 swarmops

### The documentation repository: what the platform is, why it is built this way, who owns what, and where it currently stands.

![Docs](https://img.shields.io/badge/Type-Documentation-6E56CF?style=for-the-badge)
![Make](https://img.shields.io/badge/Multi--repo-Makefile-427819?style=for-the-badge&logo=gnubash&logoColor=white)
![React](https://img.shields.io/badge/Pitch%20site-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Not deployed](https://img.shields.io/badge/Deployed-No-lightgrey?style=for-the-badge)
![Visibility](https://img.shields.io/badge/Repository-Private-red?style=for-the-badge)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [The Documents](#-the-documents)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Security](#-security)
- [Related Repositories](#-related-repositories)
- [License](#-license)

---

## 🧭 Overview

`swarmops` is the documentation repository for the SwarmOps platform. **It is not part of the
running application and nothing here is deployed.**

SwarmOps is a drone fleet mission planning and route optimization platform. Given a fleet of
drones with limited battery, speed and payload capacity, and a set of missions with priorities and
deadlines, it assigns drones to missions, computes battery-feasible routes, and re-plans in real
time as conditions change. It is a distributed system built to demonstrate that idea properly: the
optimization algorithm and the delivery pipeline are the substance, not a CRUD application with a
map on top.

The platform spans fourteen repositories. This one holds the parts that belong to all of them and
to none of them individually:

- **The product requirements**, which are the source of truth for data models, API surface and
  success criteria.
- **The build plan and milestones**, including who owns which track.
- **The shared engineering guide**, so every contributor works from the same mental model.
- **Multi-repo automation**, so fourteen checkouts can be managed as one workspace.
- **A pitch site and business material**, which are separate tracks from the product itself.

If this repository and the requirements document ever disagree about the product, the requirements
document wins.

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Documentation | Markdown | n/a |
| Multi-repo automation | GNU Make, `git`, GitHub CLI | n/a |
| Pitch site | React + Vite + Tailwind CSS | React 19, Vite 8 |
| Architecture diagram | draw.io | n/a |
| Business documents | Markdown sources rendered to PDF | n/a |
| Deployed | nothing, deliberately | n/a |

---

## ✨ Key Features

- **One source of truth for the data model**: entity shapes, field names and status enums are
  defined once here, and services are expected to match them exactly rather than improvise.
- **Explicit ownership**: the plan records which track each contributor owns, so work does not
  collide and nobody builds into someone else's area by accident.
- **Locked technical decisions**: language, framework, database, message bus and delivery choices
  are written down with their rationale, so they are not relitigated mid-build.
- **A deployment contract**: how code reaches the cluster is fixed and documented, because the
  entire point of the project is that nobody deploys by hand.
- **Phase sequencing**: work is ordered because later phases assume earlier contracts are stable,
  and the plan says so explicitly rather than leaving it to be discovered.
- **Multi-repo automation**: clone, status, fetch, pull, push and arbitrary commands across every
  repository in the workspace from one directory.
- **A live milestone log**: the current state of the build, updated as work lands, so nobody has
  to re-derive it from fourteen commit histories.
- **A definition of done**, so "finished" means the same thing to everyone.
- **A pitch site**: a static React site presenting the concept to non-technical audiences, kept
  clearly separate from the product.
- **Business material as generated output**: overviews and one-pagers are Markdown sources
  rendered to PDF, so the PDFs are never edited directly.

---

## 📋 The Documents

### Start here

| Document | What it is |
|----------|-----------|
| `SwarmOps_PRD.md` | **The source of truth.** Requirements, personas, data models, API surface, success metrics. |
| `plan.md` | Ownership tracks, phase-by-phase build plan, locked technical decisions with rationale. |
| `milestones.md` | The live task list and current milestone. Updated as work lands. |
| `REPOS.md` | One paragraph on every repository, precisely what each one is. |
| `CLAUDE.md` | The shared engineering guide: system shape, conventions, working agreements. |

### Reference

| Document | What it is |
|----------|-----------|
| `SERVICES.md` | Per-service reference |
| `DEFINITION_OF_DONE.md` | What "done" means before something is called finished |
| `architecture.drawio` | The system architecture diagram source |
| `resources.md` | External references and background reading |
| `budget.md` | Cost planning |
| `actual_prod.md` | The plan for real-hardware integration |
| `UNITY_SIMULATOR_PLAN.md` | The simulator integration plan, staged |
| `M10-addons.md`, `lastday_addons.md` | Scoped additions tracked separately from the main plan |

### Presentation and business tracks

| Directory | What it is |
|-----------|-----------|
| `site/` | A static React pitch-deck site. **Not the application.** |
| `business/` | Business overviews, one-pagers and use cases, in two languages, with their generated PDFs |
| `presentation-assets/` | Imagery, screenshots and video used in presentations |
| `Fabelino-Presentatsiya/` | A presentation deck variant |
| `PITCH_DESIGN.md`, `PRESENTATION_PLAN.md`, `TALK_TRACK_GUY.md` | Presentation planning and delivery notes |

Two things about `business/` catch people out, and both are documented in its own render
directory: **every PDF is generated output**, so edit the source and re-render rather than
touching the PDF; and the one-pagers are independently hand-authored with no shared template, so a
copy change means editing each one by hand.

The `site/` directory deserves the same warning as `business/`: it is a pitch artefact, not the
product. Its live-map component is a useful visual reference for the real console's map, but
changes to the actual product do not belong there, and vice versa.

---

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [GNU Make](https://www.gnu.org/software/make/) (Git Bash on Windows works)
- [GitHub CLI](https://cli.github.com/), authenticated, for cloning and CI status
- [Node.js 20+](https://nodejs.org/) if you intend to run the pitch site

### Setting up the full workspace

1. **Clone this repository**

   ```bash
   git clone <your-org-remote>/swarmops.git
   cd swarmops
   ```

2. **Clone every other repository as a sibling**

   ```bash
   make clone-missing
   ```

   This produces the sibling layout the rest of the platform assumes, in particular the Compose
   stack, which builds services from relative paths.

3. **Check where everything stands**

   ```bash
   make status
   ```

<details>
<summary>🧰 <b>Troubleshooting</b></summary>

- **Every repository reports as missing**: the workspace root was resolved incorrectly. Two layouts
  are supported: this repository checked out *as* the workspace root with siblings beside it, or
  nested one level down inside a separate workspace directory. Override the workspace path
  explicitly if your layout differs from both.
- **`make pull-all` fails on a repository**: it has diverged or has uncommitted changes. Pulls are
  fast-forward only, deliberately, so nothing is merged or rebased silently on your behalf.
- **`make push-all` skipped a repository**: it is on the main branch, and pushing straight to main
  is not the normal path. That skip is intentional.
- **A `gh` command fails**: the GitHub CLI is not authenticated, or lacks access. These
  repositories are private.
- **The pitch site will not build**: it has its own dependencies and its own lockfile. Install
  inside `site/`, not at the repository root.
- **A business PDF does not match its Markdown**: the PDF is generated output and was not
  re-rendered. Never edit a PDF directly; re-render it from its source.

</details>

---

## 💡 Usage

### Multi-repo automation

Run from this repository's directory.

| Command | What it does |
|---------|--------------|
| `make help` | List every target and show the resolved workspace path |
| `make repos` | List every repository managed here |
| `make clone-missing` | Clone any repository not present locally |
| `make status` | `git status --short` across every repository, dirty ones only |
| `make fetch-all` | Fetch and prune everywhere |
| `make pull-all` | Fast-forward-only pull everywhere, never a silent merge or rebase |
| `make push-all` | Push the current branch everywhere, skipping any repository on main |
| `make sync` | Fetch, then pull |
| `make branch REPO=<dir> NAME=<slug> [TYPE=feature\|bugfix\|hotfix]` | Create and check out a branch in one repository |
| `make foreach CMD='...'` | Run an arbitrary command inside every repository |
| `make check-publish` | Latest publish pipeline result for every service repository |

Three safety properties worth knowing about:

- **Pulls are fast-forward only.** Nothing is ever merged or rebased on your behalf.
- **`push-all` refuses to push a repository on its main branch** unless explicitly overridden,
  because pushing straight to main is not the normal path.
- **Automation that triggers pipelines refuses to touch a repository with uncommitted changes**,
  so local work is never swept into a commit as a side effect.

### Running the pitch site

```bash
cd site
npm install
npm run dev
```

Remember what it is: a presentation artefact, not the product.

### Working with the business documents

Read `business/_render/README.md` first. It documents which source produces which PDF, the exact
render commands, how to verify a render, and the editing rules that keep the documents' claims
aligned with what is actually built.

---

## 🏗 Architecture

### The system this repository documents

```text
                    Frontend (React SPA)
                            │  HTTPS / WebSocket
                            ▼
       Gateway (NGINX)  ── the only externally reachable component
                            │
   ┌────────┬───────────────┼───────────────┬────────────────┬──────────────┐
   ▼        ▼               ▼               ▼                ▼              ▼
  auth    fleet         mission         planning         telemetry    notification
 (JWT)   (drones,     (missions)      (optimizer)       (ingests      (alerts,
          zones,                           ▲             events)       stateless)
          stations)                        │                │
                                           └── RabbitMQ ────┘
                                                  ▲
                                                  │
                                        drone simulator
                                     (flies the fleet, emits telemetry)
```

- **The planning service is the core.** It solves a vehicle-routing problem where battery range,
  not a fixed vehicle capacity, is the binding constraint, and that range depends on distance
  flown and payload weight.
- **Telemetry, the simulator and the message bus exist to make re-planning event-driven** rather
  than polled. The simulator is a fake fleet, not a mock: it behaves the way a real fleet would so
  that re-planning has something genuine to react to.
- **The notification service is intentionally stateless.** It is a fan-out, not a datastore.

### Folder Structure

```text
swarmops/
├── 📄 SwarmOps_PRD.md               # Source of truth: requirements, data models, API surface
├── 📄 plan.md                       # Ownership, phases, locked technical decisions
├── 📄 milestones.md                 # Live task list and current state
├── 📄 REPOS.md                      # What every repository is
├── 📄 CLAUDE.md                     # Shared engineering guide and working agreements
├── 📄 SERVICES.md                   # Per-service reference
├── 📄 DEFINITION_OF_DONE.md
├── 📄 actual_prod.md                # Real-hardware integration plan
├── 📄 UNITY_SIMULATOR_PLAN.md       # Simulator integration, staged
├── 📄 architecture.drawio           # Architecture diagram source
├── 📄 budget.md / resources.md
├── 📄 Makefile                      # Multi-repo automation for the whole workspace
├── 📁 site/                         # Static React pitch site (NOT the application)
│   └── 📁 src/
│       ├── 📁 components/           #   ↳ includes a live-map reference implementation
│       ├── 📁 hooks/
│       └── 📁 lib/
├── 📁 business/                     # Overviews and one-pagers, two languages
│   ├── 📄 *.md                      #   ↳ sources, edit these
│   ├── 📄 *.pdf                     #   ↳ GENERATED OUTPUT, never edit directly
│   └── 📁 _render/                  #   ↳ render process and rules, read before editing
├── 📁 presentation-assets/          # Imagery, screenshots, video
└── 📁 Fabelino-Presentatsiya/       # Presentation deck variant
```

### How the documents relate

```text
                    SwarmOps_PRD.md
              (source of truth: what, and what shape)
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
          plan.md                   CLAUDE.md
     (who, in what order)      (how we work, shared model)
              │                         │
              ▼                         │
        milestones.md                   │
     (where we actually are)            │
              │                         │
              └────────────┬────────────┘
                           ▼
                  the fourteen repositories
                  (each with its own STATUS.md)
```

When they disagree: the requirements document wins over everything, and a repository's own
`STATUS.md` is the authority on that repository's current state.

---

## 🔒 Security

- **Private repository.** It contains the platform's full design, its commercial material and its
  delivery process. Do not publish excerpts, diagrams, screenshots or documents outside the team.
- **No secrets in Git.** Nothing here should contain a credential, a token, a webhook URL, an
  account identifier, a role ARN, or a domain. Those belong in a secret manager, referenced by
  name.
- **Business and commercial material is confidential**, and often more sensitive than the code.
  Treat market analysis, financial figures and roadmap material as need-to-know, and remember that
  a generated PDF travels far more easily than a source file.
- **Presentation assets can leak more than intended.** Screenshots and recordings of a live console
  contain real operational data: fleet positions, endpoints, hostnames and identifiers. Review
  them before they go into a deck, and again before that deck leaves the team.
- **The pitch site is a public-facing artefact if it is ever hosted.** Anything in it becomes
  public the moment it is deployed, so nothing internal belongs there: no infrastructure details,
  no real operational data, no internal hostnames.
- **The automation here acts across every repository.** Targets that commit and push, or that
  trigger pipelines, do real work in fourteen places at once. Read what a target does before
  running it, and note that the guards which skip dirty or main-branch repositories are safety
  features, not obstacles.
- **Documentation ages into a security problem.** A runbook with a stale account identifier or an
  old credential path is both wrong and a disclosure. Review documents when the thing they describe
  changes.
- **Keep placeholders in written procedures.** A runbook should show the shape of a command, not a
  live account identifier or domain, so that copying a snippet into a ticket or a message does not
  leak an environment.

---

## 🔗 Related Repositories

SwarmOps is a polyrepo: each repository is one deployable unit with its own history, branches and
CI pipeline. All of them are private. `REPOS.md` describes each one precisely.

| Repository | What it is |
|------------|-----------|
| `swarmops` | Documentation, product requirements, build plan, pitch site |
| `swarmops-frontend` | React + Vite operations console |
| `swarmops-gateway` | NGINX edge, the only externally reachable entrypoint |
| `swarmops-auth-service` | Identity, JWT issuance, roles |
| `swarmops-fleet-service` | Drone inventory, no-fly zones, charging stations |
| `swarmops-mission-service` | Mission definitions and lifecycle |
| `swarmops-planning-service` | Optimization core: assignment, routing, re-planning |
| `swarmops-telemetry-service` | Telemetry ingestion, event fan-out, camera relay |
| `swarmops-notification-service` | Stateless alert fan-out to the UI |
| `swarmops-drone-simulator` | Headless worker that flies the fleet |
| `swarmops-contracts` | Shared data-model and event contracts |
| `swarmops-local` | Docker Compose stack and cross-service integration tests |
| `swarmops-deployments` | Helm chart, Argo CD config, observability config |
| `swarmops-infrastructure` | Terraform: VPC, EKS, ECR, IAM |

> 📌 **`milestones.md` is the live state of the build.** Every other repository keeps its own
> `STATUS.md` for repository-level detail.

---

## 📄 License

Proprietary and confidential. © SwarmOps. All rights reserved.
Internal use only, not licensed for redistribution.

---

<div align="center">

**Made with ☕ and the belief that the decision is worth writing down before the code is.**

Built with 💻 by the **SwarmOps** team.

</div>
