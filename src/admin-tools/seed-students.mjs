import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const count = Number(process.argv[2] || 10)

const courseOptions = [
  'B.Tech Computer Science',
  'BBA',
  'MBA',
  'B.Com',
  'B.Sc Computer Science',
]

const firstNames = [
  'Aarav', 'Diya', 'Vihaan', 'Ananya', 'Kabir',
  'Meera', 'Rohan', 'Ishita', 'Aditya', 'Saanvi',
  'Arjun', 'Pooja', 'Yash', 'Nisha', 'Riya',
]

const lastNames = [
  'Sharma', 'Patel', 'Verma', 'Reddy', 'Nair',
  'Singh', 'Iyer', 'Gupta', 'Khan', 'Joshi',
  'Bhatt', 'Desai', 'Kapoor', 'Das', 'Mishra',
]

const generatePhone = (index) => `9${String(100000000 + index).slice(0, 9)}`

const projectId = process.env.FIREBASE_PROJECT_ID || 'school-portal-f2230'
const serviceAccountPath = fileURLToPath(new URL('./school-portal-f2230-firebase-adminsdk-fbsvc-47bc262370.json', import.meta.url))
initializeApp({ credential: cert(serviceAccountPath), projectId })

const auth = getAuth()
const db = getFirestore()

const created = []

for (let i = 1; i <= count; i += 1) {
  const firstName = firstNames[(i - 1) % firstNames.length]
  const lastName = lastNames[(i - 1) % lastNames.length]
  const fullName = `${firstName} ${lastName}`
  const email = `student${i}@demo.edu`
  const uid = `demo-student-${i}`
  const course = courseOptions[(i - 1) % courseOptions.length]

  const user = await auth.getUserByEmail(email).catch(() => null)

  let firebaseUid = uid
  if (!user) {
    const createdUser = await auth.createUser({
      uid: firebaseUid,
      email,
      emailVerified: true,
      password: '123456',
      displayName: fullName,
      disabled: false,
    })
    firebaseUid = createdUser.uid
  } else {
    firebaseUid = user.uid
  }

  await auth.setCustomUserClaims(firebaseUid, { role: 'student' })

  const userDoc = db.collection('users').doc(firebaseUid)
  const userData = {
    uid: firebaseUid,
    name: fullName,
    email,
    phone: generatePhone(i),
    role: 'student',
    profile: {
      fullName,
      email,
      phone: generatePhone(i),
      dateOfBirth: '2004-05-12',
      gender: i % 2 === 0 ? 'Female' : 'Male',
      bloodGroup: ['O+', 'A+', 'B+', 'AB+'][i % 4],
      nationality: 'Indian',
      category: ['General', 'OBC', 'SC', 'ST'][i % 4],
      address: `${i} Demo Street, City Center`,
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '41100' + (i % 10),
      tenthSchool: `School ${i}`,
      tenthBoard: 'SSC',
      tenthPercentage: 85 + (i % 10),
      tenthPassingYear: 2022,
      twelfthCollege: `College ${i}`,
      twelfthBoard: 'HSC',
      twelfthPercentage: 80 + (i % 15),
      twelfthPassingYear: 2024,
    },
    createdAt: FieldValue.serverTimestamp(),
    admissionStatus: 'submitted',
    updatedAt: FieldValue.serverTimestamp(),
  }

  await userDoc.set(userData, { merge: true })

  const appId = `demo-app-${firebaseUid}`
  const applicationNumber = `APP-${String(1000 + i).padStart(4, '0')}`

  await db.collection('applications').doc(appId).set({
    id: appId,
    applicationNumber,
    ownerUid: firebaseUid,
    studentId: firebaseUid,
    status: 'submitted',
    remarks: 'Demo application submitted.',
    submittedAt: FieldValue.serverTimestamp(),
    personalInfo: {
      fullName,
      dateOfBirth: '2004-05-12',
      gender: userData.profile.gender,
      bloodGroup: userData.profile.bloodGroup,
      nationality: 'Indian',
      category: userData.profile.category,
    },
    contactInfo: {
      email,
      phone: generatePhone(i),
      alternatePhone: generatePhone(i + 20),
      address: userData.profile.address,
      city: userData.profile.city,
      state: userData.profile.state,
      pincode: userData.profile.pincode,
    },
    academicInfo: {
      tenthSchool: userData.profile.tenthSchool,
      tenthBoard: userData.profile.tenthBoard,
      tenthPercentage: userData.profile.tenthPercentage,
      tenthPassingYear: userData.profile.tenthPassingYear,
      twelfthCollege: userData.profile.twelfthCollege,
      twelfthBoard: userData.profile.twelfthBoard,
      twelfthPercentage: userData.profile.twelfthPercentage,
      twelfthPassingYear: userData.profile.twelfthPassingYear,
    },
    courseInfo: {
      preferredCourse: course,
      secondPreference: courseOptions[(i + 1) % courseOptions.length],
    },
    documents: [],
    history: [
      {
        status: 'submitted',
        changedBy: 'Student',
        changedAt: new Date().toISOString(),
        remarks: 'Application submitted successfully.',
      },
    ],
  }, { merge: true })

  created.push({ uid: firebaseUid, email, fullName, applicationNumber })
}

console.log(`Created ${created.length} demo students and applications.`)
for (const item of created) {
  console.log(`${item.fullName} | ${item.email} | ${item.applicationNumber}`)
}
