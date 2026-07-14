# Soniox Compare — Speech-to-Speech Translation

Real-time speech translation comparison. Speak (mic or file) and see the original transcript next to the live translation for each provider; in speech-to-speech mode, hear the translation played back through your speakers.

**Part of [Soniox Compare](../README.md)** — see the root README for install, `./dev.sh`, ports, the streaming architecture, and the cross-app conventions (provider contract, `PROVIDER_MAP`, event builders, adding a provider, the `/compare/api` prefix, security headers). This file only covers what is specific to the `translate` app.

## Providers

Five runnable providers in `PROVIDER_MAP` (`main.py`), plus four declared greyed-out in `providers/unsupported.py`. Model IDs are the wire values from `config.py` / each provider module.

| Provider     | Key            | Model(s)                          | `s2s`? |
| ------------ | -------------- | --------------------------------- | ------ |
| Soniox       | `soniox`       | `stt-rt-v5` + `tts-rt-v1`         | Yes |
| OpenAI       | `openai`       | `gpt-realtime-translate`          | Yes |
| Gemini       | `gemini`       | `gemini-3.5-live-translate-preview` | Yes |
| Speechmatics | `speechmatics` | `enhanced`                        | No (no TTS) |
| Azure        | `azure`        | `azure-speech-translation`        | Partial (only targets with a configured neural voice) |

**Greyed-out (can never run — no real-time translation upstream):** `deepgram` (`nova-3`), `assembly` (Universal-3.5 Pro), `cartesia` (`ink-2`), `elevenlabs` (Scribe v2 Realtime). Declared in `providers/unsupported.py` with the reason shown on hover; `compare_websocket` rejects them via the `PROVIDER_MAP` lookup.

## Endpoints

All under `/compare/api` except the operational `/.well-known/…` slugs.

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `WS`  | `/compare/api/compare-websocket` | Live session. Query: `providers[]`, `mode` (`text`/`s2s`), `target_language`, `voice`, `language_hints[]`, `enable_speaker_diarization`, `enable_language_identification`, `enable_endpoint_detection` |
| `GET` | `/compare/api/providers-features` | Per-provider capability matrix (includes the greyed-out `unsupported.py` entries) |
| `GET` | `/compare/api/language-support`   | Per-provider *source*-language restrictions (currently `{}` — every provider accepts any source) |
| `GET` | `/compare/api/target-language-support` | Per-provider target-language codes (for greying out the target picker) |
| `GET` | `/compare/api/providers/{name}/voices` | TTS voices the provider offers (s2s) |
| `GET` | `/compare/api/soniox-model`       | Soniox `stt-rt-v5` model object; its `languages` drive the source-language list |
| `GET` | `/.well-known/health/soniox-translation-compare`  | Health check → `ok` |
| `GET` | `/.well-known/version/soniox-translation-compare` | `VERSION` env var |

## App-specific behavior

- **Two modes** — selected via the WS `mode` query param (`Mode = Literal["text", "s2s"]` in `providers/config.py`):
  - `text` — translated text only; every runnable provider supports it.
  - `s2s` — the translation is also synthesized and streamed back as PCM. Supported by Soniox, OpenAI, Gemini; **partial** for Azure (only target languages with a configured neural voice); **unsupported** for Speechmatics (no TTS).
- **Target language & voices.** `target_language` (default `es`) and `voice` are per-session query params. `/target-language-support` lists each provider's target codes; `/providers/{name}/voices` lists selectable voices — OpenAI and Gemini expose no voice selection (Gemini echoes the speaker's voice). Per-provider target-language support lives in `languages.py` (`LANGUAGE_MAP`, keyed by Soniox code); Soniox and OpenAI fetch their target lists live from the Soniox API.
- **Source-language handling.** `/language-support` is empty by design: every provider either auto-detects or takes a best-effort `language_hints` hint, so the source side is unconstrained. Speechmatics is single-language (source fixed for the session).
- **Event builders** (`utils.py`): `make_part`, `data_event`, `audio_event`, `error_message`, `info_message`, `session_done_event`. Providers push these onto `host_queue`; audio events carry base64 PCM the UI plays gaplessly via Web Audio (s2s).
- **Session guards.** `MAX_SESSION_SECONDS = 5 min` and `MAX_STREAMED_AUDIO_BYTES = 12 MB` (decoded PCM) end a session with a message on every card.
- **Console script.** Unlike `stt`/`tts`, this app defines `[project.scripts] dev = "dev:main"`, so `uv run dev` starts the backend (`dev.py`).

## Environment keys

Add to `translate/.env` (copy from `.env.example`). A missing key disables only that provider, never startup.

| Variable | Provider |
| -------- | -------- |
| `SONIOX_API_KEY`       | Soniox |
| `OPENAI_API_KEY`       | OpenAI |
| `GOOGLE_API_KEY`       | Gemini (Gemini Developer API key — not a Vertex service account) |
| `SPEECHMATICS_API_KEY` | Speechmatics |
| `AZURE_API_KEY` + `AZURE_REGION` | Azure |

Also reads optional `VERSION` and `LOG_LEVEL`.

## License

[MIT](../LICENSE.txt)
