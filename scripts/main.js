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
function tratarTodasColunas() {
  const tokens = getInput().match(/\S+/g) || [];
  if (tokens.length === 0) {
    setOutput("⚠️ Nenhum dado detectado...");
    return;
  }
  const n = parseInt(prompt("Quantos campos por linha?", "6"), 10) || 6;
  const lines = [];
  for (let i = 0; i + n <= tokens.length; i += n) {
    lines.push(tokens.slice(i, i + n).join(';'));
  }
  setOutput(lines.join('\n'));
}

function tratarPorEspacos() {
  const lines = getInput().trim().split(/\r?\n/);
  const result = lines.map(line =>
    line.trim().split(/\s+/).join(';')
  );
  setOutput(result.join('\n'));
}

function tratarPorTab() {
  const lines = getInput().trim().split(/\r?\n/);
  const result = lines.map(line =>
    line.split('\t').join(';')
  );
  setOutput(result.join('\n'));
}

function autoExtrair() {
  const texto = getInput();
  const resultados = [];

  // 1. Regex com padrão fixo
  const padrao = /(\d{1,2})\s+(\d{1,3})\s+(\d{1,3},\d{2})\s+(\d{2,3}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{1,3})/g;
  const linhasRegex = [];
  let match;
  while ((match = padrao.exec(texto.replace(/\s+/g, ' '))) !== null) {
    linhasRegex.push(`${match[1]};${match[2]};${match[3]};${match[4]};${match[5]};${match[6]}`);
  }
  if (linhasRegex.length > 0) {
    resultados.push({ nome: "Regex Padrão Fixo", linhas: linhasRegex });
  }

  // 2. Separação por espaços
  const porEspacos = texto.trim().split(/\r?\n/).map(l =>
    l.trim().split(/\s+/).join(';')
  );
  if (porEspacos.length > 1 && porEspacos.some(l => l.includes(';'))) {
    resultados.push({ nome: "Separação por Espaços", linhas: porEspacos });
  }

  // 3. Separação por tabulação
  const porTab = texto.trim().split(/\r?\n/).map(l =>
    l.split('\t').join(';')
  );
  if (porTab.length > 1 && porTab.some(l => l.includes(';'))) {
    resultados.push({ nome: "Separação por Tab", linhas: porTab });
  }

  // 4. Agrupamento de tokens com \S+ por N colunas
  const tokens = texto.match(/\S+/g) || [];
  const n = 6;
  const blocos = [];
  for (let i = 0; i + n <= tokens.length; i += n) {
    blocos.push(tokens.slice(i, i + n).join(';'));
  }
  if (blocos.length > 0) {
    resultados.push({ nome: `Match \\S+ agrupado por ${n}`, linhas: blocos });
  }

  // Selecionar o melhor com mais linhas válidas
  resultados.sort((a, b) => b.linhas.length - a.linhas.length);

  if (resultados.length === 0) {
    setOutput("⚠️ Não foi possível extrair colunas. Verifica o texto ou tenta outro método.");
  } else {
    const melhor = resultados[0];
    setOutput(`🧠 Melhor resultado automático: ${melhor.nome}\n\n` + melhor.linhas.join('\n'));
  }
}
function extrairDeTextoHTML() {
  const input = getInput();

  // Cria parser para HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  // Seleciona as linhas da tabela, conforme estrutura que mostraste
  const linhas = doc.querySelectorAll('.sortTable .betMiddle .colums');

  if (linhas.length === 0) {
    setOutput("⚠️ Não detectei estrutura da tabela no texto HTML colado.");
    return;
  }

  const resultado = [];

  linhas.forEach(ul => {
    // Extrai o texto de cada <li> e junta com ';'
    const cols = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());
    resultado.push(cols.join(';'));
  });

  setOutput(resultado.join('\n'));
}

