# AI Node Implementation Context

This document serves as a record of the architecture, implementation details, and debugging context for the **AI Node** feature added to the Fuzzie3 automation builder.

## Overview
The goal was to introduce a custom "AI Node" into the React Flow workflow builder that can dynamically generate text and process images using Google's Gemini models, seamlessly passing the AI's output to downstream nodes (like Slack or Notion).

## 1. Database Layer
- **Schema Update:** Added an `aiTemplate` column (String, optional) to the `Workflows` table in `prisma/schema.prisma`. 
- **Purpose:** Securely stores the user's custom prompt for the AI node.

## 2. Frontend / React Flow UI
- **Custom Node:** Integrated an AI node into the workflow builder.
- **Node Settings (`content-based-on-title.tsx`):**
  - Displays a "Prompt" input field when the AI node is selected.
  - Developed a **smart autocomplete popover**. When a user types `{{`, it detects the node type and suggests available variables (e.g., `Drive.fileContent`, `Drive.fileName`).
  - Clicking a suggestion dynamically inserts it into the prompt.
- **Save Action (`workflow-connections.tsx`):**
  - Updated the `onCreateNodeTemplate` action to persist the Prompt text into the database's `aiTemplate` column when the user clicks "Save Template".

## 3. Backend Execution Engine (`route.ts`)
The execution engine (Google Drive webhook processor) underwent significant upgrades:

### Memory Context & File Handling
- Created a `workflowMemory` object to carry state across nodes during execution.
- Added intelligent file handling to detect if an uploaded Google Drive file is an image (`mimeType.startsWith('image/')`).
- Images are automatically downloaded as an `arraybuffer` and converted into a `Base64` string. Texts are downloaded normally.

### Gemini API Integration
- Integrated the `@google/generative-ai` SDK.
- **Model Used:** Upgraded to `gemini-2.5-flash` (Older 1.5 models were returning 404 deprecation errors).
- **Prompt Sanitization Bug Fix:** Originally, if a user used `{{Drive.fileContent}}` on an image file, the massive Base64 string was injected directly into the text prompt, triggering a `429 Too Many Requests` (Quota Exceeded) error due to massive token consumption. 
  - *Fix applied:* If the file is an image, the prompt variable is replaced with `[Attached Image]`, and the actual Base64 string is passed safely to Gemini as `inlineData`.

### Array Splicing Bug Fix
- **The Issue:** A fatal bug existed in the original tutorial's execution loop. When a node (like AI) finished executing, it removed itself from the `flowPath` array using `splice()`. However, the loop still incremented the `current` index counter, causing the engine to skip the immediate next node (e.g., Slack).
- **The Fix:** Added a `continue` statement immediately after every `flowPath.splice()` to reset the loop execution without incrementing the index improperly.

## 4. Known Issues & Future Improvements
### Webhook Duplication & Timeouts
- Google Drive webhooks require a rapid `200 OK` response. 
- If the workflow execution (especially waiting for Gemini to process large images) takes too long, Google Drive assumes the webhook failed and automatically fires 3 retry webhooks.
- **Symptoms:** Multiple simultaneous LLM requests and multiple Slack messages per file. 
- **Current Mitigation:** Removed the 5-second `AbortController` from the Gemini API call to allow local testing to complete without artificial constraints.
- **Recommended Production Fix:** Implement an asynchronous background queue (like Inngest or Upstash QStash). The API route should instantly return `200 OK` to Google Drive upon receiving the payload and offload the actual workflow execution to the background queue.
