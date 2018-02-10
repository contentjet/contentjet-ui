FROM node:9.5.0-alpine
COPY dist/ /opt/contentjet-ui/dist/
COPY package.json package-lock.json server.js /opt/contentjet-ui/
WORKDIR /opt/contentjet-ui/
RUN npm install --production
ENV PORT 9000
CMD node server.js
