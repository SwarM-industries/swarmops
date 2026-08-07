SHELL := /bin/bash

ORG := SwarM-industries

# Every repo is a sibling checkout under one workspace directory, and this Makefile lives
# inside the `swarmops` docs repo — so paths are anchored to the workspace root rather than
# to $(CURDIR). That way `make pull-all` behaves identically from the workspace root or from
# inside swarmops/. Override with WORKSPACE=/path/to/checkouts if your layout differs.
MAKEFILE_DIR := $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
WORKSPACE ?= $(if $(wildcard $(MAKEFILE_DIR)/swarmops/.git),$(MAKEFILE_DIR),$(abspath $(MAKEFILE_DIR)/..))

# The 15 app repos. `swarmops` (this repo — docs/plan/pitch site) is added separately in ALL.
REPOS := swarmops-frontend swarmops-gateway swarmops-auth-service swarmops-fleet-service \
         swarmops-mission-service swarmops-planning-service swarmops-telemetry-service \
         swarmops-notification-service swarmops-drone-simulator swarmops-unity-simulator \
         swarmops-local swarmops-deployments swarmops-infrastructure swarmops-contracts \
         swarmops-diag-test

# All 16 repos in the org, as directory names under $(WORKSPACE).
ALL := swarmops $(REPOS)

# The 9 repos with a `publish` job (build -> push ECR -> bump swarmops-deployments).
# Excludes swarmops-local/-deployments/-infrastructure/-contracts/-unity-simulator/-diag-test
# and this docs repo, none of which have that CI job.
SERVICE_REPOS := swarmops-auth-service swarmops-fleet-service swarmops-mission-service \
                 swarmops-planning-service swarmops-telemetry-service swarmops-notification-service \
                 swarmops-frontend swarmops-gateway swarmops-drone-simulator

.PHONY: help repos clone-missing status fetch-all pull-all push-all sync branch foreach trigger-publish check-publish

help:
	@echo "SwarmOps multi-repo automation (16 repos: swarmops + 15 app repos)"
	@echo "workspace: $(WORKSPACE)"
	@echo ""
	@echo "  make repos                 list every repo this Makefile manages"
	@echo "  make clone-missing         clone any org repo not present locally"
	@echo "  make status                git status --short across every repo (dirty only; VERBOSE=1 for all)"
	@echo "  make fetch-all             git fetch --all --prune in every repo"
	@echo "  make pull-all              git pull --ff-only in every repo (never merges/rebases silently)"
	@echo "  make push-all              push current branch in every repo (skips main — see below)"
	@echo "  make sync                  fetch-all + pull-all"
	@echo "  make branch REPO=<dir> NAME=<slug> [TYPE=feature|bugfix|hotfix]"
	@echo "                             create + checkout a feature/bugfix/hotfix branch in one repo"
	@echo "  make foreach CMD='git log -1 --oneline'"
	@echo "                             run an arbitrary shell command inside every repo"
	@echo ""
	@echo "push-all refuses to push a repo that's on main — per CLAUDE.md, nobody pushes main"
	@echo "directly. Override with FORCE_MAIN=1 make push-all if you really mean it."
	@echo ""
	@echo "  make trigger-publish MSG='...'    trivial commit + push to main on all 9 service repos,"
	@echo "                             to fire each one's publish (build/ECR/bump) CI job. Uses the"
	@echo "                             CLAUDE.md temporary direct-to-main override — skips any repo"
	@echo "                             not currently on main."
	@echo "  make trigger-publish REPO=<dir> MSG='...'"
	@echo "                             same, but only that one service repo"
	@echo "  make check-publish         latest publish-job run + conclusion for every service repo"

repos:
	@for n in $(ALL); do echo "$$n"; done

clone-missing:
	@for n in $(ALL); do \
		if [ ! -d "$(WORKSPACE)/$$n" ]; then \
			echo "== cloning $$n =="; \
			gh repo clone "$(ORG)/$$n" "$(WORKSPACE)/$$n" -- -q; \
		fi; \
	done

status:
	@for n in $(ALL); do \
		d="$(WORKSPACE)/$$n"; \
		if [ ! -d "$$d/.git" ]; then echo "== $$n — MISSING (make clone-missing) =="; continue; fi; \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		out=$$(git -C "$$d" status --short 2>&1); \
		if [ -n "$$out" ]; then \
			echo "== $$n ($$branch) — dirty =="; \
			echo "$$out"; \
		elif [ -n "$$VERBOSE" ]; then \
			echo "== $$n ($$branch) — clean =="; \
		fi; \
	done

