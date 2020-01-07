FROM node:12.14.0

# Create app directory
RUN mkdir -p /usr/src/smartbrain-backend
WORKDIR /usr/src/smartbrain-backend

# Install app dependencies
COPY package.json /usr/src/smartbrain-backend
RUN npm install

# Bundle app source
COPY . /usr/src/smartbrain-backend

CMD ["npm", "start"]