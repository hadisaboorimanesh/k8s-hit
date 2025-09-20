FROM  docker.hasti.co/node/node:20.3.1-alpine as build
ARG VITE_API_BASE_URL
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM docker.hasti.co/library/nginx:latest
COPY --from=build /app/dist/ /usr/share/nginx/html
