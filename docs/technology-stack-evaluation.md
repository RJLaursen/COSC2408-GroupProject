# Technology Stack & AI Platform Evaluation

**Developer:** Aryan Mehra  

## Purpose

The goal of this research was to look at a few realistic ways we could build the nursing simulation and decide what direction would make the most sense for an initial prototype.

The main things considered were:

- Browser and mobile support
- AI conversation with Sandra
- Control over the scenario and branching
- Cost
- Difficulty to build and deploy
- How manageable the project would be for the team

## Options Considered

### 1. React / Next.js with an AI API

This would be a normal web application, with an AI service such as OpenAI or Gemini handling Sandra's responses.

**Advantages**
- Works well in browsers and on mobile
- Gives us a lot of control over the interface and scenario logic
- Can be deployed as a normal website
- Should be possible to keep the codebase fairly small

**Disadvantages**
- React and Next.js are new to some of the team
- Things like voice would need to be added separately

**Overall:** Probably the best option for the first prototype.

### 2. React with Convai

Convai is designed more specifically around AI characters and supports things like text and voice interaction.

**Advantages**
- Made for conversational characters
- Voice support is already available
- Could make the simulation more immersive later

**Disadvantages**
- Another platform for the team to learn
- Free usage is limited
- Might be more complicated than what we actually need

**Overall:** A possible option, especially if voice becomes more important.

### 3. Web Frontend with Python Backend

Another option would be to use a web frontend with a separate Python backend for the AI and scenario logic.

**Advantages**
- Python is more familiar to some of the team
- Easy to work with AI APIs in Python

**Disadvantages**
- We would still need to build the web frontend
- Two separate parts would need to be connected and deployed
- Probably creates more work without much benefit for this project

**Overall:** Possible, but likely more complicated than necessary.

## Current Direction

At the moment, a simple browser-based application using React/Next.js and an external AI API seems like the most practical direction.

This should give us enough control over the conversation and scenario while still being relatively simple to deploy and use on desktop or mobile.

The exact AI provider does not need to be decided yet.

The first prototype would mainly focus on:

- Student text input
- Sandra responding naturally
- Detecting agreement or refusal
- Moving through the escalation stages
- Showing the correct outcome

Things such as Sandra character images, a hospital background and voice could be added later once the main simulation works.

## Main Risks

Some risks identified during the research were:

- The development team is not particularly experienced with React/Next.js
- AI responses may sometimes be inconsistent
- AI services may have costs or usage limits
- Adding too many extra features could make the project much larger than necessary

For the first prototype, the main priority should be getting the conversation and scenario flow working before adding more advanced features.