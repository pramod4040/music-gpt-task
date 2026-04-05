# How to run

- Clone the project
- Run `docker compose build`
- Run `docker compose up`

You can switch different environment from .env file, Change value of APP_ENV in .evn file. (development, qa and prod). Environment specific keys value will be stored in .env.development or .env.qa or .env.production

# Music Gpt Task

User can register them using the register api. `auth/register`
Login using login api and they can generate the music using the `/prompt` api it will queue the prompt and generate the music.


# Authentication

I have used JWT authentication system, when user login with their email and password api will return accesstoken and refreshtoken, accesstoken expires in 10 minutes but refreshtoken is valid for 7 days.

After 10 min when user call any protected route it will throw 401 Unauthorized, if 401 is return, FE can call `auth/refresh` api with refreshToken in body. We can exchange accesstoken and refreshtoken, but one refreshtoken can only be used once. 

 ## Token Invalidation
- When user call auth/refresh we invalidate the old refresh token and issue new access token and refresh token
- When user log out we invalidate refresh token by removing it from DB and also set forceLogin to true. After that even if old unexpired accesstoken and refreshtoken can not be used. User have to login again.


# Subscription And Rate Limit

I have created two endpoint for subscription and cancel, we are keeping subscrition status in Users table only for the simplicity. Subscribed user have high rate limit subscribed user can call 
Free User can call `20 requests/min` 
Paid User can call `100 requests/min` 

## Rate Limit
If user hit the more than that it will return 429 too much request error. For rate limit i have used rate-limit guard, `common/guard/ratelimit/rate-limit.guard.ts` and rate limit strategy is sliding window, but it is easily change able. 

I have registerd rate limit guards with APP_GUARD so it will be use in all the routes automatically. For the public route i am skiping the rate limit checking mechanism for now. 


# Unified Search (Paginated + Weighted Ranking)
In this unified search we have search in two table Users and Audio, and we have to give Ranking for each matching row. 

 - Score 3 : For Exact match
 - Score 2: Prefix match, if field start with query (query + %)
 - Score 1: Contain match ( % query %)

I have created seperate module for search, search can be bigger and more complex later. As we are using cursor based pagination, cursor will encode id and score so we can find exact starting row of next page.


# CRUD Endpoints: Paginated + Cached

For Pagination we have implmented the offset based pagination for crud, and for caching i have created `Cacheable` decorator any method we need to cache the result we can use cachable it will cache it in redis, and to invalidate the cache we can use `CashInvalidate` decorator it accepts exact keys, pattern and buildKeys params according to our need we can invalidate the cache.


# Generation Simulation ( CRON + Worker + WebSockers )

- I have setup the cron (cron-scheduler) where every 10 second it will fetch all PENDING prompts for processing. All those prompts will be put into the queue (PAID, FREE) according to user subscription and those prompts status will be changed to queued. If there are more then 200 items already in the the FREE queue we will drop that request and send user the appropriate mesage.

- We have two worker / Processor freeWorker and paidWorker. These worker will pick the task from queue and execute the task, Paid worker can accept 15 concurrent jobs and free worker can accept only 2 concurrent jobs and only 10 jobs per second. 

- When worker completes the job it will change the status of prompt, to COMPLETED and create the entry in the Audio table. After generation is done it will send event 'prompt-completed' to the user using web socket channel. I have simulate the external music generate api with the delay of 4 seconds.


# Web Socket

Connect to the server, `http://localhost:3001` pass accesstoken in headers in `token` key. And lister for 'prompt-completed` event. We have a gateway module for socket connection and it's response.





