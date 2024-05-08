## Getting Started

To run the project locally, follow the steps:

1. Install docker and docker compose [guide to install](https://docs.docker.com/desktop/install/ubuntu/)
2. clone the repository,
   > `$ git clone https://github.com/divy-vinayak/apple-slice.git`
   > `$ cd apple-slice`
4. Rename the **.env.example** file to **.env**
5. Put your openAI api key inside the **.env** file , if you're not using any self hosted LLM model.
6. In the root of the project, open terminal and run the following commands
   >  `$ docker compose up`
7. In another terminal, run
   > `$ docker exec -it apple-slice-app /bin/bash`
   > `$ npx prisma migrate dev`
   >  `$ exit`
9. Navigate to localhost:3000
10. Go to Signup and register with a user and start playing with the application

## UI

![alt text](./public/image.png)
![alt text](./public/image-1.png)
![alt text](./public/image-2.png)
