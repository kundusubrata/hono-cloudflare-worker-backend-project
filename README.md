
# Serverless Blog Backend Application

This is a backend application for a blog platform built using **Hono**, **Cloudflare Workers**, **Prisma**, **Neon Postgres**, **hono/jwt**, and **Web Crypto**. The application provides APIs for managing blog posts, users, and related functionalities.
## Prerequisites

-   **Node.js** ( `also npm or yarn`)
-   **Cloudflare CLI** (`wrangler also cloudflare account`)
-   **PostgreSQL** (`Any online postgres account` )
-   **Prisma CLI**(`Prisma Accelerate account`)
## Local Development Setup

Follow these steps to set up the application locally for development and testing.

1. Clone the Repository and Install all dependency:
	 ```
	 git clone https://github.com/kundusubrata/hono-cloudflare-worker-backend-project.git
	 cd hono-cloudflare-worker-backend-project
	 yarn install
	 ```
2. Set Up Environment Variables
	Create a `.env` file in the root of the project means in the `server` directory add your neon database url for locally working. 
	``` 
	DATABASE_URL=""
	```
	Then you need to add prisma accelerate api key for connection pooling. Add api key in  `wrangler.toml` below [vars]. Also add rest of env variable
	
	```
	[vars]
	#MY_VAR = "my-variable"
	DATABASE_URL=""
	JWT_SECRET="JindagiEkSafarHaiSuhanaIhaKalKyaHoKisneJana"
	```
3. Set Up Prisma
	Run the following commands to generate Prisma client and apply database migrations:
	```
	npx prisma generate --no-engine
	npx prisma migrate deploy
	npx prisma db pull
	npx prisma studio
	```
4. Run Cloudflare Workers Locally
	use script to start a local development server:
	```
	yarn run dev
	```
5. Deploying to Cloudflare Workers
	When you're ready to deploy the application, run:
	```
	npx wrangler login
	npx wrangler whoami
	yarn run deploy
	```