"use client"

// Medical records system: prontuário eletrônico, prescrições e pedidos de exame

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  clinicId: string
  clinicName: string
  appointmentId?: string
  dateISO: string
  chiefComplaint: string   // queixa principal
  history: string          // história da moléstia atual
  physicalExam: string     // exame físico
  diagnosis: string        // diagnóstico (CID opcional)
  treatment: string        // conduta / tratamento
  observations: string     // observações gerais
  createdAt: string
  updatedAt: string
}

export interface MedicationItem {
  name: string
  dosage: string
  frequency: string
  duration: string
  notes: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorCrm: string
  clinicId: string
  clinicName: string
  appointmentId?: string
  dateISO: string
  medications: MedicationItem[]
  observations: string
  createdAt: string
}

export interface ExamRequest {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorCrm: string
  clinicId: string
  appointmentId?: string
  dateISO: string
  exams: string[]
  urgency: "routine" | "urgent"
  clinicalIndication: string
  createdAt: string
}

const RECORDS_KEY    = "sc_medical_records"
const PRESCRIP_KEY   = "sc_prescriptions"
const EXAMS_KEY      = "sc_exam_requests"

// ── Medical Records ───────────────────────────────────────────────────────────
export function getAllRecords(): MedicalRecord[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(RECORDS_KEY) || "[]") }
  catch { return [] }
}

export function getRecordsByPatient(patientId: string): MedicalRecord[] {
  return getAllRecords().filter(r => r.patientId === patientId)
}

export function getRecordsByDoctor(doctorId: string): MedicalRecord[] {
  return getAllRecords().filter(r => r.doctorId === doctorId)
}

export function getRecordsByClinic(clinicId: string): MedicalRecord[] {
  return getAllRecords().filter(r => r.clinicId === clinicId)
}

export function addMedicalRecord(r: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">): MedicalRecord {
  const list = getAllRecords()
  const now = new Date().toISOString()
  const rec: MedicalRecord = { ...r, id: "mr" + Date.now(), createdAt: now, updatedAt: now }
  list.push(rec)
  localStorage.setItem(RECORDS_KEY, JSON.stringify(list))
  return rec
}

export function updateMedicalRecord(updated: MedicalRecord): MedicalRecord {
  const list = getAllRecords().map(r => r.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : r)
  localStorage.setItem(RECORDS_KEY, JSON.stringify(list))
  return updated
}

// ── Prescriptions ─────────────────────────────────────────────────────────────
export function getAllPrescriptions(): Prescription[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(PRESCRIP_KEY) || "[]") }
  catch { return [] }
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return getAllPrescriptions().filter(p => p.patientId === patientId)
}

export function getPrescriptionsByDoctor(doctorId: string): Prescription[] {
  return getAllPrescriptions().filter(p => p.doctorId === doctorId)
}

export function addPrescription(p: Omit<Prescription, "id" | "createdAt">): Prescription {
  const list = getAllPrescriptions()
  const presc: Prescription = { ...p, id: "rx" + Date.now(), createdAt: new Date().toISOString() }
  list.push(presc)
  localStorage.setItem(PRESCRIP_KEY, JSON.stringify(list))
  return presc
}

// ── Exam Requests ─────────────────────────────────────────────────────────────
export function getAllExamRequests(): ExamRequest[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(EXAMS_KEY) || "[]") }
  catch { return [] }
}

export function getExamsByPatient(patientId: string): ExamRequest[] {
  return getAllExamRequests().filter(e => e.patientId === patientId)
}

export function getExamsByDoctor(doctorId: string): ExamRequest[] {
  return getAllExamRequests().filter(e => e.doctorId === doctorId)
}

export function addExamRequest(e: Omit<ExamRequest, "id" | "createdAt">): ExamRequest {
  const list = getAllExamRequests()
  const req: ExamRequest = { ...e, id: "ex" + Date.now(), createdAt: new Date().toISOString() }
  list.push(req)
  localStorage.setItem(EXAMS_KEY, JSON.stringify(list))
  return req
}

// ── Seed demo records for dr1 / patient p6 ───────────────────────────────────
export function seedDemoMedicalRecords(clinicId: string) {
  if (typeof window === "undefined") return
  const existing = getAllRecords()
  if (existing.some(r => r.clinicId === clinicId)) return

  const record: MedicalRecord = {
    id: "mr_demo1",
    patientId: "p6",
    patientName: "Marcos Souza",
    doctorId: "dr3",
    doctorName: "Dr. Lucas Peixoto",
    clinicId,
    clinicName: "Clínica Saúde & Vida",
    appointmentId: "demo6",
    dateISO: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    chiefComplaint: "Dor no joelho direito há 2 semanas após atividade física.",
    history: "Paciente refere início de dor após corrida. Piora com flexão e descida de escadas. Sem trauma direto.",
    physicalExam: "Joelho direito: leve edema, sem instabilidade ligamentar. Manobras de McMurray e Lachman negativas. Linha articular dolorosa à palpação.",
    diagnosis: "Condropatia patelofemoral direita (M22.4)",
    treatment: "Repouso relativo, crioterapia 3x/dia. Anti-inflamatório por 5 dias. Encaminhamento para fisioterapia. Retorno em 30 dias.",
    observations: "Paciente orientado sobre importância do repouso e fisioterapia.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }

  const prescription: Prescription = {
    id: "rx_demo1",
    patientId: "p6",
    patientName: "Marcos Souza",
    doctorId: "dr3",
    doctorName: "Dr. Lucas Peixoto",
    doctorCrm: "CRM/SC 34567",
    clinicId,
    clinicName: "Clínica Saúde & Vida",
    appointmentId: "demo6",
    dateISO: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    medications: [
      { name: "Nimesulida 100mg", dosage: "1 comprimido", frequency: "2x ao dia", duration: "5 dias", notes: "Tomar após as refeições" },
      { name: "Omeprazol 20mg", dosage: "1 cápsula", frequency: "1x ao dia em jejum", duration: "5 dias", notes: "Proteção gástrica" },
    ],
    observations: "Em caso de dor intensa ou piora do quadro, retornar imediatamente.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }

  const examRequest: ExamRequest = {
    id: "ex_demo1",
    patientId: "p6",
    patientName: "Marcos Souza",
    doctorId: "dr3",
    doctorName: "Dr. Lucas Peixoto",
    doctorCrm: "CRM/SC 34567",
    clinicId,
    appointmentId: "demo6",
    dateISO: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    exams: ["Raio-X joelho direito AP e perfil", "Ressonância magnética joelho direito"],
    urgency: "routine",
    clinicalIndication: "Dor patelofemoral sem melhora clínica. Avaliar comprometimento condral.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }

  localStorage.setItem(RECORDS_KEY, JSON.stringify([...existing, record]))
  const existingPrescrip = getAllPrescriptions()
  localStorage.setItem(PRESCRIP_KEY, JSON.stringify([...existingPrescrip, prescription]))
  const existingExams = getAllExamRequests()
  localStorage.setItem(EXAMS_KEY, JSON.stringify([...existingExams, examRequest]))
}
