FROM node:18

WORKDIR /webapp

COPY package* .
COPY ./prisma .

RUN npm i
RUN npx prisma generate

COPY . .

CMD ["npm", "run", "dev"]