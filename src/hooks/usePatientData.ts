
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { patients } from "../data/patients.json" assert { type: "json" };
// Removed the conflicting import for Patient

export interface BodyMeasurements {
  peso: string;
  altura: string;
  busto: string;
  cintura: string;
  quadril: string;
  bracoDireito: string;
  bracoEsquerdo: string;
  pernaDireita: string;
  pernaEsquerda: string;
  culote: string;
  flancoDireito: string;
  flancoEsquerdo: string;
  panturrilhaDireita: string;
  panturrilhaEsquerda: string;
}

export interface SessionData {
  id: string;
  dataSessao: string;
  observacoesGerais: string;
  relatorioSessao: string;
  medidas: BodyMeasurements;
  createdAt: string;
}

export interface Patient {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  tratamentoAnterior: string;
  cirurgias: string;
  tomaAgua: string;
  meiasCinta: string;
  bebidasAlcoolicas: string;
  exposicaoSol: string;
  filtroSolar: string;
  qualidadeSono: string;
  atividadeFisica: string;
  protegeProteses: string;
  utilizaCremes: string;
  utilizaMedicamentos: string;
  possuiAlergias: string;
  boaAlimentacao: string;
  trombose: string;
  epilepsia: string;
  intestinoRegulado: string;
  historicoSessoes: SessionData[];
}

export function usePatientData() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
      const found = patients.find((p: Patient) => p.id === id);
      setPatient(found || null);
    }, [id]);

    return { patient };
}
