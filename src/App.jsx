```jsx
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useOutletContext,
} from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'
import StudentLayout from './components/layout/StudentLayout'
import TeacherLayout from './components/layout/TeacherLayout'

import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

import AccessDenied from './pages/auth/AccessDenied'
import ForgotPassword from './pages/auth/ForgotPassword'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminApplicationsPage from './pages/admin/Applications'
import StudentsPage from './pages/admin/StudentsPage'
import ServiceRequestsPage from './pages/admin/ServiceRequestsPage'
import TeachersPage from './pages/admin/TeachersPage'
import StudentDetailsPage from './pages/admin/StudentDetailsPage'

import About from './pages/public/About'
import Admissions from './pages/public/Admissions'
import Contact from './pages/public/Contact'
import Home from './pages/public/Home'
import NotFound from './pages/public/NotFound'
import Services from './pages/public/Services'

import AdmissionForm from './pages/student/AdmissionForm'
import ApplicationDetails from './pages/student/ApplicationDetails'
import ApplicationStatus from './pages/student/ApplicationStatus'
import Notifications from './pages/student/Notifications'
import ServiceDetails from './pages/student/ServiceDetails'
import ServiceRequests from './pages/student/ServiceRequests'
import ServicesPage from './pages/student/Services'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherReviewQueue from './pages/teacher/TeacherReviewQueue'

import Spinner from './components/common/Spinner'

function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 border-4" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(currentUser?.role)
  ) {
    return <Navigate to="/access-denied" replace />
  }

  return <Outlet />
}

function AdmissionApprovedRoute() {
  const {
    applicationsLoading,
    hasApprovedAdmission,
    hasSubmittedApplication,
  } = useOutletContext()

  if (applicationsLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner className="h-8 w-8 border-4" />
      </div>
    )
  }

  if (!hasApprovedAdmission) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Services unlock after admission approval
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Once an admin approves your admission, you can request
          certificates, academic help, and other student services here.
        </p>

        <Link
          to={
            hasSubmittedApplication
              ? '/student/application'
              : '/student/admission'
          }
          className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {hasSubmittedApplication
            ? 'Check application status'
            : 'Complete admission application'}
        </Link>
      </div>
    )
  }

  return <Outlet />
}

function App() {
  return (
    <BrowserRouter basename="/college-admission-portal-main">
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="/access-denied"
              element={<AccessDenied />}
            />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<StudentLayout />}>
                <Route
                  path="/student/dashboard"
                  element={<StudentDashboard />}
                />
                <Route
                  path="/student/admission"
                  element={<AdmissionForm />}
                />
                <Route
                  path="/student/application"
                  element={<ApplicationStatus />}
                />
                <Route
                  path="/student/application/:id"
                  element={<ApplicationDetails />}
                />
                <Route
                  path="/student/profile"
                  element={<StudentProfile />}
                />

                <Route element={<AdmissionApprovedRoute />}>
                  <Route
                    path="/student/services"
                    element={<ServicesPage />}
                  />
                  <Route
                    path="/student/service/:id"
                    element={<ServiceDetails />}
                  />
                  <Route
                    path="/student/requests"
                    element={<ServiceRequests />}
                  />
                </Route>

                <Route
                  path="/student/notifications"
                  element={<Notifications />}
                />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="/admin/applications"
                  element={<AdminApplicationsPage />}
                />
                <Route
                  path="/admin/applications/:id"
                  element={<ApplicationDetails />}
                />
                <Route
                  path="/admin/students"
                  element={<StudentsPage />}
                />
                <Route
                  path="/admin/students/:id"
                  element={<StudentDetailsPage />}
                />
                <Route
                  path="/admin/service-requests"
                  element={<ServiceRequestsPage />}
                />
                <Route
                  path="/admin/services"
                  element={<AdminServicesPage />}
                />
                <Route
                  path="/admin/teachers"
                  element={<TeachersPage />}
                />
                <Route
                  path="/admin/settings"
                  element={<AdminSettingsPage />}
                />
              </Route>
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route element={<TeacherLayout />}>
                <Route
                  path="/teacher/dashboard"
                  element={<TeacherDashboard />}
                />
                <Route
                  path="/teacher/applications"
                  element={<AdminApplicationsPage teacherView />}
                />
                <Route
                  path="/teacher/reviews"
                  element={<TeacherReviewQueue />}
                />
                <Route
                  path="/teacher/service-requests"
                  element={<TeacherReviewQueue />}
                />
                <Route
                  path="/teacher/students"
                  element={<StudentsPage basePath="/teacher/students" />}
                />
                <Route
                  path="/teacher/students/:id"
                  element={<StudentDetailsPage />}
                />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```
