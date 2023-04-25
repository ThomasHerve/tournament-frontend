FROM node:16.18.0 as build-stage
SHELL ["/bin/bash", "-c"]
WORKDIR /app
COPY package*.json /app/
RUN npm install -g nx
RUN npm install -g --legacy-peer-deps @nrwl/nx-linux-arm-gnueabihf
RUN npm install --legacy-peer-deps
COPY ./ /app/
RUN export NX_DAEMON=false; nx build --prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.17.1-alpine
#Copy ci-dashboard-dist
COPY --from=build-stage /app/www/ /usr/share/nginx/html
#Copy default nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf