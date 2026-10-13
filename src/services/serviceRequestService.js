import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { generateRequestNumber } from '../utils/helpers'
import { normalizeTimestamp, snapshotToRecord } from './firestoreUtils'
import { buildRoleNotification, buildUserNotification } from './notificationService'

const requestCollection = collection(db, 'serviceRequests')

const createPickupCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const randomValues = new Uint8Array(11)
  crypto.getRandomValues(randomValues)
  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join('')
}

const normalizeRequest = (snapshot) => {
  const request = snapshotToRecord(snapshot)
  return { ...request, createdAt: normalizeTimestamp(request.createdAt) }
}

export const serviceRequestService = {
  async getRequests() {
    const snapshot = await getDocs(requestCollection)
    return snapshot.docs.map(normalizeRequest)
  },

  async getRequestsByStudent(studentId) {
    const snapshot = await getDocs(query(requestCollection, where('ownerUid', '==', studentId)))
    return snapshot.docs.map(normalizeRequest)
  },

  async createRequest(data) {
    const requestData = {
      ownerUid: data.studentId,
      studentId: data.studentId,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterPhone: data.requesterPhone,
      studentNumber: data.studentNumber,
      description: data.description,
      status: 'submitted',
      remarks: '',
      createdAt: serverTimestamp(),
    }
    const reference = doc(requestCollection)
    const request = {
      ...requestData,
      requestNumber: generateRequestNumber(),
    }
    const notification = buildRoleNotification({
      audienceRole: 'teacher',
      title: 'New student service request',
      message: `${data.requesterName} submitted a request for ${data.serviceName}.`,
      type: 'service_request_submitted',
      requestId: reference.id,
    })
    const batch = writeBatch(db)
    batch.set(reference, request)
    batch.set(notification.reference, notification.data)
    await batch.commit()
    return {
      success: true,
      request: { ...request, id: reference.id, createdAt: new Date().toISOString() },
    }
  },

  async issuePickupCode(id) {
    const reference = doc(db, 'serviceRequests', id)
    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference)
      if (!snapshot.exists()) return { success: false, message: 'Request not found.' }

      const currentRequest = snapshotToRecord(snapshot)
      if (currentRequest.status !== 'forwarded_to_admin' || currentRequest.pickupCode) {
        return { success: false, message: 'A pickup code can only be generated once for a request forwarded by a teacher.' }
      }

      const pickupCode = createPickupCode()
      const serviceName = currentRequest.serviceName || 'Service'
      const notification = buildUserNotification({
        userId: currentRequest.ownerUid,
        title: `${serviceName} is ready for pickup`,
        message: `Your request${currentRequest.requestNumber ? ` ${currentRequest.requestNumber}` : ''} is approved. Show pickup code ${pickupCode} at the college storeroom to collect your document.`,
        type: 'service_request_status',
        requestId: id,
        serviceName,
        status: 'approved',
        requestNumber: currentRequest.requestNumber || '',
        pickupCode,
      })

      transaction.update(reference, {
        status: 'approved',
        pickupCode,
        pickupCodeCreatedAt: serverTimestamp(),
      })
      transaction.set(notification.reference, notification.data)
      return { success: true, request: { ...currentRequest, status: 'approved', pickupCode } }
    })
  },

  async forwardRequestToAdmin(id, teacher, reviewNote = '') {
    const reference = doc(db, 'serviceRequests', id)
    const snapshot = await getDoc(reference)
    if (!snapshot.exists()) return { success: false, message: 'Request not found.' }
    if (snapshot.data().status !== 'submitted') {
      return { success: false, message: 'Only submitted requests can be forwarded.' }
    }

    const handoff = {
      status: 'forwarded_to_admin',
      forwardedAt: serverTimestamp(),
      forwardedBy: teacher.uid,
      forwardedByName: teacher.name || '',
      teacherReviewNote: reviewNote.trim(),
      teacherReviewedAt: serverTimestamp(),
      teacherReviewedBy: teacher.uid,
      teacherReviewedByName: teacher.name || '',
    }
    const notification = buildRoleNotification({
      audienceRole: 'admin',
      title: 'Teacher forwarded a service request',
      message: `${teacher.name || 'A teacher'} forwarded ${snapshot.data().serviceName} from ${snapshot.data().requesterName || 'a student'}.`,
      type: 'service_request_forwarded',
      requestId: id,
    })
    const batch = writeBatch(db)
    batch.update(reference, handoff)
    batch.set(notification.reference, notification.data)
    await batch.commit()
    return { success: true }
  },
}

export const getRequests = serviceRequestService.getRequests.bind(serviceRequestService)
export const getRequestsByStudent = serviceRequestService.getRequestsByStudent.bind(serviceRequestService)
export const createRequest = serviceRequestService.createRequest.bind(serviceRequestService)
export const issuePickupCode = serviceRequestService.issuePickupCode.bind(serviceRequestService)
export const forwardRequestToAdmin = serviceRequestService.forwardRequestToAdmin.bind(serviceRequestService)
