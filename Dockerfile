FROM daocloud.io/library/node
ENV WORKDIR /usr/src/app
ENV NPM npm --registry=https://registry.npm.taobao.org
# ENV NPM npm
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR
EXPOSE 2333
COPY package.json $WORKDIR
RUN $NPM i
VOLUME $WORKDIR $WORKDIR/node_modules
RUN cd web && $NPM i && npm run build && rm -rf dist && mv web/dist . && rm -rf web
CMD npm start
