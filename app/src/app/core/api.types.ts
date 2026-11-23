// Tipos de la API, sacados del contrato backend/openapi.json (npm run api:types).
import type { components } from '../api/schema';

type S = components['schemas'];
export type SessionView = S['SessionView'];
export type UserView = S['UserView'];
export type PetSummary = S['PetSummaryView'];
export type PetDetail = S['PetDetailView'];
export type PetList = S['PetListView'];
export type TestView = S['TestView'];
export type Question = S['QuestionView'];
export type AnswersView = S['AnswersView'];
export type CompatibilityList = S['CompatibilityListView'];
export type RequestView = S['RequestView'];
export type CurrentRequest = S['CurrentRequestView'];

/** Respuesta de error de toda la API. `NETWORK` y `TIMEOUT` los pone la app (sin conexión o sin respuesta). */
export interface ApiErrorBody {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}
