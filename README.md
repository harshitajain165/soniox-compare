# Soniox Compare

Welcome to Soniox Compare, a comprehensive platform for evaluating real-time speech-to-text (STT) services. This project highlights the performance of Soniox by enabling side-by-side comparisons with other providers. We provide full source code for transparency, allowing users to independently test and verify the results. The tool features a robust backend and an intuitive frontend, designed to display and compare outputs from multiple selected providers simultaneously.

You can try it out at https://soniox.com/compare/

You can compare the outputs of the following providers:
- [Soniox](https://soniox.com/)
- [Google](https://cloud.google.com/speech-to-text)
- [Azure](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview)
- [OpenAI](https://platform.openai.com/docs/api-reference/realtime-sessions/create-transcription)
- [Deepgram](https://www.deepgram.com/)
- [Speechmatics](https://www.speechmatics.com/)
- [AssemblyAI](https://www.assemblyai.com/)
- [Cartesia](https://cartesia.ai/)
- [ElevenLabs](https://elevenlabs.io/)

## Running the Project

### 1. Configure environment variables

Copy the example file and fill in the API keys for the providers you want to use:

```bash
cp .env.example .env
# then edit .env and set your keys
```

Required variables (see `config.py`):

| Variable | Provider |
| --- | --- |
| `SONIOX_API_KEY` | Soniox |
| `OPENAI_API_KEY` | OpenAI |
| `DEEPGRAM_API_KEY` | Deepgram |
| `ASSEMBLY_API_KEY` | AssemblyAI |
| `SPEECHMATICS_API_KEY` | Speechmatics |
| `AZURE_API_KEY`, `AZURE_REGION` | Azure |
| `CARTESIA_API_KEY` | Cartesia |
| `ELEVENLABS_API_KEY` | ElevenLabs |

Google uses a service-account key, provided either way:
- `GOOGLE_CREDENTIALS_JSON` — the full service-account JSON as a single env var value (recommended for deployment).
- `./credentials-google.json` — a JSON key file in the project root (fallback, convenient for local dev).

Keys are only required for the providers you actually compare; a missing key surfaces as a `500` on that provider's endpoint, not a startup failure.

### 2. Frontend (React/Vite - `frontend/` directory)

The backend serves the compiled frontend from `frontend/dist`, so **the frontend must be built before the backend will start** (otherwise it raises `RuntimeError: Directory 'frontend/dist' does not exist`).

```bash
# Ensure Node.js and yarn are installed
cd frontend
# Install dependencies:
yarn install
# Build for the backend to serve (creates frontend/dist):
yarn build
# Or run the hot-reload dev server instead:
yarn dev
# Dev server runs on: http://localhost:5173/compare/ui/ (proxies to backend)
```

### 3. Backend (FastAPI - Project Root)

```bash
# Install dependencies:
uv sync
# Run the backend server:
uv run fastapi dev
# Backend runs on: http://127.0.0.1:8000
```

## Core Settings & Configuration

**Backend (Project Root):**

*   **Provider Implementations**: `providers/<provider_name>/provider.py`
    *   Each provider (e.g., `soniox`, `google`) has its own subdirectory in `providers/`.
*   **Provider Configuration**: `config.py` (see `get_provider_config` function).
    *   Loads API keys and settings primarily from environment variables.
    *   Google provider reads credentials from `GOOGLE_CREDENTIALS_JSON`, falling back to a `credentials-google.json` file in the root directory.
*   **Main Application Logic**: `main.py` (FastAPI routes, WebSocket handling for `/compare/api/compare-websocket`).
*   **Environment Variables**: Create a `.env` file in the project root to store API keys (e.g., `SONIOX_API_KEY`, `AZURE_API_KEY`, etc.). This is loaded by `load_dotenv()` in `main.py` and `config.py`.

**Frontend (`frontend/` directory):**

*   **Core Logic & State**: `src/contexts/comparison-context.tsx`
    *   Manages WebSocket connection, audio processing, and application state.
*   **Mock Data Toggle**: `USE_MOCK_DATA` constant in `src/contexts/comparison-context.tsx`.
*   **UI Components**: `src/components/`
*   **API Proxy (Vite)**: `vite.config.ts` (proxies `/compare` calls to backend at `http://127.0.0.1:8000`).
*   **Provider UI Names/Features**: `src/lib/provider-features.ts`.
*   **Comparison UI Settings (Dropdowns, etc.)**: `src/lib/comparison-constants.ts`.