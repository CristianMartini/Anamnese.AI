import fs from 'fs'
import path from 'path'

// Define o caminho para o arquivo de dados
const dataFilePath = path.join(__dirname, '../data/patients.json')

/**
 * Inicializa o arquivo de dados caso não exista.
 */
function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    const defaultData = { patients: [] }
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf-8')
  }
}

/**
 * Carrega o array de pacientes do arquivo JSON.
 */
export function loadPatients(): any[] {
  initDataFile()
  try {
    const content = fs.readFileSync(dataFilePath, 'utf-8')
    const data = JSON.parse(content)
    return data.patients || []
  } catch (error) {
    console.error('Erro ao ler ou interpretar o arquivo patients.json:', error)
    return []
  }
}

/**
 * Salva o array de pacientes no arquivo JSON.
 */
export function savePatients(patients: any[]): void {
  const data = { patients }
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log('Dados salvos com sucesso em:', dataFilePath)
  } catch (error) {
    console.error('Erro ao salvar os dados no arquivo patients.json:', error)
  }
}
