# TALKS — Frontend 📱

**Short description:**
TALKS is a lightweight chat app. This README focuses on the frontend (Vite + React) and documents the Signup UI, validation rules, example endpoints, and how to run the client locally.

---

## 🚀 Tech Stack

- **React** (via Vite)
- **Vite** (build & dev server)
- **Tailwind CSS** + **DaisyUI** (utility + components)
- **Zustand** (state management)
- **axios** (HTTP client)
- **react-hot-toast** (notifications)
- **Lucide Icons** (icons)

---

## ✨ Features (Signup page oriented)

- Signup form with fields: **First Name**, **Last Name**, **Email**, **Password**, **Confirm Password**
- Client-side validation with clear inline errors
- Password visibility toggle
- Loading state while signing up
- Redirects to login or OTP verification flow after signup
- Clear, user-friendly success & error toast messages

---

## 📁 Minimal Folder Structure

```
client/
├─ public/
├─ src/
│  ├─ Components/
│  │  └─ Reuseable/ (FormInput, Logo, AuthImagePattern, etc.)
│  ├─ pages/ (LandingPage, SignupPage, LoginPage, VerifyOtp, HomePage...)
│  ├─ lib/ (axios instance)
│  └─ Store/ (UseAuthStore - zustand)
└─ package.json
```

---

## 🛠️ Installation & Run Commands

1. Install dependencies:

```bash
cd client
npm install
# or
pnpm install
# or
# yarn
```

2. Run dev server:

```bash
npm run dev
```

3. Build & preview:

```bash
npm run build
npm run preview
```

> Note: Vite automatically reloads on changes during development.

---

## 🔑 Environment Variables

Create a `.env.local` (or `.env`) in `client/` root and add:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

- Vite exposes variables prefixed with `VITE_` to the client.
- The app uses `axiosInstance` with `withCredentials: true` so backend must support CORS with credentials and set cookies appropriately.

---

## ✅ Validation Rules (Signup UI)

- First Name: required, min **3** characters
- Last Name: required, min **3** characters
- Email: required, valid email format (`\S+@\S+\.\S+`)
- Password: required, min **6** characters (recommend adding strong password hints)
- Confirm Password: must **match** Password

UI behavior:
- Show inline error messages for each field
- Disable submit button and show loading state while request is in progress
- Show toast notification for server errors/success

---

## 🔁 Example API Endpoints & Responses

All endpoints are relative to `VITE_BACKEND_URL`.

- POST `/auth/signup` — Create account
  - Success (201):
    ```json
    { "message": "Account created", "user": { "email": "a@b.com", "_id": "..." } }
    ```
  - Validation error (400):
    ```json
    { "message": "Validation failed", "errors": { "email": "Invalid email" } }
    ```
  - Conflict (409):
    ```json
    { "message": "Email already in use" }
    ```

- POST `/auth/verify-email` — Verify OTP
  - Success (200): sets `auth` cookie and returns user data
  - Error (400/401): invalid/expired code

- POST `/auth/resend-verification` — Resend OTP
  - Success (200): message
  - CoolDown (429): `{ "message": "please Wait 55's" }` — respond in UI by disabling resend temporarily and showing countdown if desired

- POST `/auth/logout` — Logout (server should clear cookie)

---

## ⚠️ Common Errors & Handling

- Network Error / Backend Down → show a toast: "Service unavailable, try again later"
- 400 Validation → show inline field errors when available
- 401 Unauthorized → redirect to login
- 429 Too Many Requests (resend OTP) → show cooldown info to user

---

## 🔭 Future Scope (nice-to-have)

- Add strong password meter & suggestions
- Use a form library (react-hook-form + zod) for better validation and developer DX
- Add E2E tests (Cypress / Playwright) for signup flow
- Accessibility improvements & ARIA attributes
- Social login (Google, GitHub)
- i18n support

---

## 📝 Quick Manual Test Steps (Signup)

1. Start backend + frontend with env `VITE_BACKEND_URL` pointed to backend.
2. Go to `/signup` and fill the form with invalid values to test client-side errors.
3. Submit with a valid email; check network tab for `POST /auth/signup` and observe toast.
4. If OTP flow exists, go to `/verify-email` and test `POST /auth/verify-email`.

---

If you want, I can add a short `CONTRIBUTING` snippet or convert validation rules into `zod` schemas/examples. ✅


# TALKS — Auth (Login, Logout, Profile) 🔐

**Short description:**
This README documents the frontend authentication flows (Login, Logout, Profile) for the TALKS client (Vite + React). It covers validation rules, example endpoints, error handling, and how to run/test the auth flows locally.

---

## 🚀 Tech Stack

- **React** (Vite)
- **Zustand** (state management)
- **axios** (HTTP client)
- **Tailwind CSS** + **DaisyUI** (UI)
- **react-hot-toast** (notifications)
- **Lucide Icons** (icons)

---

## ✨ Features (Auth-focused)

- **Login**
  - Email + Password fields
  - Client-side validation and inline toast errors
  - Password visibility toggle
  - Loading state during request
  - Redirect to `/home` on success

- **Logout**
  - Sends request to server to clear session/cookie
  - Updates local auth state and redirects to `/login` or `/`
  - Shows toast feedback

- **Profile**
  - View user info: name, email, avatar
  - Update profile (name, avatar upload)
  - Update password (optional flow)
  - Loading state and toasts for success/error

