# Auth API - Documentation ✅

This document describes the authentication-related endpoints (signup / verify email / resend verification) in the backend, including status codes, data flow, required request fields, validation rules, and example success/error responses.

---

## Table of Contents
- Overview
- Status Codes 🔢
- Data flow (Signup + Verify) 🔁
- Endpoints
  - POST `/api/auth/signup` ✅
  - POST `/api/auth/verify-email` ✅
  - POST `/api/auth/resend-verification` (note)
- Validation & Error Format ⚠️
- JWT / Cookie details 🔐

---

## Overview
This backend implements email based verification for new users. Typical flow:
1. User signs up -> server creates user record with a verification code and expiry -> server emails the code
2. User calls verify endpoint with `email` + `code` -> server validates and marks account as verified -> issues an auth token (cookie + token)

---

## Status Codes
- **200 OK** - Request succeeded (e.g., verify successful, data retrieval, resend code)
- **201 Created** - Resource created (e.g., signup success)
- **400 Bad Request** - Validation failure, missing params, invalid code, or expired code
- **401 Unauthorized** - Missing/invalid auth token for protected routes
- **404 Not Found** - Resource not found (e.g., user not found)
- **409 Conflict** - Resource conflict (e.g., user already exists on signup)
- **500 Internal Server Error** - Unexpected server error

---

## OTP Expiry Values ⏳
- **Email verification code**: **10 minutes** (600,000 ms). In code: `verificationCodeExpires = Date.now() + 10 * 60 * 1000`.
- **Password reset code**: **10 minutes** (600,000 ms). In code: `resetCodeExpires = Date.now() + 10 * 60 * 1000`.
- **OTP verification attempts**: recommended max **5 attempts** per code (invalidate after max attempts).
- **OTP resend min interval**: **60 seconds** (enforced via `lastOtpRequestAt`).

---

## Data flow (Signup -> Verify) 🔁
1. Client POSTs to `POST /api/auth/signup` with body: `{ fullname: { firstName, lastName }, email, password }`.
2. Backend validators run (see validation rules below). If OK:
   - Check if user exists. If exists -> **409 Conflict**.
   - Hash password with bcrypt.
   - Generate `verificationCode` (6 digits) and `verificationCodeExpires` (now + 10 minutes).
   - Save user record with `isVerified: false`.
   - Send email via `SendEmail` middleware containing the verification code.
   - Respond **201 Created** with success message and user metadata (not password).
3. Client receives email and POSTs to `POST /api/auth/verify-email` with `{ email, code }`.
4. Backend checks:
   - Required fields and finds the user.
   - If user not found -> **404**.
   - If already verified -> **400** (or relevant message).
   - If verification expired -> **400** (expired code).
   - If code mismatches -> **400** (invalid code).
   - If OK: set `isVerified = true`, clear `verificationCode` and `verificationCodeExpires` and save.
   - Issue JWT via `generateToken(...)` which sets a secure cookie named `token` and returns the token.
   - Respond **200 OK** with user info and token.

---

## Data flow (Login) 🔑
1. Client POSTs to `POST /api/auth/login` with body: `{ email, password }`.
2. `auth.validator.loginValidator` runs; if validation fails -> **400**.
3. Query user by email (controller selects `+password`). If not found -> **404**.
4. Compare the supplied password with the hashed password using `bcrypt.compare`.
   - If mismatch -> **400** ("Invalid email or password").
5. If match -> call `generateToken(user._id, res)` to sign a JWT and set the `token` cookie (HTTP-only).
6. Respond **200 OK** with user metadata (cookie is used for subsequent protected requests).

Notes:
- Current implementation issues a token regardless of `isVerified`; if you require email verification before login, add a check (e.g., `if (!user.isVerified) return 400`).
- Clients should include the cookie in subsequent requests (browsers send it automatically; API clients can store/replay cookies).

---

## Data flow (Password Reset / Forgot Password) 🔁
This flow contains three steps: request code, verify code, then reset password.

