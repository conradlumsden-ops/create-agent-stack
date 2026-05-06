FROM node:22-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
COPY SOUL.md Agents.md User.md ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/SOUL.md /app/Agents.md /app/User.md ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
