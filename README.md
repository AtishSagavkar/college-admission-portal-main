# CampusConnect Student Portal

A production-style college admission and student services portal built with React, Vite, Tailwind CSS, React Router DOM, and Lucide React.

## Features
- Public home, about, admissions, services, and contact pages
- Student login and registration flow with demo accounts
- Role-based access for student, admin, and teacher users
- Admission application dashboard and application tracking
- Course-wise fee display
- Teacher document verification and administrator admission decisions
- Student profile and service request management
- Admin dashboard for students, applications, services, and settings
- Firebase Authentication and Firestore for accounts and records; Cloudinary for admission documents

## Run Locally
```bash
npm install
npm run dev
```

## Firebase Setup
1. Create a Firebase project and register a Web app.
2. Enable Email/Password under Authentication and create a Firestore database.
3. Copy `.env.example` to `.env.local` and fill in the Firebase Web app values and the Cloudinary cloud name / unsigned upload preset. Configure the preset to allow PDF, JPG, and PNG uploads with a 10 MB limit.
4. Install and sign in to the Firebase CLI, then deploy the checked-in rules:
	```bash
	npx firebase-tools login
	npx firebase-tools deploy --only firestore:rules --project school-portal-f2230
	```
5. Restart the Vite server after changing `.env.local`.

If an earlier version deployed admission payment functions, remove those old cloud functions after signing in:
```bash
npx firebase-tools functions:delete submitOfflineAdmissionPayment createRazorpayAdmissionOrder resumeRazorpayAdmissionOrder verifyRazorpayAdmissionPayment razorpayAdmissionWebhook reviewAdmissionFeePayment --region us-central1 --project school-portal-f2230 --force
```

New accounts use Firebase Authentication and get a `users/{uid}` profile. Applications, service requests, notifications, and uploaded application files are associated with that Firebase UID. Existing localStorage demo data is not migrated automatically.

## Course Fees
Course fees are displayed as information only and configured in `src/data/courseFees.js`:

| Course | Total fee (INR) |
| --- | ---: |
| B.Sc Computer Science | 150000 |
| BCA | 100000 |
| B.Com | 90000 |
| B.A | 80000 |
| B.Sc | 120000 |

Application documents upload directly to Cloudinary using the unsigned preset configured in `.env.local`. The app does not collect admission payments.

Admin and teacher permissions require trusted Firebase custom claims (`role: "admin"` or `role: "teacher"`). Set claims only with the Firebase Admin SDK from a trusted environment; never add role assignment to browser code. Users need to sign out and back in after claims change.

To provision a staff role from a trusted machine with Google Application Default Credentials configured:
```bash
npm --prefix admin-tools install
npm --prefix admin-tools run set-role -- staff@example.com admin
```
Use `teacher` instead of `admin` for faculty. Keep Admin SDK credentials out of this repository and the browser app.

## Production Build
```bash
npm run build
```

## Tech Notes
The UI uses service modules to keep Firebase data access separate from page components. User-owned records are keyed by Firebase Authentication UID and protected by the checked-in Firestore rules. Admission documents are uploaded to Cloudinary.