fetch-all:
	@for n in $(ALL); do \
		d="$(WORKSPACE)/$$n"; \
		if [ ! -d "$$d/.git" ]; then echo "== fetch $$n — MISSING (make clone-missing) =="; continue; fi; \
		echo "== fetch $$n =="; \
		git -C "$$d" fetch --all --prune --quiet || echo "  FAILED: $$n"; \
	done

pull-all:
	@for n in $(ALL); do \
		d="$(WORKSPACE)/$$n"; \
		if [ ! -d "$$d/.git" ]; then echo "== pull $$n — MISSING (make clone-missing) =="; continue; fi; \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		echo "== pull $$n ($$branch) =="; \
		git -C "$$d" pull --ff-only || echo "  FAILED (diverged or dirty?): $$n"; \
	done

push-all:
	@for n in $(ALL); do \
		d="$(WORKSPACE)/$$n"; \
		if [ ! -d "$$d/.git" ]; then echo "== push $$n — MISSING (make clone-missing) =="; continue; fi; \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		if [ "$$branch" = "main" ] && [ -z "$$FORCE_MAIN" ]; then \
			echo "== skip $$n — on main, use a PR instead (FORCE_MAIN=1 to override) =="; \
			continue; \
		fi; \
		echo "== push $$n ($$branch) =="; \
		git -C "$$d" push -u origin "$$branch" || echo "  FAILED: $$n"; \
	done

sync: fetch-all pull-all

branch:
	@if [ -z "$(REPO)" ] || [ -z "$(NAME)" ]; then \
		echo "usage: make branch REPO=<repo-dir> NAME=<slug> [TYPE=feature|bugfix|hotfix]"; \
		exit 1; \
	fi; \
	t="$(TYPE)"; \
	if [ -z "$$t" ]; then t=feature; fi; \
	git -C "$(WORKSPACE)/$(REPO)" checkout -b "$$t/$(NAME)"

foreach:
	@if [ -z "$(CMD)" ]; then \
		echo "usage: make foreach CMD='git log -1 --oneline'"; \
		exit 1; \
	fi; \
	for n in $(ALL); do \
		d="$(WORKSPACE)/$$n"; \
		if [ ! -d "$$d" ]; then echo "== $$n — MISSING (make clone-missing) =="; continue; fi; \
		echo "== $$n =="; \
		(cd "$$d" && eval "$(CMD)") || echo "  FAILED: $$n"; \
	done

trigger-publish:
	@if [ -z "$$MSG" ]; then \
		echo "usage: make trigger-publish MSG='reason for triggering CI' [REPO=<service-dir>]"; \
		exit 1; \
	fi; \
	if [ -n "$(REPO)" ]; then \
		case " $(SERVICE_REPOS) " in \
			*" $(REPO) "*) targets="$(REPO)" ;; \
			*) echo "error: REPO='$(REPO)' is not one of SERVICE_REPOS (refusing — e.g. swarmops-deployments must never be pushed to directly, see CLAUDE.md)"; exit 1 ;; \
		esac; \
	else \
		targets="$(SERVICE_REPOS)"; \
	fi; \
	for n in $$targets; do \
		d="$(WORKSPACE)/$$n"; \
		echo "== trigger $$n =="; \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		if [ "$$branch" != "main" ]; then \
			echo "  SKIP: $$n not on main ($$branch)"; \
			continue; \
		fi; \
		if [ -n "$$(git -C "$$d" status --porcelain)" ]; then \
			echo "  SKIP: $$n has local changes — refusing to risk sweeping them into main"; \
			continue; \
		fi; \
		git -C "$$d" pull --ff-only || { echo "  FAILED pull: $$n"; continue; }; \
		marker="<!-- ci-trigger: $$(date -u +%Y-%m-%dT%H:%M:%SZ) -->"; \
		if grep -q '^<!-- ci-trigger:' "$$d/README.md" 2>/dev/null; then \
			sed -i.bak "s|^<!-- ci-trigger:.*-->|$$marker|" "$$d/README.md" && rm -f "$$d/README.md.bak"; \
		else \
			printf '\n%s\n' "$$marker" >> "$$d/README.md"; \
		fi; \
		git -C "$$d" add README.md; \
		printf '%s' "$$MSG" | git -C "$$d" commit -F - --quiet -- README.md || { echo "  nothing to commit: $$n"; continue; }; \
		git -C "$$d" push || echo "  FAILED push: $$n"; \
	done

check-publish:
	@for n in $(SERVICE_REPOS); do \
		echo "== $$n =="; \
		gh run list --repo $(ORG)/$$n --branch main --limit 1 \
			--json displayTitle,status,conclusion,createdAt \
			--jq '.[0] | "  \(.createdAt)  \(.status)/\(.conclusion // "-")  \(.displayTitle)"' \
			|| echo "  FAILED: $$n"; \
	done