### Step A — Request Password Reset (POST `/api/auth/request-password-reset`)
1. Client POSTs `{ email }`.
2. Validator runs; if invalid -> **400**.
3. Find user by email; if not found -> **404**.
4. Generate `resetCode` (6 digits) and set `resetCodeExpires` (now + 10 minutes), `lastPasswordResetRequestAt` (now), and `canResetPassword = false`.
5. Save user and send the `resetCode` via email using `SendEmail`.
6. Respond **200 OK** with a message that the code was sent.

Security notes:
- Rate-limit requests using `lastPasswordResetRequestAt`.
- Keep `resetCode` expiry short (10 minutes) and always clear codes after verification.

### Step B — Verify Reset Code (POST `/api/auth/verify-reset-code`)
1. Client POSTs `{ email, code }`.
2. Validator runs; if invalid -> **400**.
3. Find user; if not found -> **404**.
4. Check `resetCodeExpires` (if expired -> **400**).
5. Compare code; if mismatch -> **400**.
6. On success: set `user.canResetPassword = true`, clear `resetCode` and `resetCodeExpires`, save, and respond **200 OK** (now allowed to reset password).

### Step C — Reset Password (POST `/api/auth/reset-password`)
1. Client POSTs `{ email, newPassword }`.
2. Validator runs; if invalid -> **400**.
3. Find user; if not found -> **404**.
4. Check `user.canResetPassword`; if `false` -> **400** (not allowed to reset).
5. Hash `newPassword` with bcrypt and update `user.password`.
6. Clear `canResetPassword`, `resetCode`, and `resetCodeExpires`.
7. Save user and call `generateToken(user._id, res)` to log the user in (set cookie).
8. Respond **200 OK** with user metadata and success message.

---

## Data flow (Logout) 🚪
1. Client POSTs to `POST /api/auth/logout` (or calls an equivalent logout endpoint).
2. Server clears the auth cookie (e.g., `res.clearCookie('token')`) and invalidates any server-side session if used.
3. Respond **200 OK** with a message like `{ "success": true, "message": "Logged out" }`.

Notes:
- The current `logoutUser` controller in the codebase is a placeholder; implement `res.clearCookie('token')` to clear the cookie and return a success response.

---

## Endpoints

### POST /api/auth/signup
- Purpose: Register a new user and send the email verification code.
- Required body keys (JSON):
  - `email` (string, valid email) ✅
  - `password` (string, min 6 chars) ✅
  - `fullname.firstName` (string, min 3 chars) ✅
  - `fullname.lastName` (string, min 3 chars) ✅
- Validation errors return **400** with the validator's error format (see below).

Step-by-step process:
1. Client sends POST `/api/auth/signup` with body `{ fullname: { firstName, lastName }, email, password }`.
2. `auth.validator.signupValidator` runs; on validation failure respond **400** with details.
3. Server checks for existing user with the provided email; if found respond **409 Conflict**.
4. Server hashes the password with bcrypt (salt rounds = 10).
5. Server generates a 6-digit `verificationCode` and sets `verificationCodeExpires = Date.now() + 10 * 60 * 1000` (10 minutes).
6. New `User` is created with `isVerified: false` and saved to the database.
7. `SendEmail` middleware is used to send the verification code to the user's email using the configured SMTP transporter and `verifyCodeTemplate`.
8. Server responds **201 Created** with a success message and non-sensitive user metadata (no password).

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstName":"John","lastName":"Doe"},"email":"john@example.com","password":"secret123"}'
```

Success example (201 Created):
```json
{
  "success": true,
  "message": "Account created. Please verify your email to continue",
  "newUser": {
    "_id": "<id>",
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "isVerified": false
  }
}
```

Possible error examples:
- Validation / missing fields -> **400**
```json
{
  "success": false,
  "errors": [ { "field": "email", "message": "Invalid Email" } ]
}
```
- User already exists -> **409**
```json
{
  "success": false,
  "message": "User already exists"
}
```
- Email send failure (transporter error) -> **500** (server logs show sending error)
- Server error -> **500**

Notes / Security:
- Verification code is short-lived (10 min). Always clear `verificationCode` and `verificationCodeExpires` after verification to prevent replay attacks.
- Consider rate-limiting signup + resend requests and verifying email before allowing certain actions (e.g., messaging, access to protected features).


### POST /api/auth/verify-email
- Purpose: Verify account using email + 6-digit verification code.
- Required body keys (JSON):
  - `email` (string, valid email)
  - `code` (string of 6 numeric digits)
- Validation rules enforced by `auth.validator.verifyEmailValidator`.

Step-by-step process:
1. Client sends POST `/api/auth/verify-email` with `{ email, code }`.
2. Validator runs; on failure -> **400** with field errors.
3. Server looks up user by email; if not found -> **404**.
4. If `user.isVerified` is already `true`, respond **400** (already verified).
5. Check `verificationCodeExpires`; if missing or expired -> **400** ("Verification code has expired").
6. Compare provided `code` with `user.verificationCode`; if mismatch -> **400** ("Invalid verification code").
7. On success: set `user.isVerified = true`, clear `verificationCode` and `verificationCodeExpires`, save the user.
8. Issue JWT via `generateToken(user._id, user.email, res)` (sets HTTP-only `token` cookie and returns token string).
9. Respond **200 OK** with user metadata and the token in the body (and cookie).

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","code":"123456"}' \
  -c cookies.txt
```

