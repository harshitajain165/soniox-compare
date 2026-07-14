FROM docker.io/node:24-slim AS fe-builder

WORKDIR /app

COPY /frontend/package.json /frontend/yarn.lock .

RUN yarn install --frozen-lockfile

COPY /frontend .

RUN yarn build

FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY . .

# main.py mounts frontend/dist and fails to start if it is absent.
COPY --from=fe-builder /app/dist /app/frontend/dist

ARG VERSION
ENV VERSION=${VERSION}

EXPOSE ${PORT:-8000}

CMD uv run --no-sync uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
