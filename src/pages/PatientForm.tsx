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

// Firebase imports
import { db } from '../services/firebase';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';

import NavBar from '../components/Cabecalho';
import BasicInfoSection from '../components/BasicInfoSection';
import YesNoQuestionGroup from '../components/YesNoQuestionGroup';
import ResponsibilityTermSection from '../components/ResponsibilityTermSection';
import SessionHistory, { SessionData } from '../components/SessionHistory';

import './PatientForm.css';

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

interface FormData {
  id?: string;
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
    const fetchPatient = async () => {
      if (editIdentifier) {
        const docRef = doc(db, 'patients', editIdentifier);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const patientData = docSnap.data() as FormData;
          if (!patientData.sessoes) {
            patientData.sessoes = [];
          }
          setFormData({ ...patientData, id: docSnap.id });
        } else {
          console.error("No such patient!");
          navigate("/dashboard");
        }
      }
    };
    fetchPatient();
  }, [editIdentifier, navigate]);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { id, ...patientData } = formData; // remove 'id' from the data to be saved

    try {
      if (editIdentifier) {
        const patientRef = doc(db, "patients", editIdentifier);
        await updateDoc(patientRef, patientData);
      } else {
        await addDoc(collection(db, "patients"), patientData);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving patient data: ", error);
      // Optionally, show an error message to the user
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className="form-container">
        <NavBar />
        <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
          {editIdentifier ? "Editar Paciente" : "Cadastro de Paciente "}
        </Typography>
        <form onSubmit={handleSubmit} onKeyDown={preventEnterKeySubmission}>
          <section className="section">
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </section>
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
