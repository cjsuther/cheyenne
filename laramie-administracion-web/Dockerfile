FROM node:alpine as builder
WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3010 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
