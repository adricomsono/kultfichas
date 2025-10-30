const stats = {
  vida: { current: 26, max: 38 },
  maldicao: { current: 45, max: 100 }
};

// novos atributos — valores usados pelas rolagens
const atributos = {
  alma: 5,
  violencia: -2,
  fortitude: 2,
  reflexos: 1,
  vontade: 2,
  razao: 0,
  intuicao: 2,
  percepcao: 1,
  firmeza: 1,
  carisma: -1
};

// 🔹 Carrega valores salvos do localStorage (se existirem)
function loadStats() {
  const saved = localStorage.getItem("statusBars");
  if (saved) {
    const data = JSON.parse(saved);
    for (const key in stats) {
      if (data[key]) {
        stats[key].current = data[key].current;
        stats[key].max = data[key].max;
      }
    }
  }
}

// 🔹 Salva os valores atuais no localStorage
function saveStats() {
  localStorage.setItem("statusBars", JSON.stringify(stats));
}

// 🔹 Atualiza a barra e o texto exibido
function updateBar(id) {
  const container = document.getElementById(id);
  const bar = container.querySelector(".bar");
  const value = container.querySelector(".value");

  const { current, max } = stats[id];
  const percent = (current / max) * 100;

  bar.style.width = percent + "%";
  value.textContent = `${current} / ${max}`;

  // Cores dinâmicas opcionais (exemplo para VIDA)
  if (id === "vida") {
    if (percent > 70) bar.style.background = "#27ae60";       // verde
    else if (percent > 40) bar.style.background = "#f1c40f";  // amarelo
    else bar.style.background = "#c0392b";                    // vermelho
  }
}

// 🔹 Altera o valor (±1 ou ±5) e salva
function changeValue(id, delta) {
  const stat = stats[id];
  stat.current = Math.max(0, Math.min(stat.max, stat.current + delta));
  updateBar(id);
  saveStats(); // salva toda vez que muda
}

// 🔹 Reseta tudo e recarrega a página
function resetStats() {
  localStorage.removeItem("statusBars");
  window.location.reload();
}

// 🔹 Inicializa tudo quando a página é carregada
window.onload = () => {
  loadStats();
  Object.keys(stats).forEach(updateBar);
};


// ROLAGEM ATRIBUTOS

function rolarDado(bonus = 0, nome = "Atributo") {
    const dado = Math.floor(Math.random() * 20) + 1;
    const total = dado + bonus;

    const historico = document.getElementById("historico");
    historico.style.display = "block";

    const rolagemDiv = document.createElement("div");
    rolagemDiv.classList.add("rolagem");
    rolagemDiv.innerHTML = `<span><strong>${nome}:</strong> ${dado} + ${bonus} = <strong>${total}</strong></span>
<button class="fechar" onClick="this.parentElement.remove()">X</button>`;

    historico.prepend(rolagemDiv);

    rolagemDiv.querySelector(".fechar").onclick = function() {
        rolagemDiv.remove();
        if (historico.querySelectorAll(".rolagem").length === 0) {
            historico.style.display = "none";
        }
    };
}

function rolarGuaaja() {
    const historico = document.getElementById("historico");
    historico.style.display = "block";

    const rolagens = [
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1,
        Math.floor(Math.random() * 20) + 1
    ];
    const maior = Math.max(...rolagens);
    const totalAtaque = maior + atributos.alma;

    const dano1 = Math.floor(Math.random() * 6) + 1;
    const dano2 = Math.floor(Math.random() * 6) + 1;
    let danoTotal = dano1 + dano2 + atributos.alma;

    let multiplicador = 1;
    if (totalAtaque >= 14){
        danoTotal *= 3;
        multiplicador = 3;
    }

    const rolagemDiv = document.createElement("div");
    rolagemDiv.classList.add("rolagem");
    rolagemDiv.innerHTML = `<div><strong>Guaaja:</strong> <br>
    <span>Ataque: [${rolagens.join(", ")}] + ${atributos.alma} = <strong>${totalAtaque}</strong> <br>
    Dano: (${dano1} + ${dano2} + ${atributos.alma}) ${multiplicador > 1 ? `x${multiplicador}` : ''} = <strong>${danoTotal}</strong></span>
    </div>
    <button class="fechar" onClick="this.parentElement.remove()">X</button>`;
    historico.prepend(rolagemDiv);

    rolagemDiv.querySelector(".fechar").onclick = function() {
        rolagemDiv.remove();
        if (historico.querySelectorAll(".rolagem").length === 0) {
            historico.style.display = "none";
        }
    };
}

