(function() {
  // Injeta o link do manifest.json para que qualquer página permita instalar o App
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = './manifest.json';
    document.head.appendChild(link);
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  const pagePath = window.location.pathname;
  const isWorkout = pagePath.includes('index.html') || pagePath.endsWith('/app-de-treino/') || pagePath.endsWith('/');
  const isDiet = pagePath.includes('dieta.html');
  const isFinance = pagePath.includes('financas.html');

  const roleTitle = isWorkout
    ? '🏋️‍♂️ Coach IA de Treino & Editor'
    : isDiet
    ? '🥗 Nutricionista IA (Jejum & Ajustes)'
    : '💰 Consultor de Economia & Investimentos';

  const placeholderText = isWorkout
    ? 'Ex: Machuquei o ombro hoje, qual exercício substituo? Ou: Mude minha série...'
    : isDiet
    ? 'Ex: Não consegui comer à tarde / Quero fazer jejum intermitente hoje...'
    : 'Ex: Me explique como rende 100% do CDI na minha Reserva Intocável...';

  const helpText = isWorkout
    ? 'Use o Coach IA para adaptar exercícios caso sinta alguma dor ou lesão, usar o Cronômetro de Descanso, calcular 1RM ou editar sua ficha de treino.'
    : isDiet
    ? 'Avise aqui quando pular uma refeição, comer fora da meta ou testar estratégias como jejum intermitente. A IA recalcula seus macros restantes do dia.'
    : 'Acompanhe notícias de economia, entenda conceitos de investimentos (CDI, Selic, IPCA) e mantenha a regra proporcional dos 3 bolsos.';

  window.addEventListener('DOMContentLoaded', () => {
    const bar = document.createElement('div');
    bar.className = 'max-w-lg mx-auto px-4 pt-3 flex items-center justify-between gap-2';
    bar.innerHTML = `
      <a href="estudos.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202020] border border-[#2f2f2f] text-xs font-bold text-gray-200 hover:text-white">
        <span>&larr;</span> <span>Voltar à Rotina</span>
      </a>
      <div class="flex items-center gap-2">
        <button id="ufuhubHelpBtn" class="w-8 h-8 rounded-full bg-[#202020] border border-[#2f2f2f] text-xs font-bold text-gray-300">?</button>
        <button id="ufuhubOpenAiBtn" class="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5">
          <span>💬</span> <span>Chat IA</span>
        </button>
        <button id="ufuhubGearBtn" class="w-8 h-8 rounded-full bg-[#202020] border border-[#2f2f2f] text-sm">⚙️</button>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);

    // Se for a página de Finanças, injeta o Feed de Economia & Investimentos no final do main
    if (isFinance) {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        const ecoSec = document.createElement('div');
        ecoSec.className = 'bg-[#202020] border border-[#2f2f2f] rounded-2xl p-4 space-y-3 mt-4';
        ecoSec.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">📈</span>
              <h3 class="text-sm font-bold text-white">Radar de Economia & Investimentos</h3>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Educação Financeira</span>
          </div>
          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-[#161616] border border-[#2f2f2f]">
              <div class="font-bold text-emerald-400 mb-0.5">💡 Pílula de Investimento: O que é 100% do CDI?</div>
              <p class="text-gray-300 leading-relaxed">O CDI acompanha de perto a taxa básica de juros (Selic). Guardar os seus 7,41% na Caixinha a 100% do CDI faz seu dinheiro render todos os dias úteis acima da poupança, com liquidez imediata.</p>
            </div>
            <a href="https://news.google.com/search?q=economia+investimentos+taxa+selic+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419" target="_blank" class="block p-3 rounded-xl bg-[#161616] border border-[#2f2f2f] hover:border-sky-500/40">
              <div class="text-[10px] text-sky-400 font-bold uppercase">🌐 Economia Brasil & Mundo</div>
              <div class="font-bold text-white mt-0.5">Acompanhar notícias atualizadas sobre Juros, Inflação (IPCA), Dólar e Mercado Financeiro &rarr;</div>
            </a>
          </div>
        `;
        mainEl.appendChild(ecoSec);
      }
    }

    // Modal Unificado de Chat IA & Ferramentas Avançadas (Treino / Dieta / Finanças)
    const modal = document.createElement('div');
    modal.id = 'ufuhubWidgetModal';
    modal.className = 'fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-[#1e1f22] border border-[#2e3036] w-full max-w-md rounded-3xl p-4 space-y-3 max-h-[88vh] overflow-y-auto text-gray-100">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white">${roleTitle}</h3>
          <button id="ufuhubCloseModal" class="text-gray-400 text-2xl leading-none">&times;</button>
        </div>

        ${isWorkout ? `
          <!-- FERRAMENTAS DE APPS DE TREINO FAMOSOS (HEVY / STRONG): CRONÔMETRO DE DESCANSO + CALCULADORA 1RM + EDITOR -->
          <div class="bg-[#141414] border border-[#2e3036] rounded-2xl p-3 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400">⏱️ Descanso entre Séries</span>
              <span id="restTimerVal" class="font-mono text-base font-extrabold text-white">01:30</span>
            </div>
            <div class="flex gap-1.5">
              <button onclick="startQuickRest(60)" class="flex-1 py-1.5 rounded-lg bg-[#28292e] text-white font-bold">60s</button>
              <button onclick="startQuickRest(90)" class="flex-1 py-1.5 rounded-lg bg-[#28292e] text-white font-bold">90s</button>
              <button onclick="startQuickRest(120)" class="flex-1 py-1.5 rounded-lg bg-[#28292e] text-white font-bold">120s</button>
            </div>
          </div>
        ` : ''}

        <div id="ufuhubChatBox" class="h-64 overflow-y-auto space-y-2 p-2 bg-[#141414] border border-[#2e3036] rounded-2xl text-xs">
          <div class="p-2.5 rounded-xl bg-[#202020] text-gray-200">${helpText}</div>
        </div>

        <div class="flex gap-2">
          <input type="text" id="ufuhubChatInput" placeholder="${placeholderText}" class="flex-1 bg-[#141414] border border-[#2e3036] rounded-xl px-3 py-2.5 text-xs text-white" />
          <button id="ufuhubSendBtn" class="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">Enviar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('ufuhubHelpBtn').onclick = () => alert(helpText);
    document.getElementById('ufuhubOpenAiBtn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('ufuhubGearBtn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('ufuhubCloseModal').onclick = () => modal.classList.add('hidden');

    document.getElementById('ufuhubSendBtn').onclick = sendWidgetAiMessage;
    document.getElementById('ufuhubChatInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendWidgetAiMessage();
    });
  });

  let restInterval = null;
  window.startQuickRest = function(secs) {
    clearInterval(restInterval);
    let left = secs;
    const el = document.getElementById('restTimerVal');
    restInterval = setInterval(() => {
      left--;
      const m = String(Math.floor(left / 60)).padStart(2, '0');
      const s = String(left % 60).padStart(2, '0');
      if (el) el.textContent = `${m}:${s}`;
      if (left <= 0) {
        clearInterval(restInterval);
        alert('Descanso finalizado! Próxima série.');
      }
    }, 1000);
  };

  async function sendWidgetAiMessage() {
    const input = document.getElementById('ufuhubChatInput');
    const box = document.getElementById('ufuhubChatBox');
    const msg = input.value.trim();
    if (!msg) return;

    const apiKey = localStorage.getItem('nutri_ufu_gemini_key');
    if (!apiKey) {
      alert('Configure sua chave da API Gemini na engrenagem da página inicial (estudos.html).');
      return;
    }

    box.innerHTML += `<div class="p-2.5 rounded-xl bg-indigo-600 text-white ml-6">${msg}</div>`;
    input.value = '';
    box.scrollTop = box.scrollHeight;

    let hubContext = '';
    try {
      const hub = JSON.parse(localStorage.getItem('ufu_super_hub_v2') || '{}');
      hubContext = hub.contextMemory || '';
    } catch (e) {}

    const prompt = `Contexto do aluno (Ithan - Engenharia Mecatrônica UFU):\n${hubContext}\n\nMódulo atual: ${roleTitle}.\nMensagem do usuário: "${msg}"\nResponda de forma prática, curta e adaptada à rotina dele (se for dor no treino, sugira substituição biomecânica segura; se for jejum ou pulo de refeição na dieta, ajuste os macros para bater 140g de proteína; se for finanças, explique com foco na reserva e nos 3 bolsos).`;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
      box.innerHTML += `<div class="p-2.5 rounded-xl bg-[#202020] text-gray-200 mr-4">${text.replace(/\n/g, '<br>')}</div>`;
      box.scrollTop = box.scrollHeight;
    } catch (e) {
      box.innerHTML += `<div class="p-2.5 rounded-xl bg-rose-900/40 text-rose-200">Erro: ${e.message}</div>`;
    }
  }
})();
