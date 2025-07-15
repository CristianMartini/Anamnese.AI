import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  IconButton,
  List,
  ListItem,
  Card,
  CardContent,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

// Firebase imports
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import NavBar from "../components/Cabecalho";
import "./PatientDetailPrint.css";
import React from "react";

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
  sessoes?: SessionData[];
  termoResponsabilidade: boolean;
  assinaturaProfissional: string;
  assinaturaCliente: string;
  [key: string]: unknown;
}

const healthQuestions = [
  {
    label: "Tem ou teve trombose?",
    name: "trombose",
    requiresObservation: true,
  },
  {
    label: "Tem epilepsia/convulsões?",
    name: "epilepsia",
    requiresObservation: true,
  },
  {
    label: "Tem intestino regulado?",
    name: "intestinoRegulado",
    requiresObservation: true,
  },
  {
    label: "Tem alterações cardíacas?",
    name: "alteracoesCardiacas",
    requiresObservation: true,
  },
  { label: "Tem marcapasso?", name: "marcapasso", requiresObservation: true },
  { label: "É tabagista?", name: "tabagista", requiresObservation: true },
  { label: "Está gestante?", name: "gestante", requiresObservation: true },
  {
    label: "Alterações Renais?",
    name: "alteracoesRenais",
    requiresObservation: true,
  },
  {
    label: "H.A.S. descompensada?",
    name: "hasDescompensada",
    requiresObservation: true,
  },
  { label: "Doença de Pele?", name: "doencaPele", requiresObservation: true },
  {
    label: "Alterações Musculares ou Óssea?",
    name: "alteracoesMusculares",
    requiresObservation: true,
  },
  {
    label: "Tem tratamento facial ou corporal anterior?",
    name: "tratamentoAnterior",
    requiresObservation: true,
  },
  { label: "Cirurgias?", name: "cirurgias", requiresObservation: true },
];

const patientConditionsQuestions = [
  { label: "Dor?", name: "dor", requiresObservation: true },
  { label: "Celulite?", name: "celulite", requiresObservation: true },
  {
    label: "Gordura Localizada?",
    name: "gorduraLocalizada",
    requiresObservation: true,
  },
  { label: "Estrias?", name: "estrias", requiresObservation: true },
  { label: "Hematomas?", name: "hematomas", requiresObservation: true },
  { label: "Foliculite?", name: "foliculite", requiresObservation: true },
  { label: "Afecções?", name: "afecoes", requiresObservation: true },
  { label: "Manchas?", name: "manchas", requiresObservation: true },
];

const habitosQuestions = [
  {
    label: "Toma água regularmente?",
    name: "tomaAgua",
    requiresObservation: true,
  },
  {
    label: "Usa meias ou cintas?",
    name: "meiasCinta",
    requiresObservation: true,
  },
  {
    label: "Consome bebidas alcoólicas?",
    name: "bebidasAlcoolicas",
    requiresObservation: true,
  },
  {
    label: "Exposição ao sol?",
    name: "exposicaoSol",
    requiresObservation: true,
  },
  {
    label: "Usa filtro solar?",
    name: "filtroSolar",
    requiresObservation: true,
  },
  {
    label: "Qualidade do sono?",
    name: "qualidadeSono",
    requiresObservation: true,
  },
  {
    label: "Pratica atividade física?",
    name: "atividadeFisica",
    requiresObservation: true,
  },
  {
    label: "Protege próteses?",
    name: "protegeProteses",
    requiresObservation: true,
  },
  {
    label: "Utiliza cremes ou loções faciais e corporais?",
    name: "utilizaCremes",
    requiresObservation: true,
  },
  {
    label: "Utiliza algum medicamento?",
    name: "utilizaMedicamentos",
    requiresObservation: true,
  },
  {
    label: "Possui alergias?",
    name: "possuiAlergias",
    requiresObservation: true,
  },
  {
    label: "Boa alimentação?",
    name: "boaAlimentacao",
    requiresObservation: true,
  },
];

