import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'

import { db } from '../lib/firebase'
import { generateApplicationNumber } from '../utils/helpers'
import { normalizeTimestamp, snapshotToRecord } from './firestoreUtils'
import { buildRoleNotification, buildUserNotification } from './notificationService'

const applicationCollection = collection(db, 'applications')

const normalizeApplication = (snapshot) => {
  const application = snapshotToRecord(snapshot)

  return {
    ...application,
    submittedAt: normalizeTimestamp(application.submittedAt),
  }
}

export const applicationService = {
  async getApplications() {
    const snapshot = await getDocs(applicationCollection)
    return snapshot.docs.map(normalizeApplication)
  },

  async getApplicationById(id) {
    const snapshot = await getDoc(
      doc(db, 'applications', id)
    )

    return snapshot.exists()
      ? normalizeApplication(snapshot)
      : null
  },

  async getApplicationsByUser(userId) {
    const snapshot = await getDocs(
      query(
        applicationCollection,
        where('ownerUid', '==', userId)
      )
    )

    return snapshot.docs.map(normalizeApplication)
  },

  async createApplication(data) {
    const applicationData = {
      applicationNumber: generateApplicationNumber(),
      ownerUid: data.userId,
      studentId: data.studentId,
      status: 'submitted',
      remarks: '',
      submittedAt: serverTimestamp(),

      personalInfo: data.personalInfo,
      contactInfo: data.contactInfo,
      academicInfo: data.academicInfo,
      courseInfo: data.courseInfo,

      documents: data.documents || [],

      history: [
        {
          status: 'submitted',
          changedBy: 'Student',
          changedAt: new Date().toISOString(),
          remarks: 'Application submitted successfully.',
        },
      ],
    }

    const reference = doc(applicationCollection)
    const teacherNotification = buildRoleNotification({
      audienceRole: 'teacher',
      title: 'New admission application needs document verification',
      message: `${data.personalInfo?.fullName || 'A student'} submitted ${applicationData.applicationNumber} for ${data.courseInfo?.preferredCourse || 'a course'}. Review the application documents.`,
      type: 'admission_application_submitted',
      applicationId: reference.id,
    })
    const batch = writeBatch(db)
    batch.set(reference, applicationData)
    batch.set(teacherNotification.reference, teacherNotification.data)
    await batch.commit()

    return {
      success: true,
      application: {
        ...applicationData,
        id: reference.id,
        submittedAt: new Date().toISOString(),
      },
    }
  },

  async updateApplicationStatus(
    id,
    status,
    changedBy = 'Admin',
    remarks = '',
    changedByUid = '',
  ) {
    const reference = doc(db, 'applications', id)

    try {
      const application = await runTransaction(
        db,
        async (transaction) => {
          const snapshot = await transaction.get(reference)

          if (!snapshot.exists()) {
            return null
          }

          const current = snapshot.data()
          const studentId = current.studentId || current.ownerUid
          const notificationCopy = {
            under_review: {
              title: 'Admission application under review',
              message: 'A teacher has started reviewing your admission application.',
            },
            teacher_approved: {
              title: 'Documents verified',
              message: 'Your documents have been verified. Your application is waiting for the final admission decision.',
            },
            approved: {
              title: 'Admission confirmed',
              message: 'Your admission application has been approved.',
            },
            rejected: {
              title: 'Admission application update',
              message: remarks || 'Your admission application was not approved. Contact the college for details.',
            },
          }[status] || {
            title: 'Admission application updated',
            message: `Your admission application status is now ${status.replace(/_/g, ' ')}.`,
          }

          const history = [
            ...(current.history || []),
            {
              status,
              changedBy,
              changedAt: new Date().toISOString(),
              remarks,
            },
          ]

          transaction.update(reference, {
            status,
            remarks,
            history,
            ...(status === 'teacher_approved'
              ? { teacherReviewedBy: changedByUid, teacherReviewedAt: new Date().toISOString() }
              : {}),
          })

          if (studentId) {
            transaction.update(doc(db, 'users', studentId), {
              admissionStatus: status,
              admissionApplicationId: id,
              updatedAt: serverTimestamp(),
            })

            const notification = buildUserNotification({
              userId: studentId,
              title: notificationCopy.title,
              message: notificationCopy.message,
              type: 'admission_status',
              applicationId: id,
              status,
            })
            transaction.set(notification.reference, notification.data)
          }

          if (status === 'teacher_approved') {
            const adminNotification = buildRoleNotification({
              audienceRole: 'admin',
              title: 'Application ready for final admission decision',
              message: `${current.personalInfo?.fullName || 'A student'} (${current.applicationNumber || id}) has passed document verification and is ready for the final admission decision.`,
              type: 'admission_ready_for_decision',
              applicationId: id,
            })
            transaction.set(adminNotification.reference, adminNotification.data)
          }

          return {
            ...current,
            id,
            status,
            remarks,
            history,
          }
        }
      )

      return application
        ? {
            success: true,
            application,
          }
        : {
            success: false,
            message: 'Application not found.',
          }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  async updateApplication(id, updates) {
    const reference = doc(db, 'applications', id)

    await updateDoc(reference, updates)

    const application =
      await this.getApplicationById(id)

    return application
      ? {
          success: true,
          application,
        }
      : {
          success: false,
          message: 'Application not found.',
        }
  },
}

export const getApplications =
  applicationService.getApplications.bind(applicationService)

export const getApplicationById =
  applicationService.getApplicationById.bind(applicationService)

export const getApplicationsByUser =
  applicationService.getApplicationsByUser.bind(applicationService)

export const createApplication =
  applicationService.createApplication.bind(applicationService)

export const updateApplicationStatus =
  applicationService.updateApplicationStatus.bind(applicationService)

export const updateApplication =
  applicationService.updateApplication.bind(applicationService)