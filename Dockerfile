# build prod image
FROM mhart/alpine-node:6

RUN apk add --update alpine-sdk
## cache node_modules
ADD ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app/src && cp -a /tmp/node_modules /app/
RUN node -v

## copy meta
WORKDIR /app

## build
ADD ./.bin /app/.bin
ADD ./server /app/server
ADD ./.babelrc /app/
ADD ./package.json /app/
ADD ./scripts /app/scripts
RUN ls
RUN npm run build-server

EXPOSE 3000
CMD ["npm", "run", "up"]