FROM node:22.20.0-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends git curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/playwright-portfolio

COPY package.json package-lock.json ./
RUN npm ci \
    && npx playwright install --with-deps chromium firefox webkit

ARG RWA_COMMIT=0729f68ac220f7cda4ad09c5693dba11d7c532c6

RUN git clone https://github.com/cypress-io/cypress-realworld-app.git /opt/cypress-realworld-app \
    && cd /opt/cypress-realworld-app \
    && git checkout "$RWA_COMMIT" \
    && corepack enable \
    && corepack prepare yarn@1.22.22 --activate \
    && CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile

WORKDIR /opt/playwright-portfolio
COPY . .

RUN chmod +x docker/run-tests.sh

ENTRYPOINT ["./docker/run-tests.sh"]