function rolarHabilidade(tipo){
    const historico = document.getElementById("historico");
    historico.style.display = "block";

    let rolagens = [];
    let sucesso = false;

    if (tipo === 1){
        const dado1 = Math.floor(Math.random() * 20) + 1;
        rolagens.push(dado1);
        if (dado1 <= 10) sucesso = true;
    }else if (tipo === 2){
        const dado1 = Math.floor(Math.random() * 20) + 1;
        const dado2 = Math.floor(Math.random() * 20) + 1;
        rolagens.push(dado1, dado2);
        sucesso = rolagens.some(d => d <= 10);
    }

    const rolagemDiv = document.createElement("div");
    rolagemDiv.classList.add("rolagem");
    rolagemDiv.innerHTML = `
    <div>
    <strong>Habilidade:</strong> <br>
    <span>Rolagem: [${rolagens.join(", ")}] <br>
    <strong class="${sucesso ? "sucesso" : "fracasso"}">
    ${sucesso ? "Sucesso" : "Fracasso"}
    </strong>
    </div>
    <button class="fechar" onClick="this.parentElement.remove()">X</button>`;
    historico.prepend(rolagemDiv);

    rolagemDiv.querySelector(".fechar").onclick = function() {
        rolagemDiv.remove();
        if (historico.querySelectorAll(".rolagem").length === 0) {
            historico.style.display = "none";
        }
    };
}


// GUAAJA
// Adiciona esta função simples para abrir/fechar o card
function toggleDetails(element) {
  const card = element.closest(".item-card");
  card.classList.toggle("open");
}

// Adiciona esta função para garantir que o histórico some quando ficar vazio
function verificarHistoricoVazio() {
  const historico = document.getElementById("historico");
  const fecharBtns = historico.querySelectorAll(".fechar");
  fecharBtns.forEach(btn => {
    btn.onclick = function() {
      btn.parentElement.remove();
      if (historico.querySelectorAll(".rolagem").length === 0) {
        historico.style.display = "none";
      }
    };
  });
}

function rolarSoco() {
  const violencia = atributos.violencia;
  const ataque = Math.floor(Math.random() * 20) + 1;
  const totalAtaque = ataque + violencia;

  const dano = Math.floor(Math.random() * 6) + 1;
  let danoTotal = dano;

  let multiplicador = 1;
  if (totalAtaque >= 18) {
    danoTotal = dano * 2;
    multiplicador = 2;
  }

  const historico = document.getElementById("historico");
  historico.style.display = "block";

  const rolagemDiv = document.createElement("div");
  rolagemDiv.classList.add("rolagem");
  rolagemDiv.innerHTML = `<div><strong>Soco:</strong> <br>
    <span>Ataque: ${ataque} + (${violencia}) = <strong>${totalAtaque}</strong> <br>
    Dano: (${dano}) ${multiplicador > 1 ? `x${multiplicador}` : ''} = <strong>${danoTotal}</strong></span>
    </div>
    <button class="fechar" onClick="this.parentElement.remove()">X</button>`;
  historico.prepend(rolagemDiv);

  rolagemDiv.querySelector(".fechar").onclick = function() {
    rolagemDiv.remove();
    if (historico.querySelectorAll(".rolagem").length === 0) {
      historico.style.display = "none";
    }
  };
}
