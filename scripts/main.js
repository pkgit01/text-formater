function getInput() {
  return document.getElementById('input').value;
}

function setOutput(text) {
  document.getElementById('output').textContent = text;
}

function resetOutput() {
  setOutput('');
}

function formatTabsToSemicolon() {
  const result = getInput().replace(/\t/g, ';');
  setOutput(result);
}

function formatTabsToComma() {
  const result = getInput().replace(/\t/g, ',');
  setOutput(result);
}

function formatSpacesToSemicolon() {
  const result = getInput().replace(/ +/g, ';');
  setOutput(result);
}

function formatSpacesToComma() {
  const result = getInput().replace(/ +/g, ',');
  setOutput(result);
}

function removeExtraSpaces() {
  const result = getInput()
    .replace(/ {2,}/g, ' ')
    .replace(/\t+/g, ' ')
    .trim();
  setOutput(result);
}

function splitLinesToColumns() {
  const lines = getInput().split(/\r?\n/);
  const result = lines.join('; ');
  setOutput(result);
}

function copyOutput() {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert('Texto copiado!'))
    .catch(err => alert('Erro ao copiar: ' + err));
}

function tratarTabelaColada() {
  const input = getInput().replace(/\n/g, '');

  // Remove cabeçalhos como "NúmerosNúmero de saídas..."
  const textoLimpo = input.replace(/^.*?\*/, ''); // remove tudo até ao asterisco

  const padrao = /(\d{1,2})(\d{1,3},\d{2})(\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(\d{1,3})/g;

  const linhas = [];
  let match;
  while ((match = padrao.exec(textoLimpo)) !== null) {
    linhas.push(`${match[1]};${match[2]};${match[3]};${match[4]};${match[5]}`);
  }

  if (linhas.length === 0) {
    setOutput("⚠️ Não foram encontrados padrões válidos. Verifica se os dados têm o seguinte formato:\n\n[NUMERO][VALOR][##/####][DD/MM/AAAA][AUSÊNCIA]");
  } else {
    setOutput(linhas.join('\n'));
  }
}

