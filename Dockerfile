FROM node:18

# Puppeteer prerequisites for Chromium
RUN apt-get update && apt-get install -y \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  fonts-liberation \
  ca-certificates \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Optional: Set environment variable to skip Chromium download if you're using your own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
