async function buscar() {
  const termo = document.getElementById('busca').value;
  if (!termo) return;

  const res = await fetch(`http://localhost:3000/api/busca?query=${encodeURIComponent(termo)}`);
  const dados = await res.json();

  const container = document.getElementById('resultados');
  container.innerHTML = "";

  dados.resultados.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.titulo}" />
      <div class="info">
        <h3>${item.titulo}</h3>
        <div class="plataformas">
          ${item.plataformas.map(p => `<img title="${p.nome}" src="${p.logo}" />`).join('')}
        </div>
        <button class="btn-assistir" onclick="abrir('${item.link}')">Assistir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function abrir(url) {
  const overlay = document.getElementById('overlay');
  const iframe = document.getElementById('iframe-player');
  overlay.style.display = 'flex';
  iframe.src = url;
}

function fecharModal() {
  const overlay = document.getElementById('overlay');
  const iframe = document.getElementById('iframe-player');
  overlay.style.display = 'none';
  iframe.src = '';
}