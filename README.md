# Brownie

Brownie is an AI-powered intelligent image design studio with exceptional artistic vision and technical mastery. This project aims to create beautiful, purposeful visual designs by understanding user requests.

## Project Overview

Brownie serves as an AI Image Agent, providing the following core capabilities:

- **High-Quality Image Generation**: Generate high-quality images from text descriptions
- **Intelligent Image Editing**: Make smart edits to images based on user commands
- **Multi-Turn Conversation Support**: Support complex multi-turn interactions with contextual understanding
- **Tool Integration**: Integrated with professional image processing tools like `qwenImageEditTool` and `seedream3Tool`
- ... ...

## Agent Architecture Design

### 1. From Actor to State Machine

This project adopts the Actor architecture pattern to build an AI Agent system, using state machines as the implementation mechanism for Actor coordination:

**Why Agents Fit the Actor Architecture**:
AI Agents naturally possess characteristics of multi-task concurrency and asynchronous processing, making the Actor pattern a perfect fit for these requirements:
- Each Actor encapsulates specific AI capabilities (such as query generation, web search, result reflection)
- Actors communicate through message passing, avoiding the complexity of shared state
- Supports concurrent execution of multiple AI tasks, improving overall processing efficiency
- Strong fault tolerance - failure of a single Actor doesn't affect the entire system

**State Machines as Implementation Mechanism**:
State machines are an effective tool for coordinating collaboration between multiple Actors:
- Define clear workflow state transition logic
- Manage the timing of message passing between Actors
- Maintain global context and intermediate results
- Ensure predictability and controllability of complex AI processes

This architectural design makes complex AI research workflows structured and maintainable.

### 2. Implementation on Trigger.dev

The project is built on the [Trigger.dev](https://trigger.dev) platform, leveraging its powerful task scheduling and execution capabilities.

### 3. Communication Protocol

The project uses standardized message formats from the [AI SDK](https://sdk.vercel.ai/) for communication:

**Message Types**:
- `ModelMessage`: For standardized message passing between models
- `UIMessageChunk`: For streaming UI update message blocks

This standardized protocol ensures:
- Compatibility across different AI models
- Consistency in streaming responses
- Accurate context maintenance
