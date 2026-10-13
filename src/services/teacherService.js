import { getApplications } from './applicationService'
import { getRequests } from './serviceRequestService'
import { getStudents } from './studentService'

export const teacherService = {
  async getTeacherDashboardData() {
    const [students, applications, requests] = await Promise.all([
      getStudents(),
      getApplications(),
      getRequests(),
    ])

    const reviewQueue = applications
      .filter((app) => ['submitted', 'under_review', 'documents_verified', 'teacher_approved'].includes(app.status))
      .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
      .slice(0, 6)
      .map((app) => ({
        id: app.id,
        studentId: app.studentId || app.ownerUid,
        name: app.personalInfo?.fullName || 'Student',
        email: app.contactInfo?.email || '',
        course: app.courseInfo?.preferredCourse || 'Not selected',
        status: app.status,
        submittedAt: app.submittedAt,
      }))

    return {
      totalStudents: students.length,
      applications: applications.length,
      pendingReviews: applications.filter((app) => ['submitted', 'under_review', 'documents_verified'].includes(app.status)).length,
      verifiedDocs: applications.filter((app) => app.status === 'documents_verified' || app.status === 'teacher_approved').length,
      serviceRequests: requests.filter((request) => ['submitted', 'processing', 'under_review'].includes(request.status)).length,
      reviewQueue,
    }
  },
}

export const getTeacherDashboardData = teacherService.getTeacherDashboardData.bind(teacherService)
