// SessionHistory.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
  Collapse,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import BodyMeasurementsSection, { BodyMeasurements } from './BodyMeasurementsSection';

/**
 * Interface que representa uma sessão do paciente.
 */
export interface SessionData {
  id: string;
  dataSessao: string; // "YYYY-MM-DD" (data local do paciente)
  observacoesGerais: string;
  relatorioSessao: string;
  medidas: BodyMeasurements;
  createdAt: string; // Armazenado em ISO (UTC) para ordenação
}

/**
 * Propriedades do componente SessionHistory.
 */
interface SessionHistoryProps {
  sessions: SessionData[];
  onAddSession: (session: SessionData) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession: (updatedSession: SessionData) => void;
}

/**
 * Retorna a data de hoje (local) em formato YYYY-MM-DD.
 * Evita o uso de toISOString(), que gera UTC e pode "pular" para o dia seguinte.
 */
function getLocalTodayStringYYYYMMDD(): string {
  const now = new Date();
  const year = now.getFullYear();
  // getMonth() retorna 0..11
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converte "YYYY-MM-DD" para "DD/MM/YYYY".
 * Caso a string não seja válida, retorna como está.
 */
function formatDateToBrazilianStandard(isoDateString: string): string {
  if (!isoDateString || isoDateString.length < 10) {
    return isoDateString; // Se não for o formato esperado, retorna inalterado.
  }
  const [year, month, day] = isoDateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Componente SessionHistory: gerencia o histórico de sessões (CRUD).
 * - dataSessao em formato local ("YYYY-MM-DD")
 * - Exibe em formato brasileiro ("DD/MM/YYYY").
 * - createdAt segue em UTC para ordenação, se desejado.
 */
const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
  onUpdateSession
}) => {
  /**
   * Estado inicial de medidas corporais
   */
  const initialMeasurements: BodyMeasurements = {
    peso: '',
    altura: '',
    busto: '',
    cintura: '',
    quadril: '',
    bracoDireito: '',
    bracoEsquerdo: '',
    pernaDireita: '',
    pernaEsquerda: '',
    culote: '',
    flancoDireito: '',
    flancoEsquerdo: '',
    panturrilhaDireita: '',
    panturrilhaEsquerda: ''
  };

  /**
   * Estado para criação de nova sessão
   */
  const [newSessionState, setNewSessionState] = useState<Omit<SessionData, 'id' | 'createdAt'>>({
    // Usa a data local de hoje no formato YYYY-MM-DD
    dataSessao: getLocalTodayStringYYYYMMDD(),
    observacoesGerais: '',
    relatorioSessao: '',
    medidas: { ...initialMeasurements }
  });

  /**
   * Controle de expandir/colapsar e edição
   */
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [editSessionId, setEditSessionId] = useState<string | null>(null);

  /**
   * Dados de edição (formulário de edição)
   */
  const [editFormData, setEditFormData] = useState<Omit<SessionData, 'id' | 'createdAt'>>({
    dataSessao: '',
    observacoesGerais: '',
    relatorioSessao: '',
    medidas: { ...initialMeasurements }
  });

  /**
   * Lida com mudanças nos campos (data, relatório, observações) ao criar nova sessão
   */
  function handleNewSessionInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setNewSessionState((previous) => ({ ...previous, [name]: value }));
  }

  /**
   * Lida com mudanças nas medidas (nova sessão)
   */
  function handleNewSessionMeasurementsChange(field: keyof BodyMeasurements, value: string) {
    setNewSessionState((previous) => ({
      ...previous,
      medidas: {
        ...previous.medidas,
        [field]: value
      }
    }));
  }

  /**
   * Adicionar efetivamente a nova sessão
   */
  function handleAddNewSession() {
    if (!newSessionState.dataSessao || !newSessionState.relatorioSessao) {
      return;
    }
    // Cria o objeto completo da sessão
    const sessionToAdd: SessionData = {
      ...newSessionState,
      id: Date.now().toString(),
      // createdAt no UTC ou local, a critério do projeto; iremos usar UTC para ordenação
      createdAt: new Date().toISOString()
    };
    onAddSession(sessionToAdd);

    // Reseta o estado para próxima sessão
    setNewSessionState({
      dataSessao: getLocalTodayStringYYYYMMDD(),
      observacoesGerais: '',
      relatorioSessao: '',
      medidas: { ...initialMeasurements }
    });
  }

  /**
   * Inicia o modo de edição para determinada sessão
   */
  function handleEditSessionClick(sessionItem: SessionData) {
    setEditSessionId(sessionItem.id);
    setEditFormData({
      dataSessao: sessionItem.dataSessao,
      observacoesGerais: sessionItem.observacoesGerais,
      relatorioSessao: sessionItem.relatorioSessao,
      medidas: { ...sessionItem.medidas }
    });
  }

  /**
   * Lida com mudanças nos campos (data, relatório, observações) no modo de edição
   */
  function handleEditChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setEditFormData((previous) => ({ ...previous, [name]: value }));
  }

  /**
   * Lida com mudanças nas medidas (modo de edição)
   */
  function handleEditMeasurementsChange(field: keyof BodyMeasurements, value: string) {
    setEditFormData((previous) => ({
      ...previous,
      medidas: {
        ...previous.medidas,
        [field]: value
      }
    }));
  }

  /**
   * Salva a sessão editada
   */
  function handleSaveEdit() {
    if (!editSessionId) {
      return;
    }
    const updatedSession: SessionData = {
      id: editSessionId,
      // Mantemos createdAt original ou criamos um novo
      createdAt: sessions.find((s) => s.id === editSessionId)?.createdAt || new Date().toISOString(),
      ...editFormData
    };
    onUpdateSession(updatedSession);
    setEditSessionId(null);
  }

  /**
   * Cancela a edição
   */
  function handleCancelEdit() {
    setEditSessionId(null);
  }

  /**
   * Alterna expandir/colapsar
   */
  function toggleExpand(sessionId: string) {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  }

  /**
   * Ordena as sessões pela data de criação (createdAt), da mais recente p/ mais antiga
   */
  const orderedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
        Histórico de Sessões
      </Typography>

      {/* Caixa para criar uma nova sessão */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          p: 3,
          mb: 4,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Nova Sessão
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data da Sessão"
              type="date"
              name="dataSessao"
              value={newSessionState.dataSessao}
              onChange={handleNewSessionInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Relatório da Sessão"
              name="relatorioSessao"
              value={newSessionState.relatorioSessao}
              onChange={handleNewSessionInputChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observações Gerais"
              name="observacoesGerais"
              value={newSessionState.observacoesGerais}
              onChange={handleNewSessionInputChange}
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9' }}
            />
          </Grid>

          <Grid item xs={12}>
            <BodyMeasurementsSection
              measurements={newSessionState.medidas}
              onChange={handleNewSessionMeasurementsChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewSession}
            startIcon={<AddIcon />}
            disabled={!newSessionState.dataSessao || !newSessionState.relatorioSessao}
            sx={{ backgroundColor: '#4a90e2', '&:hover': { backgroundColor: '#357ABD' } }}
          >
            Adicionar Sessão
          </Button>
        </Box>
      </Box>

      {/* Exibição da lista de sessões */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          p: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Histórico de Sessões ({orderedSessions.length})
        </Typography>

        {orderedSessions.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', my: 2 }}
          >
            Nenhuma sessão registrada para este paciente.
          </Typography>
        ) : (
          <List>
            {orderedSessions.map((sessionItem) => {
              const isEditing = editSessionId === sessionItem.id;
              // Converte dataSessao "YYYY-MM-DD" para "DD/MM/YYYY"
              const formattedDate = formatDateToBrazilianStandard(sessionItem.dataSessao);

              return (
                <React.Fragment key={sessionItem.id}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <Card sx={{ width: '100%', boxShadow: 'none' }}>
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              Sessão: {formattedDate}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: 'right' }}>
                            <IconButton onClick={() => toggleExpand(sessionItem.id)}>
                              {expandedSessionId === sessionItem.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                            {!isEditing && (
                              <IconButton
                                color="secondary"
                                onClick={() => handleEditSessionClick(sessionItem)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => onDeleteSession(sessionItem.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>

                        <Collapse in={expandedSessionId === sessionItem.id}>
                          <Box sx={{ mt: 2 }}>
                            {isEditing ? (
                              /* Formulário de edição */
                              <Box
                                sx={{
                                  border: '1px solid #ddd',
                                  p: 3,
                                  borderRadius: 2,
                                  backgroundColor: '#f9f9f9'
                                }}
                              >
                                <Grid container spacing={3}>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Data da Sessão"
                                      type="date"
                                      name="dataSessao"
                                      value={editFormData.dataSessao}
                                      onChange={handleEditChange}
                                      InputLabelProps={{ shrink: true }}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <TextField
                                      label="Relatório da Sessão"
                                      name="relatorioSessao"
                                      value={editFormData.relatorioSessao}
                                      onChange={handleEditChange}
                                      multiline
                                      rows={4}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <TextField
                                      label="Observações Gerais"
                                      name="observacoesGerais"
                                      value={editFormData.observacoesGerais}
                                      onChange={handleEditChange}
                                      multiline
                                      rows={2}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <BodyMeasurementsSection
                                      measurements={editFormData.medidas}
                                      onChange={handleEditMeasurementsChange}
                                    />
                                  </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveEdit}
                                    startIcon={<SaveIcon />}
                                    sx={{
                                      mr: 2,
                                      backgroundColor: '#4a90e2',
                                      '&:hover': { backgroundColor: '#357ABD' }
                                    }}
                                  >
                                    Salvar
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleCancelEdit}
                                    startIcon={<CloseIcon />}
                                  >
                                    Cancelar
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              /* Exibição somente leitura */
                              <Box>
                                {sessionItem.observacoesGerais && (
                                  <Box mb={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                      Observações Gerais:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      {sessionItem.observacoesGerais}
                                    </Typography>
                                  </Box>
                                )}

                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                  Relatório:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                  {sessionItem.relatorioSessao}
                                </Typography>

                                {sessionItem.medidas && (
                                  <Box mt={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                                      Medidas Corporais:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Peso: {sessionItem.medidas.peso} kg | Altura: {sessionItem.medidas.altura} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Busto: {sessionItem.medidas.busto} cm | Cintura: {sessionItem.medidas.cintura} cm | Quadril: {sessionItem.medidas.quadril} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Braço Direito: {sessionItem.medidas.bracoDireito} cm | Braço Esquerdo: {sessionItem.medidas.bracoEsquerdo} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Perna Direita: {sessionItem.medidas.pernaDireita} cm | Perna Esquerda: {sessionItem.medidas.pernaEsquerda} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Culote: {sessionItem.medidas.culote} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Flanco Direito: {sessionItem.medidas.flancoDireito} cm | Flanco Esquerdo: {sessionItem.medidas.flancoEsquerdo} cm
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                      Panturrilha Direita: {sessionItem.medidas.panturrilhaDireita} cm | Panturrilha Esquerda: {sessionItem.medidas.panturrilhaEsquerda} cm
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        </Collapse>
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
};

export default SessionHistory;
