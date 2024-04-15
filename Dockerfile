FROM node:18

WORKDIR /webapp

COPY package* .
RUN npm i

COPY ./prisma .
RUN npx prisma generate

COPY . .

CMD ["npm", "run", "dev"]