Success example (200 OK):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "_id": "<id>",
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "avatar": null
  },
  "token": "<jwt-token>"
}
```

Error examples:
- Missing fields / invalid format -> **400** (validator)
```json
{
  "success": false,
  "errors": [ { "field": "code", "message": "Verification code is required" } ]
}
```
- User not found -> **404**
```json
{ "success": false, "message": "User not found" }
```
- Code expired -> **400**
```json
{ "success": false, "message": "Verification code has expired" }
```
- Incorrect code -> **400**
```json
{ "success": false, "message": "Invalid verification code" }
```

Notes:
- After verification, the server sets an HTTP-only cookie named `token` and may also include the token in the JSON response — store the cookie for authenticated requests.
- Always clear verification fields after successful verification to prevent reuse.
---

### POST /api/auth/resend-verification
- Purpose: Re-send verification code to the user's email.
- Required: `email` (valid email).
- Rate limiting: If the user requested less than 60 seconds since last request, the server returns an error (check `lastOtpRequestAt`).
- Success -> **200** with message "Verification code resent successfully".

---

### POST /api/auth/login
- Purpose: Authenticate an existing user and issue an auth token cookie.
- Required body keys (JSON):
  - `email` (string, valid email)
  - `password` (string)

Step-by-step process:
1. Client sends POST `/api/auth/login` with `{ email, password }`.
2. `auth.validator.loginValidator` validates input; if invalid respond **400** with field errors.
3. Server queries the user by email and includes the hashed password (`.select('+password')`); if not found respond **404**.
4. Server compares provided password with stored hash using `bcrypt.compare`:
   - If mismatch respond **400** with message "Invalid email or password".
5. (Optional) If your app requires verified email before login, check `user.isVerified` and respond **400** if `false`.
6. On success, call `generateToken(user._id, res)` to create JWT and set the `token` HTTP-only cookie.
7. Respond **200 OK** with user metadata (do not include the password).

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}' \
  -c cookies.txt
```

Notes:
- Browsers will automatically store and send the `token` cookie on same-site requests; for API clients, capture the `Set-Cookie` header or use `-c cookies.txt` with curl as shown.

Success example (200 OK):
```json
{
  "success": true,
  "_id": "<id>",
  "fullname": { "firstName": "John", "lastName": "Doe" },
  "email": "john@example.com",
  "avatar": null
}
```
Response header example (Set-Cookie):
```
Set-Cookie: token=<jwt>; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure
```

Possible errors:
- Validation failure -> **400**
```json
{ "success": false, "errors": [ { "field": "email", "message": "Invalid email" } ] }
```
- User not found -> **404**
```json
{ "success": false, "message": "User not found" }
```
- Invalid credentials (wrong password) -> **400**
```json
{ "success": false, "message": "Invalid email or password" }
```

