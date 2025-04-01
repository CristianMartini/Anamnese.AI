import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import NavBar from '../components/Cabecalho';

/**
 * Definições de tipos para Sessões e Paciente
 */
interface BodyMeasurements {
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

interface SessionData {
  id: string;
  dataSessao: string; 
  observacoesGerais: string;
  relatorioSessao: string;
  medidas: BodyMeasurements;
  createdAt: string;
}

interface Patient {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  dataNascimento: string; // "YYYY-MM-DD"

  // Agora em Condições de Saúde
  tratamentoAnterior: string;
  cirurgias: string;

  // Hábitos
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

  // Saúde
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

  // Condições do Paciente
  dor: string;
  celulite: string;
  gorduraLocalizada: string;
  estrias: string;
  hematomas: string;
  foliculite: string;
  afecoes: string;
  manchas: string;

  sessoes?: SessionData[];

  termoResponsabilidade: boolean;
  assinaturaProfissional: string;
  assinaturaCliente: string;

  [key: string]: any;
}

/**
 * Listas de perguntas somente-leitura (iguais às do formulário)
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

/**
 * Componente que exibe perguntas Sim/Não em modo somente leitura
 */
function YesNoQuestionGroupReadOnly({
  title,
  questions,
  patient
}: {
  title: string;
  questions: { label: string; name: string; requiresObservation?: boolean }[];
  patient: Patient;
}) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {questions.map((questionItem) => {
          const answerValue = patient[questionItem.name] || 'Não';
          const observationValue = patient[`${questionItem.name}Observacao`] || '';

          return (
            <Grid item xs={12} sm={6} md={3} key={questionItem.name}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {questionItem.label}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {answerValue}
              </Typography>
              {questionItem.requiresObservation && answerValue === 'Sim' && observationValue && (
                <Typography variant="subtitle2" sx={{ ml: 1, mt: 0.5, fontStyle: 'italic' }}>
                  Observação: {observationValue}
                </Typography>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

/**
 * Exibição somente leitura do histórico de sessões
 */
function SessionHistoryReadOnly({ sessions }: { sessions: SessionData[] }) {
  if (!sessions || sessions.length === 0) {
    return (
      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Histórico de Sessões (0)
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontStyle: 'italic', textAlign: 'center', my: 2 }}
        >
          Nenhuma sessão registrada para este paciente.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Sessões ({sessions.length})
      </Typography>

      {sessions.map((sessionItem) => (
        <Box
          key={sessionItem.id}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            mb: 2,
            p: 2,
            backgroundColor: '#f9f9f9'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Sessão: {sessionItem.dataSessao}
          </Typography>

          {sessionItem.observacoesGerais && (
            <Box mt={1} mb={1}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Observações Gerais:
              </Typography>
              <Typography variant="body2">{sessionItem.observacoesGerais}</Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Relatório da Sessão:
          </Typography>
          <Typography variant="body2">{sessionItem.relatorioSessao}</Typography>

          {/* Medidas Corporais */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Medidas Corporais:
            </Typography>
            <Typography variant="body2">
              Peso: {sessionItem.medidas.peso} kg | Altura: {sessionItem.medidas.altura} cm
            </Typography>
            <Typography variant="body2">
              Busto: {sessionItem.medidas.busto} cm | Cintura: {sessionItem.medidas.cintura} cm | Quadril: {sessionItem.medidas.quadril} cm
            </Typography>
            <Typography variant="body2">
              Braço Direito: {sessionItem.medidas.bracoDireito} cm | Braço Esquerdo: {sessionItem.medidas.bracoEsquerdo} cm
            </Typography>
            <Typography variant="body2">
              Perna Direita: {sessionItem.medidas.pernaDireita} cm | Perna Esquerda: {sessionItem.medidas.pernaEsquerda} cm
            </Typography>
            <Typography variant="body2">
              Culote: {sessionItem.medidas.culote} cm
            </Typography>
            <Typography variant="body2">
              Flanco Direito: {sessionItem.medidas.flancoDireito} cm | Flanco Esquerdo: {sessionItem.medidas.flancoEsquerdo} cm
            </Typography>
            <Typography variant="body2">
              Panturrilha Direita: {sessionItem.medidas.panturrilhaDireita} cm | Panturrilha Esquerda: {sessionItem.medidas.panturrilhaEsquerda} cm
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  fontSize: 16,
  },
});

function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const foundPatient = storedPatients.find((p: any) => p.id === id);
      if (foundPatient) {
        if (!foundPatient.sessoes) {
          foundPatient.sessoes = [];
        }
        setPatient(foundPatient);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Carregando...</Typography>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Paciente não encontrado</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className="form-container">
        <NavBar />

        <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
          Detalhes do Paciente
        </Typography>

        <Box sx={{ mt: 3 }}>
          {/* Seção: Dados Básicos */}
          <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Dados Básicos</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  value={patient.nome}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  value={patient.telefone}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  label="Endereço"
                  value={patient.endereco}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                {/* Exibindo a data no modo "read-only" */}
                <TextField
                  label="Data de Nascimento"
                  type="date"
                  value={patient.dataNascimento || ''}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Condições de Saúde */}
          <YesNoQuestionGroupReadOnly
            title="Condições de Saúde"
            questions={healthQuestions}
            patient={patient}
          />

          {/* Condições do Paciente */}
          <YesNoQuestionGroupReadOnly
            title="Condições do Paciente"
            questions={patientConditionsQuestions}
            patient={patient}
          />

          {/* Hábitos e Estilo de Vida */}
          <YesNoQuestionGroupReadOnly
            title="Hábitos e Estilo de Vida"
            questions={habitosQuestions}
            patient={patient}
          />

          {/* Histórico de Sessões (somente leitura) */}
          <SessionHistoryReadOnly sessions={patient.sessoes || []} />

          {/* Termo de Responsabilidade */}
          <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 3 }}>
            <Typography variant="h5" gutterBottom>Termo de Responsabilidade</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!patient.termoResponsabilidade}
                  disabled
                />
              }
              label="Estou ciente e de acordo com todas as informações acima relacionadas."
            />
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assinatura do Profissional"
                  value={patient.assinaturaProfissional}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assinatura do Cliente"
                  value={patient.assinaturaCliente}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/patient-form?edit=${patient.id}`)}
              sx={{ mr: 2 }}
            >
              Editar
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>
              Voltar
            </Button>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default PatientDetail;