- **Forgot Password / Reset**
  - Request password reset by entering your email
  - Receive OTP or reset link to verify
  - Verify code and set a new password
  - Loading states, cooldown handling (429), and redirect to login on success

---

## 📁 Minimal Folder Structure

```
client/
├─ src/
│  ├─ Components/
│  │  └─ Reuseable/ (FormInput, LoadingButton, Logo, etc.)
│  ├─ pages/ (LoginPage, SignupPage, VerifyOtp, ProfilePage, ResetPassword...)
│  ├─ lib/ (axios instance)
│  └─ Store/ (UseAuthStore - zustand)
```

---
## 🔑 Environment Variables

Place a `.env.local` (or `.env`) at `client/` root:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

Notes:
- Client uses `axiosInstance` with `withCredentials: true` — backend must support CORS with credentials and set cookies accordingly.
- Vite exposes variables prefixed with `VITE_` only.

---

## ✅ Validation Rules (important)

- Login UI
  - **Email**: required, valid email (`\S+@\S+\.\S+`)
  - **Password**: required, min **6** characters
  - UI: show toast for invalid input and block submit

- Logout UI
  - No user input required; UI should show confirmation or feedback and disable logout button while network request is in-progress

- Profile UI
  - **First Name** / **Last Name**: required, min **3** characters
  - **Email**: required, valid email format — usually not changed; if editable, re-verify or show warning
  - **Avatar**: validate file type (jpg/png), max file size (e.g., 2MB)
  - If password is changed via profile: same rules as login password + confirm password match

- Reset / Forgot Password UI
  - **Email**: required, valid email (`\S+@\S+\.\S+`)
  - **OTP/Code**: required when verifying, length **6** (UI may show 6 individual inputs)
  - **New Password**: required, min **6** characters
  - **Confirm Password**: must match New Password
  - Disable resend button on cooldown and show remaining seconds when backend returns 429

UI behavior:
- Show inline errors or toast messages
- Disable submit buttons while requests are pending

---

## 🔁 Example API Endpoints & Example Responses

All endpoints are relative to `VITE_BACKEND_URL`.

- POST `/auth/login` — Login
  - Request body: `{ "email": "a@b.com", "password": "secret" }`
  - Success (200):
    ```json
    { "message": "Login successful", "user": { "_id": "...", "email": "a@b.com" } }
    ```
  - Error (400/401):
    ```json
    { "message": "Invalid credentials" }
    ```

- POST `/auth/logout` — Logout
  - Success (200): `{ "message": "Logged out" }` (client should clear auth state)
  - Error (401): `{ "message": "Not authenticated" }`

- GET `/auth/check-auth` — Check current session
  - Success (200): returns user object
  - Error (401): not authenticated

- GET `/auth/profile` or GET `/users/me` — Fetch profile
  - Success (200): `{ "user": { "fullname": {"firstName":"...","lastName":"..."}, "email":"...", "avatar":"..." } }`

- PUT `/auth/update-profile` — Update profile
  - Accepts form-data for avatar or JSON for other fields
  - Success (200): updated user
  - Error (400): validation errors `{ "errors": {"firstName": "..."} }`

- PUT `/auth/change-password` — Change password (optional)
  - Requires currentPassword and newPassword
  - Errors: 400 invalid input, 401 wrong current password

- POST `/auth/request-password-reset` — Request password reset (enter email)
  - Request body: `{ "email": "a@b.com" }`
  - Success (200): `{ "message": "Reset code sent" }` (may send email)
  - Error (404): `{ "message": "Account not found" }`
  - Rate-limit (429): `{ "message": "please Wait 55's" }` — frontend should show cooldown

- POST `/auth/verify-reset-code` — Verify reset code (email + code)
  - Request body: `{ "email": "a@b.com", "code": "123456" }`
  - Success (200): `{ "message": "Code verified" }` — proceed to reset
  - Error (400/401): `{ "message": "Invalid or expired code" }`

- POST `/auth/reset-password` — Set new password
  - Request body: `{ "email": "a@b.com", "newPassword": "secret" }` (or include code depending on your backend)
  - Success (200): `{ "message": "Password reset successfully" }`
  - Error (400): `{ "message": "Invalid request or password policy" }`

---

## ⚠️ Common Errors & Handling

- 400 Validation → show inline field errors if provided by backend
- 401 Unauthorized → redirect to `/login` and show toast
- 429 Too Many Requests (e.g., rapid login attempts) → show cooldown message
- Network errors → show "Service unavailable, try again later"

---

## 🔭 Future Scope

- Add `react-hook-form` + `zod` schemas for robust validation and DX
- Add E2E tests (Cypress / Playwright) for full auth flows
- Add avatar cropping and client-side compression
- Strengthen password UX (strength meter, suggestions)
- Add MFA (2FA) support

---

## 📝 Quick Manual Test Steps

1. Start backend + frontend with `VITE_BACKEND_URL` pointing to the backend.
2. Go to `/login` and try: invalid email, short password → confirm validation prevents submit.
3. Login with valid credentials → confirm redirect to `/home` and `authUser` set.
4. Click logout → confirm `authUser` cleared and redirected.
5. Visit `/profile` → update name/avatar and verify server update and UI reflects change.
6. Test Forgot Password flow:
   - Go to `/forget-password` and submit a valid email.
   - Check the email (or backend logs) for the reset code/link.
   - Verify the reset code at `/verify` (or via the Verify OTP page in reset mode) and set a new password at `/reset-password`.
   - Try logging in with the new password to confirm the flow.

---