---

## Password reset flow ("Forgot password") 🔐
This flow has three steps: request code, verify code, reset password.

#### POST /api/auth/request-password-reset
- Purpose: Request a password reset code sent to the user's email.
- Required body keys: `{ "email" }

Step-by-step process:
1. Client sends POST `/api/auth/request-password-reset` with `{ email }`.
2. Validator runs and rejects invalid requests (**400**).
3. Server finds the user by email; if not found respond **404**.
4. Server generates a 6-digit `resetCode`, sets `resetCodeExpires = Date.now() + 10 * 60 * 1000`, sets `lastPasswordResetRequestAt` (now) and `canResetPassword = false`.
5. Save user and send the `resetCode` via `SendEmail`.
6. Respond **200 OK** with a message that the code was sent.

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

Success example (200 OK):
```json
{ "success": true, "message": "Password reset code sent to email" }
```

Possible errors:
  - Missing/invalid email -> **400**
  - User not found -> **404**

#### POST /api/auth/verify-reset-code
- Purpose: Verify the 6-digit reset code sent to the user's email.
- Required body keys: `{ "email", "code" }` (code must be 6 digits)

Step-by-step process:
1. Client sends POST `/api/auth/verify-reset-code` with `{ email, code }`.
2. Validator runs and rejects invalid requests (**400**).
3. Server finds the user by email; if not found respond **404**.
4. Server checks `resetCodeExpires`; if expired respond **400** ("Reset code expired").
5. Server compares provided `code` with stored `resetCode`; if mismatch respond **400** ("Invalid reset code").
6. On success, set `user.canResetPassword = true`, clear `resetCode` and `resetCodeExpires`, save user, and respond **200 OK** indicating the user can reset their password.

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/verify-reset-code \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","code":"123456"}'
```

Success example (200 OK):
```json
{ "success": true, "message": "Reset code verified. You can now reset your password." }
```

Possible errors:
  - Missing/invalid fields -> **400**
  - Code expired -> **400** ("Reset code expired")
  - Invalid code -> **400** ("Invalid reset code")
  - User not found -> **404**

#### POST /api/auth/reset-password
- Purpose: Reset the user's password after the reset code was verified.
- Required body keys: `{ "email", "newPassword" }` (newPassword min 6 chars)
- Behavior: The server checks `user.canResetPassword` (set to true after successful code verification). If allowed, the password is hashed, reset flags are cleared, and a session is issued via cookie.

Step-by-step process:
1. Client sends POST `/api/auth/reset-password` with `{ email, newPassword }`.
2. Validator runs and rejects invalid requests (**400**).
3. Server finds the user; if not found respond **404**.
4. Server checks `user.canResetPassword`; if `false` respond **400** (not allowed to reset).
5. Server hashes `newPassword` using bcrypt and sets `user.password` to the hashed value.
6. Server clears `canResetPassword`, `resetCode`, and `resetCodeExpires`.
7. Save the user, call `generateToken(user._id, res)` to set the `token` cookie, and respond **200 OK** with user metadata and a success message.

Request example (cURL):
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","newPassword":"newSecret123"}' \
  -c cookies.txt
```

Success example (200 OK):
```json
{
  "success": true,
  "_id": "<id>",
  "fullname": { "firstName": "John", "lastName": "Doe" },
  "email": "john@example.com",
  "avatar": null,
  "message": "Password reset successfully"
}
```

Notes:
- On successful reset the server calls `generateToken(...)` to set the auth cookie so the user is logged in immediately.
- Possible errors:
  - Missing/invalid fields -> **400**
  - User not found -> **404**
  - Not allowed to reset (reset code not verified) -> **400** or **403**

---

### POST /api/auth/logout
- Purpose: Clear the auth cookie and log the user out.
- Success: **200** with message like `{ "success": true, "message": "Logged out" }`.

---

### PUT /api/auth/update-profile 🔧
- Purpose: Update the authenticated user's profile avatar.
- Route: `PUT /api/auth/update-profile` (protected — cookie-based auth)
- Authentication: Requires HTTP-only cookie `token` set by login/verify/reset (server reads `req.cookies.token`).

Required body (JSON):
- `avatar` (string) — **required**. Accepts a base64 data URL (e.g., `data:image/png;base64,...`) or a publicly accessible image URL. The server uploads this to Cloudinary and stores the `secure_url` on the user record.

Behavior & notes:
- If the user has an existing avatar, the server attempts to remove it from Cloudinary before uploading the new image.
- The controller uses Cloudinary, so Cloudinary env vars must be configured (see the Environment variables section below).

Status codes & examples:
- **200 OK** — Profile updated successfully

Success example (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "<id>",
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/.../chatty/avatars/<file>.jpg"
  }
}
```

