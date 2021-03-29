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
WORKDIR /usr/
COPY --from=lib /usr/lib/*.tgz ./lib/.
COPY server/ ./server
RUN npm install typescript -g
RUN cd ./server&&npm install --only=production
RUN cd ./server&&ls ../lib/*.tgz|xargs -I{} npm install {} -s
RUN cd ./server&&npm run build
EXPOSE 8080
CMD [ "node", "/usr/server/dist/index.js" ]