# Music Gpt Task

- Authentication

We have used jwt token for authentication. 

Refresh Token is saved in DB after after hashing it, when user log in we generate new refresh token and update the refresh token in db.

When user call /auth/refresh we validate the refresh token of that user and we invalidate old refresh token by removing it from db and generate new refresh token. So that one refresh token can be used only once.


- Access Token Invalidation

When user logout we set the force_login field to true, it will check the in middleware if that is true we force user to login again even if they have valid access token, cause that access token might be compromised, ony the real user can login.


# RateLimiting

Rate Limiting code is inside common/guard/ratelimit, i am using sliding window rate limit technique, i have registers rate-limit-guards with APP_GUARD so it will use that guard in all routes, for pubic route we will skit the rate limit checking mechanism automatically! checkout it rate-limit.guard.ts