- **400 Bad Request** — Missing `avatar`
```json
{ "success": false, "message": "Profile image is required" }
```
- **401 Unauthorized** — Missing or invalid auth token
```json
{ "success": false, "message": "Unauthorized — user not found in request" }
```
- **404 Not Found** — User not found
```json
{ "success": false, "message": "User not found" }
```
- **500 Internal Server Error** — Cloudinary/upload or server error

Request example (cURL):
```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -d '{"avatar":"data:image/png;base64,<BASE64_DATA>"}' \
  -b cookies.txt
```

Notes / Tips:
- For browser clients use `fetch` or `axios` with `credentials: 'include'` / `withCredentials: true` to send cookies automatically.
- For large images, consider resizing client-side before upload to avoid long upload times and Cloudinary size limits.

---

### GET /api/auth/check-auth ✅
- Purpose: Verify the auth token and return the currently authenticated user.
- Route: `GET /api/auth/check-auth` (protected — cookie-based auth)
- Authentication: Requires HTTP-only cookie `token` set by the server.

Behavior:
- The middleware verifies the token and attaches the user to `req.user`.
- If valid, the endpoint responds with the user object (no password returned).

Status codes & examples:
- **200 OK** — Authorized
```json
{
  "success": true,
  "message": "User is authorized",
  "user": {
    "_id": "<id>",
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/.../chatty/avatars/<file>.jpg",
    "isVerified": true
  }
}
```
- **401 Unauthorized** — Missing or invalid token
```json
{ "success": false, "message": "Unauthorized — token missing or invalid" }
```
- **500 Internal Server Error** — Unexpected server error

Request example (cURL):
```bash
curl -X GET http://localhost:5000/api/auth/check-auth -b cookies.txt
```

---

## Validation & Error Format ⚠️
- The project uses `express-validator` and the `auth.validate` middleware.
- Validation failures return **400** and payload like:
```json
{
  "success": false,
  "errors": [
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```
- Controller-level errors are usually `{ success: false, message: "..." }` with appropriate status codes.

---

## JWT / Cookie details 🔐
- The function `generateToken` signs a JWT with `userId` and `email` and sets a cookie named `token`.
- Cookie options:
  - `httpOnly: true`
  - `sameSite: 'lax'`
  - `secure: true` when `NODE_ENV !== 'development'`
  - `maxAge`: 7 days
- Protected routes read `req.cookies.token` and verify it using `process.env.JWT_SECRET`.

---

## Environment variables (required / recommended) ⚙️
Set these in your `.env` file (or in your hosting environment). Example values are provided.

- `PORT` (number) — server port (example: `5000`)
- `NODE_ENV` (string) — `development` or `production` (affects cookie `secure` and logging)
- `MONGO_URI` (string) — MongoDB connection string (example: `mongodb://localhost:27017/chat-app`)
- `JWT_SECRET` (string) — secret used to sign JWTs (example: `a-very-strong-secret`)
- `JWT_EXPIRE` (string) — token lifetime (example: `7d`, `1h`)
- `SMTP_HOST` (string) — SMTP server (example: `smtp.mailtrap.io`)
- `SMTP_PORT` (number) — SMTP port (e.g., `587`)
- `SMTP_USER` (string) — SMTP username
- `SMTP_PASS` (string) — SMTP password

