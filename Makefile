SHELL := /bin/bash

ORG := SwarM-industries
REPOS := swarmops-frontend swarmops-gateway swarmops-auth-service swarmops-fleet-service \
         swarmops-mission-service swarmops-planning-service swarmops-telemetry-service \
         swarmops-notification-service swarmops-drone-simulator swarmops-local \
         swarmops-deployments swarmops-infrastructure swarmops-contracts

# "." is this repo (swarmops — docs/plan/pitch site), included in every all-repo operation.
ALL := . $(REPOS)

# The 9 repos with a `publish` job (build -> push ECR -> bump swarmops-deployments).
# Excludes swarmops-local/-deployments/-infrastructure/-contracts and this docs repo,
# none of which have that CI job.
SERVICE_REPOS := swarmops-auth-service swarmops-fleet-service swarmops-mission-service \
                 swarmops-planning-service swarmops-telemetry-service swarmops-notification-service \
                 swarmops-frontend swarmops-gateway swarmops-drone-simulator

.PHONY: help repos clone-missing status fetch-all pull-all push-all sync branch foreach trigger-publish check-publish

help:
	@echo "SwarmOps multi-repo automation (14 repos: swarmops + 13 app repos)"
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
	@for d in $(ALL); do echo "$$d"; done

clone-missing:
	@for r in $(REPOS); do \
		if [ ! -d "$$r" ]; then \
			echo "== cloning $$r =="; \
			gh repo clone "$(ORG)/$$r" "$$r" -- -q; \
		fi; \
	done

status:
	@for d in $(ALL); do \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		out=$$(git -C "$$d" status --short 2>&1); \
		if [ -n "$$out" ]; then \
			echo "== $$d ($$branch) — dirty =="; \
			echo "$$out"; \
		elif [ -n "$$VERBOSE" ]; then \
			echo "== $$d ($$branch) — clean =="; \
		fi; \
	done

fetch-all:
	@for d in $(ALL); do \
		echo "== fetch $$d =="; \
		git -C "$$d" fetch --all --prune --quiet || echo "  FAILED: $$d"; \
	done

pull-all:
	@for d in $(ALL); do \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		echo "== pull $$d ($$branch) =="; \
		git -C "$$d" pull --ff-only || echo "  FAILED (diverged or dirty?): $$d"; \
	done

push-all:
	@for d in $(ALL); do \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		if [ "$$branch" = "main" ] && [ -z "$$FORCE_MAIN" ]; then \
			echo "== skip $$d — on main, use a PR instead (FORCE_MAIN=1 to override) =="; \
			continue; \
		fi; \
		echo "== push $$d ($$branch) =="; \
		git -C "$$d" push -u origin "$$branch" || echo "  FAILED: $$d"; \
	done

sync: fetch-all pull-all

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
	for d in $$targets; do \
		echo "== trigger $$d =="; \
		branch=$$(git -C "$$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
		if [ "$$branch" != "main" ]; then \
			echo "  SKIP: $$d not on main ($$branch)"; \
			continue; \
		fi; \
		if [ -n "$$(git -C "$$d" status --porcelain)" ]; then \
			echo "  SKIP: $$d has local changes — refusing to risk sweeping them into main"; \
			continue; \
		fi; \
		git -C "$$d" pull --ff-only || { echo "  FAILED pull: $$d"; continue; }; \
		marker="<!-- ci-trigger: $$(date -u +%Y-%m-%dT%H:%M:%SZ) -->"; \
		if grep -q '^<!-- ci-trigger:' "$$d/README.md" 2>/dev/null; then \
			sed -i.bak "s|^<!-- ci-trigger:.*-->|$$marker|" "$$d/README.md" && rm -f "$$d/README.md.bak"; \
		else \
			printf '\n%s\n' "$$marker" >> "$$d/README.md"; \
		fi; \
		git -C "$$d" add README.md; \
		printf '%s' "$$MSG" | git -C "$$d" commit -F - --quiet -- README.md || { echo "  nothing to commit: $$d"; continue; }; \
		git -C "$$d" push || echo "  FAILED push: $$d"; \
	done

check-publish:
	@for d in $(SERVICE_REPOS); do \
		echo "== $$d =="; \
		gh run list --repo $(ORG)/$$d --branch main --limit 1 \
			--json displayTitle,status,conclusion,createdAt \
			--jq '.[0] | "  \(.createdAt)  \(.status)/\(.conclusion // "-")  \(.displayTitle)"' \
			|| echo "  FAILED: $$d"; \
	done

branch:
	@if [ -z "$(REPO)" ] || [ -z "$(NAME)" ]; then \
		echo "usage: make branch REPO=<repo-dir> NAME=<slug> [TYPE=feature|bugfix|hotfix]"; \
		exit 1; \
	fi; \
	t="$(TYPE)"; \
	if [ -z "$$t" ]; then t=feature; fi; \
	git -C "$(REPO)" checkout -b "$$t/$(NAME)"

foreach:
	@if [ -z "$(CMD)" ]; then \
		echo "usage: make foreach CMD='git log -1 --oneline'"; \
		exit 1; \
	fi; \
	for d in $(ALL); do \
		echo "== $$d =="; \
		(cd "$$d" && eval "$(CMD)") || echo "  FAILED: $$d"; \
	done
