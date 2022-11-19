FROM node:alpine

#RUN echo "installing node"
#$RUN yum install nodejs-14.18.1 -y; \
#    yum clean all;

ENV PROJECT_NAME="exp-react-webapp"
ENV CONFIG_EMPTY=1

WORKDIR /app

COPY . /app

#build web app
RUN npm install -g typescript@4.6.3; \
    npm install; \
    npm run build; \
    tsc -p tsconfig.server.json;

EXPOSE 3000

RUN ls -l
#for non-dev builds
CMD [ "node" , "exp-react-svc/" ]