Cloudinary (required for `update-profile`):
- `ClOUDINARY_CLOUD_NAME` (string) — your Cloudinary cloud name (example: `your-cloud-name`)
- `ClOUDINARY_API_KEY` (string) — Cloudinary API key
- `ClOUDINARY_API_SECRET` (string) — Cloudinary API secret

Notes:
- Ensure `NODE_ENV` is set to `development` when testing locally so cookies are set with `secure:false`. In production, `secure:true` is enforced for cookies.

Optional / recommended:
- `FRONTEND_URL` (string) — for CORS and email links
- `BCRYPT_SALT_ROUNDS` (number) — default in code is 10; can be configurable for faster/safer hashing

---

## Request rate-limit rules (explicit numbers) ⏱️
These include rules already enforced by code and recommendations to improve security. Numbers are explicit to make behavior deterministic.

Implemented (in current code):
- Resend verification code: minimum interval **60 seconds** between requests (enforced by `lastOtpRequestAt`).

Recommended (explicit limits you should enforce with rate-limiting middleware or a throttling store like Redis):
- **Global API**: max **100 requests / 15 minutes / IP** (to reduce brute-force + DoS surface)
- **Signup attempts**: max **5 signups / hour / IP**
- **Login failed attempts**: max **5 failed logins / 15 minutes** → lock for **15 minutes** (or require captcha)
- **OTP resend**: min interval **60 seconds**, max **5 resends / hour**, max **10 resends / day**
- **Password reset requests**: min interval **60 seconds**, max **5 per hour**
- **OTP/code verification attempts**: max **5 attempts** per code; after that invalidate the code and require a new request

Notes:
- Use a distributed store (Redis) for counters when you run multiple instances. Return **429 Too Many Requests** with a Retry-After header when limits are hit.

---

## Schema Field Reference (User) 🧾
Based on `src/Models/user.model.js` — this lists fields, types and brief notes.

- `_id` (ObjectId) — MongoDB document id
- `email` (String) — required, unique, lowercased, trimmed (example: `john@example.com`)
- `password` (String) — hashed password, `select: false` (not returned by default), min length 6
- `fullname.firstName` (String) — required, min length 3
- `fullname.lastName` (String) — required, min length 3
- `avatar` (String) — URL or filename (default: `''`)
- `status` (String) — `online | offline | typing` (default: `offline`)
- `lastSeen` (Date) — last seen timestamp
- `isVerified` (Boolean) — whether email is verified (default: `false`)
- `verificationCode` (String) — 6-digit code stored temporarily for email verification
- `verificationCodeExpires` (Date) — expiry time for verification code
- `lastOtpRequestAt` (Date) — timestamp of last OTP/resend request
- `resetCode` (String) — 6-digit code for password reset
- `resetCodeExpires` (Date)
- `canResetPassword` (Boolean) — flag set after reset code verification (default: `false`)
- `lastPasswordResetRequestAt` (Date)
- `createdAt`, `updatedAt` (Date) — Mongoose timestamps

Security notes:
- Never return `password`, `verificationCode`, `resetCode` in API responses.
- Clear verification/reset codes after use and on expiry.

---

## Example headers & frontend usage (cookies + tokens) 🧭
Cookie-based auth (recommended for browser clients):
- Server sets an HTTP-only cookie named `token` on login / verify / reset. Browser will send it automatically for same-site requests.
- Example `fetch` (include cookie):

```js
await fetch('http://localhost:5000/api/protected', {
  method: 'GET',
  headers: { 'Accept': 'application/json' },
  credentials: 'include' // important to send cookies
});
```

Example with Axios:
```js
axios.get('http://localhost:5000/api/protected', { withCredentials: true })
```

If you prefer header tokens (for APIs or mobile clients):
- Use `Authorization: Bearer <jwt>` (note: current code sets cookie; you can also read token from the `generateToken` return and send it this way)

Example headers for JSON API requests:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt>  # if using header tokens
```

CORS & sameSite notes:
- Current cookie `sameSite: 'lax'` works for normal browser flows; for cross-site (third-party) usage use `sameSite: 'none'` + `secure: true` and allow credentials in CORS config.

---




