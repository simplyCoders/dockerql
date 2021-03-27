# --------------------------------------
# Step 1 - Build the lib
FROM node:15.5.1-slim as lib
WORKDIR /usr/lib/
COPY lib/ ./
RUN npm install typescript -g
RUN npm run build:clean

# --------------------------------------
# Step 2 - Build server 
FROM node:15.5.1-slim as production
WORKDIR /usr/server/
COPY --from=lib /usr/lib/*.tgz ./lib
COPY server/ ./
RUN npm install typescript -g
RUN npm install --only=production
RUN ls ../lib/*.tgz|xargs -I{} npm install {} -s
RUN npm run build
EXPOSE 8080
CMD [ "node", "/usr/server/dist/index.js" ]