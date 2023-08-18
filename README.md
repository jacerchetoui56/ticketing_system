## Ticketing System

### what is a ticketing system?

A "ticketing system" is a software tool used by businesses and organizations to manage and track customer inquiries, support requests, and technical issues. It helps streamline communication, prioritize tasks, and ensure efficient resolution of problems.

## How to run this code on your local machine?

1. Clone this repository
2. Open the folder in your Code Editor
3. Run the following command in your terminal

```bash
npm install
```

4. You need to change the .env file.

```bash
DATABASE_URL="YOUR_POSTGRES_DATABASE_URL"
JWT_SECRET_KEY = "YOUR_JWT_SECRET_KEY"
```

5. Run the following command in your terminal

```bash
npm run start:dev
```

6. You can open the prisma studio using the command below

```bash
npx prisma studio
```

> The reason why we suggest using prisma studio is its support for _static typing_.

7. Seed the database with the following command to insert the first superadmin user with the credentials in postman (or in the **seed.ts** file).

```bash
npx prisma db seed
```

7. Open Swagger UI in your browser by going to the following URL

```bash
http://localhost:3000/api/docs
```

**Note:** If you want to make requests using Postman you can download the _"ticketing-system.postman_collection.json"_ file and import it in your postman.
