FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY swagger.html /usr/share/nginx/html/swagger.html
RUN rm -f /etc/nginx/conf.d/default.conf
EXPOSE 80 443
