FROM node:18

WORKDIR /app

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libdrm2 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
    libgtk-3-0 libnspr4 libnss3 xdg-utils fonts-liberation \
    --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
