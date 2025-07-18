// 📦 Utilidades básicas de entrada e saída
function getInput() {
  return document.getElementById('input').value;
}

function setOutput(text) {
  document.getElementById('output').textContent = text;
}

function resetOutput() {
  setOutput('');
}

function copyOutput() {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert('Texto copiado!'))
    .catch(err => alert('Erro ao copiar: ' + err));
}

// 🔁 Substituições simples
function formatTabsToSemicolon() {
  setOutput(getInput().replace(/\t/g, ';'));
}

function formatTabsToComma() {
  setOutput(getInput().replace(/\t/g, ','));
}

function formatSpacesToSemicolon() {
  setOutput(getInput().replace(/ +/g, ';'));
}

function formatSpacesToComma() {
  setOutput(getInput().replace(/ +/g, ','));
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
  setOutput(lines.join('; '));
}

// 📑 Tratamento de colagens com padrão conhecido
function tratarTabelaColada() {
  const input = getInput().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
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
  if (tokens.length === 0) return setOutput("⚠️ Nenhum dado detectado...");
  const n = parseInt(prompt("Quantos campos por linha?", "6"), 10) || 6;
  const lines = [];
  for (let i = 0; i < tokens.length; i += n) {
    lines.push(tokens.slice(i, i + n).join(';'));
  }
  setOutput(lines.join('\n'));
}

// 🧱 Separações simples
function tratarPorEspacos() {
  const lines = getInput().trim().split(/\r?\n/);
  const result = lines.map(line => line.trim().split(/\s+/).join(';'));
  setOutput(result.join('\n'));
}

function tratarPorTab() {
  const lines = getInput().trim().split(/\r?\n/);
  const result = lines.map(line => line.split('\t').join(';'));
  setOutput(result.join('\n'));
}

// 🔍 Tratamento de colagem compacta com cabeçalho
function parseCompactTable(texto) {
  const match = texto.trim().match(/^([^\d]+)(\d.*)$/s);
  if (!match) return null;

  const cabecalho = match[1]
    .replace(/([a-zà-ú])([A-ZÁ-Ú])/g, '$1\t$2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/ +/g, ' ')
    .replace(/ %/g, '%')
    .replace(/ \*/g, '*')
    .split(/\t+/);

  const dados = match[2].match(/(\d{3}\/\d{4}|\d{2}\/\d{2}\/\d{4}|\d+,\d+|\d+)/g);
  if (!dados || dados.length % cabecalho.length !== 0) return null;

  const linhas = [cabecalho.join(';')];
  for (let i = 0; i < dados.length; i += cabecalho.length) {
    linhas.push(dados.slice(i, i + cabecalho.length).join(';'));
  }
  return linhas;
}

function formatarTabelaCompacta() {
  const linhas = parseCompactTable(getInput());
  setOutput(linhas ? linhas.join('\n') : '⚠️ Formato não reconhecido ou número de dados incompatível.');
}

// 🧠 AutoExtração heurística
function autoExtrair() {
  const texto = getInput();
  const resultados = [];

  const linhasCompactas = parseCompactTable(texto);
  if (linhasCompactas) resultados.push({ nome: "Colagem Compacta Sem Separadores", linhas: linhasCompactas });

  const linhasRegex = [];
  const padrao = /(\d{1,2})\s+(\d{1,3})\s+(\d{1,3},\d{2})\s+(\d{2,3}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{1,3})/g;
  let match;
  while ((match = padrao.exec(texto.replace(/\s+/g, ' '))) !== null) {
    linhasRegex.push(`${match[1]};${match[2]};${match[3]};${match[4]};${match[5]};${match[6]}`);
  }
  if (linhasRegex.length > 0) resultados.push({ nome: "Regex Padrão Fixo", linhas: linhasRegex });

  const porEspacos = texto.trim().split(/\r?\n/).map(l => l.trim().split(/\s+/).join(';'));
  if (porEspacos.length > 1 && porEspacos.some(l => l.includes(';'))) resultados.push({ nome: "Separação por Espaços", linhas: porEspacos });

  const porTab = texto.trim().split(/\r?\n/).map(l => l.split('\t').join(';'));
  if (porTab.length > 1 && porTab.some(l => l.includes(';'))) resultados.push({ nome: "Separação por Tab", linhas: porTab });

  const tokens = texto.match(/\S+/g) || [];
  const n = 6;
  const blocos = [];
  for (let i = 0; i < tokens.length; i += n) {
    blocos.push(tokens.slice(i, i + n).join(';'));
  }
  if (blocos.length > 0) resultados.push({ nome: `Match \\S+ agrupado por ${n}`, linhas: blocos });

  resultados.sort((a, b) => b.linhas.length - a.linhas.length);
  setOutput(resultados.length === 0 ? "⚠️ Não foi possível extrair colunas." : `🧠 Melhor resultado automático: ${resultados[0].nome}\n\n` + resultados[0].linhas.join('\n'));
}

// 🌐 Extração de estrutura HTML
function extrairDeTextoHTML() {
  const input = getInput();
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  const linhas = doc.querySelectorAll('.sortTable .betMiddle .colums');

  if (linhas.length === 0) return setOutput("⚠️ Não detectei estrutura da tabela no texto HTML colado.");

  const resultado = Array.from(linhas).map(ul => {
    const cols = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());
    return cols.join(';');
  });

  setOutput(resultado.join('\n'));
}

// 🖼️ Tabela HTML interativa
function gerarTabela() {
  const texto = getInput().trim();
  const sep = document.getElementById('separator').value;
  const nCols = Math.max(1, parseInt(document.getElementById('numCols').value) || 6);

  let tokens;
  if (sep === 'space') tokens = texto.match(/\S+/g) || [];
  else if (sep === 'tab') tokens = texto.split(/\t+/);
  else if (sep === 'semicolon') tokens = texto.split(';');
  else if (sep === 'comma') tokens = texto.split(',');

  const rows = [];
  for (let i = 0; i < tokens.length; i += nCols) {
    rows.push(tokens.slice(i, i + nCols));
  }

  let html = '<table border="1" cellpadding="5" style="border-collapse: collapse;">';
  rows.forEach(row => {
    html += '<tr>' + row.map(cell => `<td contenteditable="true">${cell.trim()}</td>`).join('') + '</tr>';
  });
  html += '</table>';

  document.getElementById('preview').innerHTML = html;
}
