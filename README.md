## Getting Started
To run the project locally, follow the steps:
1. Install docker and docker compose
2. clone the repository
3. Rename the **.env.example** file to **.env**
4. Put your openAI api key, if you're not using any self hosted LLM model.
5. In the root of the project, open terminal and run the following commands
    a. `$ docker compose up`
6. In another terminal in the same directory, run
    a. `$ docker exec -it apple-slice-app /bin/bash`
    b. `$ npx prisma migrate dev`
    c. `$ exit`
7. Navigate to localhost:3000
8. Go to Signup and register with a user and start playing with the application