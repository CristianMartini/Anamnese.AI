import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
  Typography,
} from '@mui/material';

import NavBar from '../components/Cabecalho';
import BasicInfoSection from '../components/BasicInfoSection';
import YesNoQuestionGroup from '../components/YesNoQuestionGroup';
import ResponsibilityTermSection from '../components/ResponsibilityTermSection';
import SessionHistory, { SessionData } from '../components/SessionHistory';

import './PatientForm.css'; // Se tiver um CSS global ou adicional

/**
 * Definição do tema do Material UI
 */
const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    secondary: { main: '#ff9800' },
    error: { main: '#f44336' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  }
});

/**
 * Interface principal para o formulário do Paciente
 */
interface FormData {
  id?: string;
  nome: string;
  telefone: string;
  endereco: string;
  dataNascimento: string; // armazenado como "YYYY-MM-DD"

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
  alteracoesCardiacas: string;
  marcapasso: string;
  tabagista: string;
  gestante: string;
  alteracoesRenais: string;
  hasDescompensada: string;
  doencaPele: string;
  alteracoesMusculares: string;

  dor: string;
  celulite: string;
  gorduraLocalizada: string;
  estrias: string;
  hematomas: string;
  foliculite: string;
  afecoes: string;
  manchas: string;

  sessoes: SessionData[];
  termoResponsabilidade: boolean;
  assinaturaProfissional: string;
  assinaturaCliente: string;
  [key: string]: any;
}

/**
 * Estado inicial do formulário
 */
const initialState: FormData = {
  nome: "",
  telefone: "",
  endereco: "",
  dataNascimento: "",
  tratamentoAnterior: "Não",
  cirurgias: "Não",
  tomaAgua: "Não",
  meiasCinta: "Não",
  bebidasAlcoolicas: "Não",
  exposicaoSol: "Não",
  filtroSolar: "Não",
  qualidadeSono: "Não",
  atividadeFisica: "Não",
  protegeProteses: "Não",
  utilizaCremes: "Não",
  utilizaMedicamentos: "Não",
  possuiAlergias: "Não",
  boaAlimentacao: "Não",
  trombose: "Não",
  epilepsia: "Não",
  intestinoRegulado: "Não",
  alteracoesCardiacas: "Não",
  marcapasso: "Não",
  tabagista: "Não",
  gestante: "Não",
  alteracoesRenais: "Não",
  hasDescompensada: "Não",
  doencaPele: "Não",
  alteracoesMusculares: "Não",
  dor: "Não",
  celulite: "Não",
  gorduraLocalizada: "Não",
  estrias: "Não",
  hematomas: "Não",
  foliculite: "Não",
  afecoes: "Não",
  manchas: "Não",
  sessoes: [],
  termoResponsabilidade: false,
  assinaturaProfissional: "",
  assinaturaCliente: ""
};

/**
 * Perguntas de saúde
 * (Inclui "tratamentoAnterior" e "cirurgias")
 */
const healthQuestions = [
  { label: 'Tem ou teve trombose?', name: 'trombose', requiresObservation: true },
  { label: 'Tem epilepsia/convulsões?', name: 'epilepsia', requiresObservation: true },
  { label: 'Tem intestino regulado?', name: 'intestinoRegulado', requiresObservation: true },
  { label: 'Tem alterações cardíacas?', name: 'alteracoesCardiacas', requiresObservation: true },
  { label: 'Tem marcapasso?', name: 'marcapasso', requiresObservation: true },
  { label: 'É tabagista?', name: 'tabagista', requiresObservation: true },
  { label: 'Está gestante?', name: 'gestante', requiresObservation: true },
  { label: 'Alterações Renais?', name: 'alteracoesRenais', requiresObservation: true },
  { label: 'H.A.S. descompensada?', name: 'hasDescompensada', requiresObservation: true },
  { label: 'Doença de Pele?', name: 'doencaPele', requiresObservation: true },
  { label: 'Alterações Musculares ou Óssea?', name: 'alteracoesMusculares', requiresObservation: true },

  { label: 'Tem tratamento facial ou corporal anterior?', name: 'tratamentoAnterior', requiresObservation: true },
  { label: 'Cirurgias?', name: 'cirurgias', requiresObservation: true },
];

/**
 * Perguntas sobre condições do paciente
 */
const patientConditionsQuestions = [
  { label: 'Dor?', name: 'dor', requiresObservation: true },
  { label: 'Celulite?', name: 'celulite', requiresObservation: true },
  { label: 'Gordura Localizada?', name: 'gorduraLocalizada', requiresObservation: true },
  { label: 'Estrias?', name: 'estrias', requiresObservation: true },
  { label: 'Hematomas?', name: 'hematomas', requiresObservation: true },
  { label: 'Foliculite?', name: 'foliculite', requiresObservation: true },
  { label: 'Afecções?', name: 'afecoes', requiresObservation: true },
  { label: 'Manchas?', name: 'manchas', requiresObservation: true },
];

/**
 * Perguntas sobre hábitos e estilo de vida
 */
