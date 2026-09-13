# Sprint 2 Prototype Development Plan

**Developer:** Aryan Mehra

## Purpose

This document outlines the initial development approach for the clinical simulation before prototype implementation begins in Sprint 2.

The goal is to give development a clear starting point and keep the first prototype simple enough to build and test within the sprint.

## Sprint 2 Development Direction

Based on the current Sprint 2 plan, development will roughly progress through three stages:

1. Set up the Next.js and React application foundation
2. Add the main AI conversation and scenario branching
3. Integrate and test the core simulation

The first priority will be getting a basic browser application running before adding more advanced features.

## Development Setup

The prototype will use Next.js and React.

The initial development setup will include:

- Node.js and a package manager
- Next.js / React project
- Existing team GitHub repository
- Local development environment
- Environment variables for API keys

Next.js can handle both the user interface and the small server-side API routes needed for the prototype, so a separate backend should not be required initially.

API keys should be stored in environment variables rather than directly inside the application code or committed to GitHub.

## Relevant Concepts Reviewed

Before implementation, the main React/Next.js concepts relevant to the prototype were reviewed:

- React components for separating parts of the interface
- State for storing the current conversation and scenario stage
- Form/input handling for student responses
- Next.js routing and project structure
- Server-side API routes for communicating with an AI service
- Environment variables for API configuration

The aim is to only use the parts of React/Next.js that are needed for the prototype rather than adding unnecessary complexity.

## Main Prototype Areas

The first prototype will likely need:

- Main simulation screen
- Sandra dialogue/history
- Student text input
- Scenario state and branching
- AI API connection
- Outcome screens
- Basic UX styling

The existing BA requirements and UX designs will be used as the main reference during implementation.

## Scenario and AI Approach

The application should keep track of the current stage of the scenario rather than allowing the AI to completely control the simulation.

The main states are expected to include the opening interaction, the three escalation stages, agreement/refusal outcomes and a stop/distress state.

The AI service will mainly be used to understand the student's response and produce Sandra's dialogue. A server-side route in the application can handle communication with whichever AI provider is selected.

The exact AI service will be tested during prototype development.

## Development Order

The planned implementation order is:

1. Create and configure the Next.js project
2. Set up the main simulation screen
3. Add dialogue display and student input
4. Implement the scenario states and branching
5. Connect and test an AI service
6. Add the outcome states
7. Apply the UX designs
8. Test the complete scenario flow

## Open Questions / Risks

Some areas will still need to be tested during development:

- Which AI service is most suitable for Sandra's dialogue
- How reliably different student responses can be classified
- Whether the planned scenario-state approach needs to change during implementation
- How much time is available for optional features such as voice

The main priority for Sprint 2 is to get the text-based conversation and scenario flow working reliably before adding optional features.