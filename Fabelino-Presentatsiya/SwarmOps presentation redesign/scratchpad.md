# SwarmOps — Apple-keynote redesign

15 min · 3 speakers: Guy (opens, problem/idea/demo) → Tony (cloud + deployment) → Harel (monitoring, security, closes).
Audience: industry + mixed + instructors. All English. Real cluster numbers. One big Apple-style recap wall before Thank You.

## TODO later (user request)
- Write the spoken SCRIPT for all 3 speakers (not yet — user will ask). data-speaker-notes currently hold cues only.
- Guy's opening field story: raw material not provided yet; slide 2 is the backdrop for it.

## Title sequence (short noun phrases)
01 Title — SwarmOps
02 From the Field (full-bleed photo, Guy's story backdrop)
03 The Team
04 The Problem
05 The Cost of Manual Control (+15% stat)
06 The Idea
07 What Goes Into a Plan (5 constraints → 1 plan)
08 Replanning in Flight
09 Live Demo (map)
10 § The Cloud — Tony
11 Six Services
12 The Cloud Footprint (account → region → VPC → 2 AZ)
13 The Network (IGW→ALB→private, NAT ×1)
14 Inside the Cluster (EKS: 5 spot nodes, pods)
15 By the Numbers (stat wall)
16 From Commit to Cluster (GitOps pipeline)
17 GitOps in Production (Argo CD shot)
18 Zero-Downtime Releases (blue-green pods)
19 Canary Rollouts (steps crop + native ladder)
20 A Rollout, Start to Finish (two shots)
21 Cost Engineering ($250→$140→$43, white slide)
22 § Operations — Harel
23 Monitoring (Grafana)
24 What We Measure (3 crops)
25 Security
26 Recap wall (Apple section-summary block)
27 Thank You

## System
Black #000 base; white #f5f5f7 slides for data moments (constraints, demo map, cost).
Text #f5f5f7 / gray #86868b; accent #ff5f3c; gradient headline words #ffb340→#ff5f3c→#ff375f.
Font: system SF stack. Kicker 26px caps accent · title 84px/700 · lede 36px gray · stat 130px gradient · captions ≥24px.
Animations: [data-deck-active]-gated keyframes (dIn/dZoom/dPop/dBar) with .d1–.d8 stagger; reduced-motion safe.
Diagrams: pure HTML chips/bars (no SVG) for direct editability.