const habitosQuestions = [
  { label: 'Toma água regularmente?', name: 'tomaAgua', requiresObservation: true },
  { label: 'Usa meias ou cintas?', name: 'meiasCinta', requiresObservation: true },
  { label: 'Consome bebidas alcoólicas?', name: 'bebidasAlcoolicas', requiresObservation: true },
  { label: 'Exposição ao sol?', name: 'exposicaoSol', requiresObservation: true },
  { label: 'Usa filtro solar?', name: 'filtroSolar', requiresObservation: true },
  { label: 'Qualidade do sono?', name: 'qualidadeSono', requiresObservation: true },
  { label: 'Pratica atividade física?', name: 'atividadeFisica', requiresObservation: true },
  { label: 'Protege próteses?', name: 'protegeProteses', requiresObservation: true },
  { label: 'Utiliza cremes ou loções faciais e corporais?', name: 'utilizaCremes', requiresObservation: true },
  { label: 'Utiliza algum medicamento?', name: 'utilizaMedicamentos', requiresObservation: true },
  { label: 'Possui alergias?', name: 'possuiAlergias', requiresObservation: true },
  { label: 'Boa alimentação?', name: 'boaAlimentacao', requiresObservation: true },
];

/**
 * Função para impedir envio do formulário ao pressionar Enter
 */
function preventEnterKeySubmission(event: React.KeyboardEvent<HTMLFormElement>) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

function PatientForm() {
  const [formData, setFormData] = useState<FormData>(initialState);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIdentifier = searchParams.get('edit');

  useEffect(() => {
    if (editIdentifier) {
      const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const patientToEdit = storedPatients.find((p: any) => p.id === editIdentifier);
      if (patientToEdit) {
        if (!patientToEdit.sessoes) {
          patientToEdit.sessoes = [];
        }
        setFormData(patientToEdit);
      }
    }
  }, [editIdentifier]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  }

  function handleYesNoChange(name: string, value: string) {
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  // Sessões
  function handleAddSession(newSession: SessionData) {
    setFormData((previous) => ({
      ...previous,
      sessoes: [...previous.sessoes, newSession],
    }));
  }

  function handleDeleteSession(sessionId: string) {
    setFormData((previous) => ({
      ...previous,
      sessoes: previous.sessoes.filter((sessionItem) => sessionItem.id !== sessionId),
    }));
  }

  function handleUpdateSession(updated: SessionData) {
    setFormData((previous) => ({
      ...previous,
      sessoes: previous.sessoes.map((sessionItem) => (sessionItem.id === updated.id ? updated : sessionItem)),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let storedPatients = JSON.parse(localStorage.getItem("patients") || "[]");

    if (editIdentifier) {
      // Atualiza
      storedPatients = storedPatients.map((patientItem: any) =>
        (patientItem.id === editIdentifier ? { ...formData, id: editIdentifier } : patientItem)
      );
    } else {
      // Novo
      const newPatientObject = { id: uuidv4(), ...formData };
      storedPatients.push(newPatientObject);
    }

    localStorage.setItem("patients", JSON.stringify(storedPatients));
    navigate("/dashboard");
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className="form-container">
        <NavBar />

        <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
          {editIdentifier ? "Editar Paciente" : "Cadastro de Paciente "}
        </Typography>

        <form onSubmit={handleSubmit} onKeyDown={preventEnterKeySubmission}>
          {/* Seção: Dados Básicos */}
          <section className="section">
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </section>

          {/* Seção: Condições de Saúde */}
          <section className="section">
            <Typography variant="h5" align="center" gutterBottom>
              Condições de Saúde
            </Typography>
            <YesNoQuestionGroup
              questions={healthQuestions}
              formData={formData}
              onChange={handleYesNoChange}
            />
          </section>

          {/* Seção: Condições do Paciente */}
          <section className="section">
            <Typography variant="h5" align="center" gutterBottom>
              Condições do Paciente
            </Typography>
            <YesNoQuestionGroup
              questions={patientConditionsQuestions}
              formData={formData}
              onChange={handleYesNoChange}
            />
          </section>

          {/* Seção: Hábitos */}
          <section className="section">
            <Typography variant="h5" align="center" gutterBottom>
              Hábitos e Estilo de Vida
            </Typography>
            <YesNoQuestionGroup
              questions={habitosQuestions}
              formData={formData}
              onChange={handleYesNoChange}
            />
          </section>

          {/* Seção: Histórico de Sessões */}
          <section className="section">
            <Typography variant="h5" align="center" gutterBottom>
              Histórico de Sessões
            </Typography>
            <SessionHistory
              sessions={formData.sessoes}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
              onUpdateSession={handleUpdateSession}
            />
          </section>

          {/* Seção: Termo de Responsabilidade */}
          <section className="section">
            <Typography variant="h5" align="center" gutterBottom>
              Termo de Responsabilidade
            </Typography>
            <ResponsibilityTermSection
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          </section>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button type="submit" variant="contained" size="large">
              {editIdentifier ? "Atualizar" : "Salvar"}
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate("/dashboard")}>
              Voltar
            </Button>
          </Box>
        </form>
      </Paper>
    </ThemeProvider>
  );
}

export default PatientForm;
