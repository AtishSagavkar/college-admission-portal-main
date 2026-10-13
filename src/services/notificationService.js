import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { normalizeTimestamp, snapshotToRecord } from './firestoreUtils'

const notificationCollection = collection(db, 'notifications')

export const buildRoleNotification = ({ audienceRole, title, message, type, requestId, applicationId }) => ({
  reference: doc(notificationCollection),
  data: {
    audienceRole,
    title,
    message,
    type,
    ...(requestId ? { requestId } : {}),
    ...(applicationId ? { applicationId } : {}),
    read: false,
    createdAt: serverTimestamp(),
  },
})

export const buildUserNotification = ({ userId, title, message, type, requestId, applicationId, serviceName, status, requestNumber, pickupCode }) => ({
  reference: doc(notificationCollection),
  data: {
    ownerUid: userId,
    userId,
    title,
    message,
    type,
    ...(requestId ? { requestId } : {}),
    ...(applicationId ? { applicationId } : {}),
    ...(serviceName ? { serviceName } : {}),
    ...(status ? { status } : {}),
    ...(requestNumber ? { requestNumber } : {}),
    ...(pickupCode ? { pickupCode } : {}),
    read: false,
    createdAt: serverTimestamp(),
  },
})

export const notificationService = {
  async getNotifications() {
    const snapshot = await getDocs(notificationCollection)
    return snapshot.docs.map(snapshotToRecord)
  },

  async getNotificationsForUser(userId) {
    const snapshot = await getDocs(query(notificationCollection, where('ownerUid', '==', userId)))
    return snapshot.docs
      .map(snapshotToRecord)
      .map((item) => ({ ...item, createdAt: normalizeTimestamp(item.createdAt) }))
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  },

  subscribeToRoleNotifications(role, onNotifications, onError) {
    const notificationsQuery = query(notificationCollection, where('audienceRole', '==', role))
    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs
        .map(snapshotToRecord)
        .map((item) => ({ ...item, createdAt: normalizeTimestamp(item.createdAt) }))
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      onNotifications(notifications)
    }, onError)
  },

  subscribeToUserNotifications(userId, onNotifications, onError) {
    const notificationsQuery = query(notificationCollection, where('ownerUid', '==', userId))
    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs
        .map(snapshotToRecord)
        .map((item) => ({ ...item, createdAt: normalizeTimestamp(item.createdAt) }))
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      onNotifications(notifications)
    }, onError)
  },

  async addNotification({ userId, title, message, type = 'general' }) {
    const notification = {
      ownerUid: userId,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
    }
    const reference = await addDoc(notificationCollection, notification)
    return { ...notification, id: reference.id, createdAt: new Date().toISOString() }
  },

  async markAsRead(notificationId) {
    const reference = doc(db, 'notifications', notificationId)
    await updateDoc(reference, { read: true })
    return { success: true, notificationId }
  },
}

export const getNotifications = notificationService.getNotifications.bind(notificationService)
export const getNotificationsForUser = notificationService.getNotificationsForUser.bind(notificationService)
export const subscribeToRoleNotifications = notificationService.subscribeToRoleNotifications.bind(notificationService)
export const subscribeToUserNotifications = notificationService.subscribeToUserNotifications.bind(notificationService)
export const addNotification = notificationService.addNotification.bind(notificationService)
export const markAsRead = notificationService.markAsRead.bind(notificationService)
