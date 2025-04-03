import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  IconButton,
  Divider,
  Skeleton,
  Chip,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NavBar from '../components/Cabecalho';
import './PatientDetailPrint.css';

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
 * Listas de perguntas categorizadas
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
 * Utilitário para formatação de datas
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '—';

  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
};

/**
 * Calcula a idade com base na data de nascimento
 */
const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '';

  try {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age.toString();
  } catch (e) {
    return '';
  }
};

/**
 * Utilitário para calcular o IMC
 */
const calculateBMI = (peso: string, altura: string): string => {
  if (!peso || !altura) return '—';

  try {
    const weight = parseFloat(peso);
    const height = parseFloat(altura) / 100; // Convert cm to m
    const bmi = weight / (height * height);
    return bmi.toFixed(2);
  } catch (e) {
    return '—';
  }
};

/**
 * Utilitário para classificar o IMC
 */
const getBMIClassification = (bmi: string): { label: string; color: string } => {
  const bmiValue = parseFloat(bmi);

  if (isNaN(bmiValue)) return { label: '—', color: 'default' };
  if (bmiValue < 18.5) return { label: 'Abaixo do peso', color: 'warning' };
  if (bmiValue < 25) return { label: 'Peso normal', color: 'success' };
  if (bmiValue < 30) return { label: 'Sobrepeso', color: 'info' };
  if (bmiValue < 35) return { label: 'Obesidade Grau I', color: 'warning' };
  if (bmiValue < 40) return { label: 'Obesidade Grau II', color: 'error' };
  return { label: 'Obesidade Grau III', color: 'error' };
};

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
    <Accordion defaultExpanded className="question-accordion section-container">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title.toLowerCase().replace(/\s/g, '-')}-content`}
        id={`${title.toLowerCase().replace(/\s/g, '-')}-header`}
      >
        <Typography variant="h6" className="section-title">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {questions.map((questionItem) => {
            const answerValue = patient[questionItem.name] || 'Não';
            const observationValue = patient[`${questionItem.name}Observacao`] || '';
            const chipColor = answerValue === 'Sim' ? 'primary' : 'default';

            return (
              <Grid item xs={12} sm={6} md={4} key={questionItem.name} className="question-item" style={{ backgroundColor: "rgba(230, 240, 255, 0.5)", padding: "10px", borderRadius: "8px" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', flexGrow: 1 }} className="question-label">
                    {questionItem.label}
                  </Typography>
                  <Chip 
                    label={answerValue} 
                    color={chipColor} 
                    size="small" 
                    className="question-answer-chip"
                    sx={{ ml: 1 }}
                  />
                </Box>
                {questionItem.requiresObservation && answerValue === 'Sim' && observationValue && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      fontStyle: 'italic', 
                      backgroundColor: 'rgba(0,0,0,0.03)', 
                      p: 1, 
                      borderRadius: 1 
                    }} 
                    className="question-observation" style={{ backgroundColor: "rgba(240, 248, 255, 0.3)", padding: "6px", borderRadius: "6px", marginTop: "5px" }}
                  >
                    {observationValue}
                  </Typography>
                )}
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * Componente para tabela de comparação de medidas
 */
function MeasurementsComparisonTable({ sessions }: { sessions: SessionData[] }) {
  if (!sessions || sessions.length === 0) return null;
  
  // Pegue apenas as duas sessões mais recentes para comparação
  const recentSessions = [...sessions].sort((a, b) => 
    new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime()
  ).slice(0, 2);
  
  if (recentSessions.length < 2) return null;
  
  const current = recentSessions[0];
  const previous = recentSessions[1];
  
  // Função para calcular diferença entre medidas
  const calculateDifference = (current: string, previous: string): { value: string, improved: boolean | null } => {
    if (!current || !previous) return { value: '—', improved: null };
    
    try {
      const curr = parseFloat(current);
      const prev = parseFloat(previous);
      const diff = curr - prev;
      // Para medidas corporais, uma redução (valor negativo) é considerada uma melhoria
      return { 
        value: diff.toFixed(1), 
        improved: diff < 0
      };
    } catch (e) {
      return { value: '—', improved: null };
    }
  };
  
  // Definição das medidas a serem comparadas
  const measurementFields = [
    { label: 'Peso (kg)', field: 'peso' },
    { label: 'Busto (cm)', field: 'busto' },
    { label: 'Cintura (cm)', field: 'cintura' },
    { label: 'Quadril (cm)', field: 'quadril' },
    { label: 'Braço D/E (cm)', fields: ['bracoDireito', 'bracoEsquerdo'] },
    { label: 'Perna D/E (cm)', fields: ['pernaDireita', 'pernaEsquerda'] },
    { label: 'Flanco D/E (cm)', fields: ['flancoDireito', 'flancoEsquerdo'] },
    { label: 'Panturrilha D/E (cm)', fields: ['panturrilhaDireita', 'panturrilhaEsquerda'] },
  ];

  return (
    <Box className="measurements-comparison no-print" sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comparação de Medidas ({formatDate(current.dataSessao)} vs {formatDate(previous.dataSessao)})
      </Typography>
      <Box 
        sx={{ 
          border: '1px solidrgb(126, 105, 105)', 
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Grid container sx={{ backgroundColor: '#f5f5f5', p: 1 }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Medida</Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">Anterior</Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">Atual</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">Diferença</Typography>
          </Grid>
        </Grid>
        
        {measurementFields.map((item) => {
          if (item.fields) {
            // Para pares de medidas (direita/esquerda)
            const currentRight = current.medidas[item.fields[0] as keyof BodyMeasurements] || '—';
            const currentLeft = current.medidas[item.fields[1] as keyof BodyMeasurements] || '—';
            const previousRight = previous.medidas[item.fields[0] as keyof BodyMeasurements] || '—';
            const previousLeft = previous.medidas[item.fields[1] as keyof BodyMeasurements] || '—';
            
            const diffRight = calculateDifference(currentRight, previousRight);
            const diffLeft = calculateDifference(currentLeft, previousLeft);
            
            return (
              <Grid container key={item.label} sx={{ borderTop: '1px solid #e0e0e0', p: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2">{item.label}</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">{previousRight}/{previousLeft}</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">{currentRight}/{currentLeft}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color={diffRight.improved === true ? 'success.main' : diffRight.improved === false ? 'error.main' : 'text.primary'}
                  >
                    {diffRight.value} / 
                    <span 
                      style={{ 
                        color: diffLeft.improved === true ? 'green' : diffLeft.improved === false ? 'red' : 'inherit' 
                      }}
                    >
                      {diffLeft.value}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            );
          } else {
            // Para medidas simples
            const currentValue = current.medidas[item.field as keyof BodyMeasurements] || '—';
            const previousValue = previous.medidas[item.field as keyof BodyMeasurements] || '—';
            const diff = calculateDifference(currentValue, previousValue);
            
            return (
              <Grid container key={item.label} sx={{ borderTop: '1px solid #e0e0e0', p: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2">{item.label}</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">{previousValue}</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">{currentValue}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color={diff.improved === true ? 'success.main' : diff.improved === false ? 'error.main' : 'text.primary'}
                  >
                    {diff.value} {diff.improved === true ? '↓' : diff.improved === false ? '↑' : ''}
                  </Typography>
                </Grid>
              </Grid>
            );
          }
        })}
      </Box>
    </Box>
  );
}

/**
 * Exibição somente leitura do histórico de sessões
 */
function SessionHistoryReadOnly({ sessions }: { sessions: SessionData[] }) {
  if (!sessions || sessions.length === 0) {
    return (
      <Accordion defaultExpanded className="section-container sessions-history">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="session-history-content"
          id="session-history-header"
        >
          <Typography variant="h6" className="section-title">
            Histórico de Sessões (0)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', my: 2 }}
            className="no-sessions-message"
          >
            Nenhuma sessão registrada para este paciente.
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  // Ordenar sessões da mais recente para a mais antiga
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime()
  );

  return (
    <Accordion defaultExpanded className="section-container sessions-history">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="session-history-content"
        id="session-history-header"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" className="section-title">
            Histórico de Sessões ({sessions.length})
          </Typography>
          <Chip 
            label={`Última: ${formatDate(sortedSessions[0]?.dataSessao)}`}
            size="small"
            color="primary"
            sx={{ ml: 2 }}
            className="last-session-chip"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {sortedSessions.length > 1 && <MeasurementsComparisonTable sessions={sortedSessions} />}
        
        {sortedSessions.map((sessionItem, index) => {
          // Calcular IMC se há peso e altura
          const bmi = calculateBMI(sessionItem.medidas.peso, sessionItem.medidas.altura);
          const bmiClassification = getBMIClassification(bmi);
          
          return (
            <Box
              key={sessionItem.id}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                mb: 2,
                p: 0,
                backgroundColor: '#f9f9f9',
                overflow: 'hidden'
              }}
              className="session-item"
              data-session-index={index}
            >
              <Box sx={{ 
                backgroundColor: '#e3f2fd', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }} className="session-date">
                  Sessão: {formatDate(sessionItem.dataSessao)}
                </Typography>
                <Chip 
                  label={`IMC: ${bmi}`}
                  color={bmiClassification.color as any}
                  size="small"
                  sx={{ mr: 1 }}
                  className="bmi-indicator"
                />
              </Box>

              <Box sx={{ p: 2 }}>
                {sessionItem.observacoesGerais && (
                  <Box mt={1} mb={2} className="session-observations">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Observações Gerais:
                    </Typography>
                    <Typography variant="body2" sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                      {sessionItem.observacoesGerais}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                  Relatório da Sessão:
                </Typography>
                <Typography 
                  variant="body2" 
                  className="session-report"
                  sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}
                >
                  {sessionItem.relatorioSessao}
                </Typography>

                {/* Medidas Corporais */}
                <Box mt={2} className="body-measurements">
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Medidas Corporais:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Peso / Altura</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.peso || '—'} kg / {sessionItem.medidas.altura || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Busto / Cintura / Quadril</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.busto || '—'} / {sessionItem.medidas.cintura || '—'} / {sessionItem.medidas.quadril || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Braço D/E</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.bracoDireito || '—'} / {sessionItem.medidas.bracoEsquerdo || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Perna D/E</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.pernaDireita || '—'} / {sessionItem.medidas.pernaEsquerda || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Culote</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.culote || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Flanco D/E</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.flancoDireito || '—'} / {sessionItem.medidas.flancoEsquerdo || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Typography variant="caption" color="textSecondary">Panturrilha D/E</Typography>
                        <Typography variant="body2">
                          {sessionItem.medidas.panturrilhaDireita || '—'} / {sessionItem.medidas.panturrilhaEsquerda || '—'} cm
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * Componente para exibir o cabeçalho de impressão
 */
function PrintHeader({ patient }: { patient: Patient }) {
  const age = calculateAge(patient.dataNascimento);
  
  return (
    <Box className="print-header">
     

      <Box className="patient-header-info">
        <Typography variant="h5" className="patient-name">
          Paciente: {patient.nome}
        </Typography>
        <Typography variant="body1" className="patient-details">
          Data de Nascimento: {formatDate(patient.dataNascimento)}
          {age && ` (${age} anos)`}
        </Typography>
        <Typography variant="body1" className="patient-contact">
          Telefone: {patient.telefone}
        </Typography>
        <Typography variant="body1" className="patient-address">
          Endereço: {patient.endereco}
        </Typography>
      </Box>

      <Divider className="print-divider" />
    </Box>
  );
}

/**
 * Componente para exibir o rodapé de impressão
 */
function PrintFooter() {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <Box className="print-footer">
      <Divider className="print-divider" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2" className="print-date">
          Documento gerado em: {today}
        </Typography>
        
      </Box>
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
  },});

  function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (id) {
        const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        const found = storedPatients.find((p: Patient) => p.id === id);
        if (found) {
          found.sessoes ??= [];
          setPatient(found);
        }
        setLoading(false);
      }
    }, [id]);
  
    if (loading) {
      return (
        <Box textAlign="center" mt={5}>
          <Skeleton width="60%" height={30} />
        </Box>
      );
    }
  
    if (!patient) {
      return (
        <Box textAlign="center" mt={5}>
          <Typography variant="h5">Paciente não encontrado</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Voltar
          </Button>
        </Box>
      );
    }
  
    return (
      <ThemeProvider theme={theme}>
        <Paper className="form-container patient-detail-container">
          <Box ><NavBar /></Box>
  
          <Box className="detail-header no-print">
            <Typography variant="h6"></Typography>
            <Box>
              <Tooltip title="Imprimir ficha">
                <IconButton color="primary" onClick={() => window.print()}>
                  <InsertDriveFileIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar cadastro">
                <IconButton color="primary" onClick={() => navigate(`/patient-form?edit=${patient.id}`)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Voltar">
                <IconButton onClick={() => navigate('/dashboard')}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
  
          <Box className="patient-content">
            <PrintHeader patient={patient} />
  
            <YesNoQuestionGroupReadOnly
              title="Condições de Saúde"
              questions={healthQuestions}
              patient={patient}
            />
  
            <YesNoQuestionGroupReadOnly
              title="Condições do Paciente"
              questions={patientConditionsQuestions}
              patient={patient}
            />
  
            <YesNoQuestionGroupReadOnly
              title="Hábitos e Estilo de Vida"
              questions={habitosQuestions}
              patient={patient}
            />
  
            <SessionHistoryReadOnly sessions={patient.sessoes || []} />
  
            <Box className="section-container responsibility-term">
              <Typography variant="h5" className="section-title">
                Termo de Responsabilidade
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={!!patient.termoResponsabilidade} disabled />}
                label="Estou ciente e de acordo com todas as informações acima relacionadas."
              />
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Assinatura do Profissional"
                    value={patient.assinaturaProfissional}
                    fullWidth
                    disabled
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Assinatura do Cliente"
                    value={patient.assinaturaCliente}
                    fullWidth
                    disabled
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>
  
            <PrintFooter />
          </Box>
        </Paper>
      </ThemeProvider>
    );
  }
  
  export default PatientDetail;
  