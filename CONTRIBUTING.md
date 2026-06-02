# Contributing to WarisanAI

Thank you for your interest in contributing to WarisanAI! 🙏

WarisanAI is an open-source platform and template for preserving family archives. We welcome contributions from everyone — whether it's bug fixes, new features, documentation improvements, or new ideas.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Labels](#issue-labels)
- [Security Vulnerabilities](#security-vulnerabilities)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

### Prerequisites

- **Node.js** 22 or newer
- **npm** 10 or newer
- **PostgreSQL** (local or serverless like [Neon](https://neon.tech))
- **Git**

### Development Setup

1. **Fork** this repository to your own GitHub account.

2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/WarisanAI.git
   cd WarisanAI
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Setup environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database and authentication configuration
   ```

5. **Setup database:**

   ```bash
   npx prisma generate
   npx prisma migrate reset --force
   npm run db:seed
   ```

6. **Run the development server:**

   ```bash
   npm run dev
   ```

   The frontend will run at `http://127.0.0.1:5173` and the backend at port 8080.

## How to Contribute

### Reporting Bugs

- Use [GitHub Issues](https://github.com/adityaimamz/WarisanAI/issues) to report bugs.
- Apply the `bug` label to the issue.
- Include clear steps to reproduce, expected behavior, and actual behavior.
- Attach screenshots or error logs if possible.

### Suggesting Features

- Open a new issue with the `enhancement` label.
- Explain the use case and the proposed solution.
- Discuss with the maintainers in the issue before starting implementation.

### Submitting Changes

1. Create a new branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-name
   ```

2. Make your changes and commit them with descriptive messages:

   ```bash
   git commit -m "feat: add PDF export for timelines"
   git commit -m "fix: resolve upload timeout for large images"
   git commit -m "docs: update deployment guidelines"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):

   | Prefix   | Used For                         |
   | -------- | -------------------------------- |
   | `feat`   | A new feature                    |
   | `fix`    | A bug fix                        |
   | `docs`   | Documentation changes            |
   | `style`  | Code style (formatting, etc.)    |
   | `refactor` | Code refactoring               |
   | `test`   | Adding or fixing tests           |
   | `chore`  | Build or tool adjustments        |

3. Push to your fork:

   ```bash
   git push origin feat/your-feature-name
   ```

4. Open a **Pull Request** to the `main` branch of the main repository.

## Pull Request Process

1. Ensure your code passes all checks:

   ```bash
   npx prisma validate
   npm run build
   npm run test:run
   ```

2. Fill out the PR template clearly — explain **what** changed and **why**.
3. Link to any related issues (use `Closes #123`).
4. Keep PRs focused on a single change.
5. Address any requested changes from reviewers.

## Coding Standards

### TypeScript

- Use strict mode in TypeScript.
- Avoid using `any` — use specific types/interfaces.
- Export types and interfaces for API boundaries.

### React (Frontend)

- Use functional components with hooks.
- Use Framer Motion for UI animations.
- Style components using Tailwind CSS classes.
- Place reusable components under `src/components/`.

### Express (Backend)

- Store route handlers in `server/routes/`.
- Use existing authorization middleware (`requireSpaceMembership`, `requireSpaceRole`).
- Validate inputs at every API endpoint.
- Use Prisma for all database queries.

### Prisma (Database)

- All schema changes must go through migrations (`npx prisma migrate dev`).
- Do not manually edit existing migration files.
- Update seed data if you add new models.

### Testing

- Write tests for new logic using Vitest.
- Use property-based testing with fast-check for edge cases.
- Use Supertest for API integration tests.

## Issue Labels

We recommend using the following labels for GitHub Issues. Maintainers can create these via the GitHub UI or CLI:

| Label             | Color     | Description                                         |
| ----------------- | --------- | --------------------------------------------------- |
| `good first issue`| `#7057ff` | Simple tasks, ideal for new contributors            |
| `help wanted`     | `#008672` | Tasks where help from the community is needed       |
| `bug`             | `#d73a4a` | Bug reports that need to be resolved                |
| `enhancement`     | `#a2eeef` | New feature requests                                |
| `security`        | `#e11d48` | Issues related to security vulnerabilities          |
| `docs`            | `#0075ca` | Documentation updates or improvements                |
| `ai`              | `#f9a825` | Related to AI features (biography, timeline, etc.)   |
| `ui/ux`           | `#d876e3` | Tweak to the user interface or layout               |
| `performance`     | `#fbca04` | Performance optimizations                           |
| `question`        | `#d876e3` | General questions                                   |

To create these via the GitHub CLI:

```bash
gh label create "good first issue" --color "7057ff" --description "Simple tasks, ideal for new contributors"
gh label create "help wanted" --color "008672" --description "Tasks where help from the community is needed"
gh label create "security" --color "e11d48" --description "Issues related to security vulnerabilities"
gh label create "docs" --color "0075ca" --description "Documentation updates or improvements"
gh label create "ai" --color "f9a825" --description "Related to AI features"
gh label create "ui/ux" --color "d876e3" --description "Tweak to the user interface or layout"
gh label create "performance" --color "fbca04" --description "Performance optimizations"
```

## Security Vulnerabilities

⚠️ **Do not** report security vulnerabilities via public issues.

If you discover a security vulnerability, please report it privately:

1. [GitHub Security Advisories](https://github.com/adityaimamz/WarisanAI/security/advisories/new) (recommended)
2. Or email the repository maintainers.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will respond within 48 hours and work with you to fix the issue before public disclosure.

## Thank You! 🎉

Every contribution makes WarisanAI better for all families looking to preserve their heritage. Thank you for being a part of the community!
