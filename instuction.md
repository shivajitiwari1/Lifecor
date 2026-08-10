# Lifecor Demo Platform - AI Development Instructions

## Project Overview

Build an investor-ready, visually stunning demo platform for Lifecor, a modern life insurance startup.

This is NOT a full insurance carrier system.

The goal is to create a premium interactive product demonstration that showcases how Lifecor makes life insurance faster, simpler, and more accessible for both:

1. Direct-to-Consumer (DTC)
2. Distribution Partners (Agents, Brokers, Advisors)

The platform should feel like a real SaaS product while using mock data and simulated workflows.

Success Metric:

A potential investor, insurance carrier, broker, or partner should understand the value proposition within 3 minutes of using the demo.

---

# Product Vision

Traditional life insurance is:

* Slow
* Paper-heavy
* Confusing
* Requires multiple handoffs

Lifecor is:

* Fast
* Digital-first
* Modern
* Frictionless
* Intelligent

The demo should visually communicate:

"Get insured in minutes, not weeks."

---

# Primary Goal

Create a highly polished clickable prototype that demonstrates:

* Customer onboarding
* Eligibility assessment
* Instant quote generation
* Simplified application process
* Policy recommendation
* Distribution workflow
* Partner dashboard experience

This is a storytelling product.

Focus on experience over technical complexity.

---

# Target Audience

## Investors

Need to understand:

* Market opportunity
* Product vision
* User experience
* Scalability potential

## Distribution Partners

Need to understand:

* Simplicity
* Conversion improvement
* Faster sales cycle

## Insurance Professionals

Need to understand:

* Workflow efficiency
* Digital transformation

---

# Tech Stack

Frontend:

* Next.js 15+
* React 19+
* TypeScript
* Tailwind CSS
* Shadcn UI

Animation:

* Framer Motion

Charts:

* Recharts

Icons:

* Lucide React

Forms:

* React Hook Form
* Zod

State Management:

* Zustand

Theme:

* Dark + Light mode

Deployment:

* Vercel

---

# Design Requirements

Design Inspiration:

* Stripe
* Ramp
* Mercury
* Linear
* Vercel
* Modern fintech startups

Avoid:

* Corporate insurance websites
* Outdated enterprise UI
* Bootstrap appearance

Must feel:

* Premium
* Modern
* Elegant
* Investor-grade

---

# Global UX Principles

Every page must have:

* Smooth transitions
* Skeleton loaders
* Micro interactions
* Animated progress indicators
* Professional typography
* Mobile responsiveness

Target Lighthouse Score:

90+

---

# Demo Structure

## Landing Page

Hero Section:

Headline:

Life Insurance Built For The Modern World

Subheadline:

Get covered in minutes with a digital-first experience designed for consumers and distribution partners.

CTA Buttons:

* Start Demo
* Partner Experience

Sections:

* Problem
* Solution
* How It Works
* Demo Preview
* Key Benefits
* Partner Benefits
* Contact

---

# DTC Demo Flow

## Step 1

Welcome Screen

Fields:

* Name
* Age
* State

Animated Continue Button

---

## Step 2

Lifestyle Assessment

Questions:

* Smoker?
* Existing conditions?
* Annual income?
* Dependents?

Show dynamic progress.

---

## Step 3

Eligibility Engine

Mock AI analysis.

Show:

Analyzing Profile...

Animated loading sequence.

Then display:

Eligible

Risk Tier

Coverage Range

Confidence Score

---

## Step 4

Instant Quotes

Show 3 plans:

Basic

Plus

Premium

Include:

* Monthly premium
* Coverage amount
* Benefits

Beautiful pricing cards.

---

## Step 5

Policy Recommendation

AI-generated recommendation.

Example:

Based on your profile, Premium Protection provides the best balance of affordability and coverage.

---

## Step 6

Application Summary

Show:

* Applicant details
* Coverage
* Monthly premium

Submit Application

---

## Step 7

Approval Screen

Large success animation.

Message:

You're Approved

Next steps timeline.

---

# Distribution Demo

## Dashboard

Metrics:

* Leads
* Conversion Rate
* Applications
* Policies Issued

Use animated charts.

---

## Lead Pipeline

Stages:

* New
* Contacted
* In Review
* Approved

Drag-and-drop experience.

---

## Client Management

List of mock clients.

Client detail page:

* Profile
* Status
* Policy
* Notes

---

## Quote Generator

Create quote using:

* Age
* State
* Income

Generate realistic mock results.

---

## Partner Analytics

Charts:

* Monthly policies
* Conversion trends
* Revenue estimates

---

# Admin Demo

Purpose:

Show future scalability.

Sections:

* Dashboard
* Policy Management
* User Management
* Reporting

Use mock data.

No backend required.

---

# AI Features (Simulated)

Create believable AI experiences:

* Risk Assessment
* Policy Recommendation
* Eligibility Scoring
* Smart Underwriting

All powered by mocked responses.

Must appear realistic.

---

# Demo Data

Generate realistic sample data:

* Customers
* Policies
* Quotes
* Agents
* Applications

Store as JSON files.

No database required initially.

---

# Visual Effects

Use:

* Framer Motion page transitions
* Animated charts
* Hover effects
* Progress animations
* Success celebrations

Do not overuse animations.

Everything should feel premium.

---

# Folder Structure

/app

/components

/features

/mock-data

/lib

/hooks

/types

/public

---

# Code Quality

Requirements:

* TypeScript strict mode
* Reusable components
* Clean architecture
* Modular design
* Production-quality code

---

# Deliverables

1. Investor-ready demo platform
2. Mobile responsive design
3. DTC experience
4. Distribution experience
5. Admin showcase
6. Mock AI workflows
7. Professional landing page
8. Vercel deployment readiness

---

# Important Rule

Whenever there is a tradeoff between:

A) Backend complexity

and

B) Better visual storytelling

Always choose visual storytelling.

The objective is to sell the vision of Lifecor, not build a complete insurance carrier platform.
