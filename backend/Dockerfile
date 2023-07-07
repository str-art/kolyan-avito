FROM node:18-alpine as build

WORKDIR /opt/build

COPY . .

RUN npm install && npm run build

FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=build /opt/build/dist .

CMD ["lambda.handle"]