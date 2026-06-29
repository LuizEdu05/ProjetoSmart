import type { ApptStatus } from "@/lib/global-appointments"

export interface StatusStyle {
  label: string
  color: string
  bg: string
}

export const STATUS_STYLE: Record<ApptStatus, StatusStyle> = {
  pending:       { label: "Pendente",    color: "#633806", bg: "#FEF3E2" },
  scheduled:     { label: "Agendado",   color: "#185FA5", bg: "#E6F1FB" },
  confirmed:     { label: "Confirmado", color: "#0F6E56", bg: "#E1F5EE" },
  rescheduled:   { label: "Reagendado", color: "#4C3B8C", bg: "#EEEAFA" },
  "in-progress": { label: "Em atend.",  color: "#1D6A84", bg: "#E3F4FA" },
  completed:     { label: "Realizado",  color: "#6b7c72", bg: "#e8ede9" },
  cancelled:     { label: "Cancelado",  color: "#791F1F", bg: "#FCEBEB" },
  "no-show":     { label: "Faltou",     color: "#854F0B", bg: "#FEF3E2" },
}

export function getStatusStyle(status: string): StatusStyle {
  return STATUS_STYLE[status as ApptStatus] ?? STATUS_STYLE.pending
}
