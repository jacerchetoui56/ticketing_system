## Ticketing System

### what is a ticketing system?

A "ticketing system" is a software tool used by businesses and organizations to manage and track customer inquiries, support requests, and technical issues. It helps streamline communication, prioritize tasks, and ensure efficient resolution of problems.

## How to run this code on you local machine?

1. Clone this repository
2. Open the folder in your Code Editor
3. Run the following command in your terminal

```bash
npm install
```

4. You need to create a .env file in the root directory of the project and add the following variables

```bash
DATABASE_URL="YOUR_POSTGRES_DATABASE_URL"
JWT_SECRET_KEY = "YOUR_JWT_SECRET_KEY"
```

5. Run the following command in your terminal

```bash
npm run start:dev
```

6. Open Swagger UI in your browser by going to the following URL

```bash
http://localhost:3000/api
```

**Note:** If you want to make the request using postman you can download the _"ticketing-system.postman_collection.json"_ file and import it in your postman.