function YesNoQuestionGroupReadOnly({
  title,
  questions,
  patient,
}: {
  title: string;
  questions: { label: string; name: string; requiresObservation?: boolean }[];
  patient: Patient;
}) {
  return (
    <Box
      sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mt: 3 }}
      className="section-container"
    >
      <Typography variant="h6" gutterBottom className="section-title">
        {title}
      </Typography>
      <Grid container spacing={2}>
        {questions.map((questionItem) => {
          const answerValue = patient[questionItem.name] || "Não";
          const observationValue =
            patient[`${questionItem.name}Observacao`] || "";
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={questionItem.name}
              className="question-item"
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold" }}
                className="question-label"
              >
                {questionItem.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ ml: 1 }}
                className="question-answer"
              >
                {String(answerValue)}
              </Typography>
              {questionItem.requiresObservation &&
                answerValue === "Sim" &&
                observationValue && (
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 1, mt: 0.5, fontStyle: "italic" }}
                    className="question-observation"
                  >
                    Observação: {String(observationValue)}
                  </Typography>
                )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function SessionHistoryReadOnly({ sessions }: { sessions: SessionData[] }) {
  // Ordena as sessões pela data de criação (createdAt), da mais recente para a mais antiga
  const orderedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function formatDateToBrazilianStandard(isoDateString: string): string {
    if (!isoDateString || isoDateString.length < 10) {
      return isoDateString;
    }
    const [year, month, day] = isoDateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333", mb: 3 }}
      >
        Histórico de Sessões
      </Typography>
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          p: 3,
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Histórico de Sessões ({orderedSessions.length})
        </Typography>
        {orderedSessions.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontStyle: "italic", textAlign: "center", my: 2 }}
          >
            Nenhuma sessão registrada para este paciente.
          </Typography>
        ) : (
          <List>
            {orderedSessions.map((sessionItem) => {
              const formattedDate = formatDateToBrazilianStandard(
                sessionItem.dataSessao
              );
              return (
                <React.Fragment key={sessionItem.id}>
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <Card sx={{ width: "100%", boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          Sessão: {formattedDate}
                        </Typography>
                        {sessionItem.observacoesGerais && (
                          <Box mb={2}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "#333" }}
                            >
                              Observações Gerais:
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              {sessionItem.observacoesGerais}
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          Relatório:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {sessionItem.relatorioSessao}
                        </Typography>
                        {sessionItem.medidas && (
                          <Box mt={2}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                            >
                              Medidas Corporais:
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Peso: {sessionItem.medidas.peso} kg | Altura:{" "}
                              {sessionItem.medidas.altura} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Busto: {sessionItem.medidas.busto} cm | Cintura:{" "}
                              {sessionItem.medidas.cintura} cm | Quadril:{" "}
                              {sessionItem.medidas.quadril} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Braço Direito: {sessionItem.medidas.bracoDireito}{" "}
                              cm | Braço Esquerdo:{" "}
                              {sessionItem.medidas.bracoEsquerdo} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Perna Direita: {sessionItem.medidas.pernaDireita}{" "}
                              cm | Perna Esquerda:{" "}
                              {sessionItem.medidas.pernaEsquerda} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Culote: {sessionItem.medidas.culote} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Flanco Direito:{" "}
                              {sessionItem.medidas.flancoDireito} cm | Flanco
                              Esquerdo: {sessionItem.medidas.flancoEsquerdo} cm
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              Panturrilha Direita:{" "}
                              {sessionItem.medidas.panturrilhaDireita} cm |
                              Panturrilha Esquerda:{" "}
                              {sessionItem.medidas.panturrilhaEsquerda} cm
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}

function PrintFooter() {
  return null;
}

const theme = createTheme({
  palette: {
    primary: { main: "#4a90e2" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
  },
});

function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "patients", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const patientData = docSnap.data() as Omit<Patient, "id">;
            if (!patientData.sessoes) {
              patientData.sessoes = [];
            }
            setPatient({
              id: docSnap.id,
              ...(patientData as Omit<Patient, "id">),
            } as Patient);
          } else {
            console.error("No such patient!");
            setPatient(null);
          }
        } catch (error) {
          console.error("Error fetching patient: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPatient();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5">Carregando...</Typography>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5">Paciente não encontrado</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className="form-container patient-detail-container">
        <Box>
          <NavBar />
        </Box>
        <Box
          className="detail-header no-print"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Detalhes do Paciente
          </Typography>
          <IconButton
            color="primary"
            onClick={handlePrint}
            aria-label="imprimir"
            size="large"
            sx={{
              backgroundColor: "#eef5ff",
              "&:hover": { backgroundColor: "#dbeaff" },
            }}
          >
            <PrintIcon />
          </IconButton>
        </Box>
        <Box className="patient-content">
          <Box
            sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3 }}
            className="section-container basic-info"
          >
            <Typography variant="h5" gutterBottom className="section-title">
              Dados Básicos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  value={patient.nome}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="text-field-readonly"
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
                  className="text-field-readonly"
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
                  className="text-field-readonly"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Data de Nascimento"
                  type="date"
                  value={patient.dataNascimento || ""}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  className="text-field-readonly"
                />
              </Grid>
            </Grid>
          </Box>
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
          <Box
            sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mt: 3 }}
            className="section-container responsibility-term"
          >
            <Typography variant="h5" gutterBottom className="section-title">
              Termo de Responsabilidade
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!patient.termoResponsabilidade}
                  disabled
                  className="responsibility-checkbox"
                />
              }
              label="Estou ciente e de acordo com todas as informações acima relacionadas."
              className="responsibility-label"
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
                  className="signature-field"
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
                  className="signature-field"
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="print-only">
            <PrintFooter />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
            className="action-buttons no-print"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/patient-form?edit=${patient.id}`)}
              sx={{ mr: 2 }}
            >
              Editar
            </Button>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Voltar
            </Button>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default PatientDetail;
