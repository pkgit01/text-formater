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
  const input = getInput()
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const padrao = /(\d{1,2})\s+(\d{1,3})\s+(\d{1,3},\d{2})\s+(\d{2,3}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{1,3})/g;

  const linhas = [];
  let match;

  while ((match = padrao.exec(input)) !== null) {
    linhas.push(`${match[1]};${match[2]};${match[3]};${match[4]};${match[5]};${match[6]}`);
  }

  if (linhas.length === 0) {
    setOutput("⚠️ Não foi possível extrair colunas. Verifica se os dados têm espaços visíveis entre eles ou adapta o padrão.");
  } else {
    setOutput(linhas.join('\n'));
  }
}
