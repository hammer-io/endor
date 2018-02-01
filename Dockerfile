FROM node:carbon-alpine

# This was developed based on the guide at:
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# Install production dependencies only
RUN npm install --only=production && npm install \
  babel-cli@6.26.0 \
  babel-plugin-transform-async-to-generator@6.24.1 \
  babel-preset-env@1.6.0

# Bundle app source
COPY apidoc.json .babelrc ./
# TODO: These config files need to be modified for production
COPY *Config.json ./
COPY ./src ./src

EXPOSE 3000
CMD [ "npm", "run", "productionStart" ]
