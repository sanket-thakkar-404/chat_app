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

