// types.ts
// Tipos para el agente investigador

export interface PlanDeInvestigacion {
  preguntaOriginal: string;
  subpreguntas: string[];
}

export interface ResultadoInvestigacion {
  pregunta: string;
  respuesta: string;
}