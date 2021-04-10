FROM node:13-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV CI true
CMD npm run build
COPY ./dist ./dist

FROM nginx
COPY ./dist /usr/share/nginx/html
