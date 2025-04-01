

function PrintPreview() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{ margin: '20px' }}>
      <h2>Ficha de Anamnese - Visualização de Impressão</h2>
      <p>
        Aqui você pode renderizar todos os campos de anamnese preenchidos para o paciente,
        formatados de modo que fiquem adequados para impressão.
      </p>
      <button onClick={handlePrint}>Imprimir</button>
    </div>
  )
}

export default PrintPreview
