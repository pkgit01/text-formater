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
  const padrao = /(\d{1,2})(\d{1,3},\d{2})(\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(\d{1,3})/g;

  const linhas = [];
  const matches = [...input.matchAll(padrao)];

  for (const m of matches) {
    linhas.push(`${m[1]};${m[2]};${m[3]};${m[4]};${m[5]}`);
  }

  if (linhas.length === 0) {
    alert("Não foi possível extrair colunas. Verifica o texto ou adapta o padrão.");
  } else {
    setOutput(linhas.join('\n'));
  }
}
