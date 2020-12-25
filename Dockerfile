# --------------------------------------
# Step 1 - Build the project
FROM node:15-slim as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install tslint typescript -g
RUN npm ci --only=production
COPY . .
RUN npm run build

# --------------------------------------
# Step 2 - Create production image
FROM node:15-slim as production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 8080
CMD [ "node", "./dist/index.js" ]