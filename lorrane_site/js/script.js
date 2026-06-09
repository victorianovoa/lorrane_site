/**
 * main.js — Lorrane Félix · Personal Trainer
 * Responsável por: cursor, navbar, menu mobile, scroll reveal, clima, formulário
 */

/* ════════════════════════════════════════════
   CURSOR PERSONALIZADO
════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  ring.style.left   = rx + 'px';
  ring.style.top    = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// Cursor cresce ao passar sobre elementos clicáveis
document.querySelectorAll('a, button, label, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width   = '54px';
    ring.style.height  = '54px';
    ring.style.opacity = '0.22';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width   = '34px';
    ring.style.height  = '34px';
    ring.style.opacity = '0.45';
  });
});

/* ════════════════════════════════════════════
   NAVBAR — efeito ao rolar
════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ════════════════════════════════════════════
   MENU MOBILE
════════════════════════════════════════════ */
let menuAberto = false;
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const hamSpans   = hamburger.querySelectorAll('span');

hamburger.addEventListener('click', () => {
  menuAberto = !menuAberto;

  mobileMenu.style.display = menuAberto ? 'flex' : 'none';
  setTimeout(() => mobileMenu.classList.toggle('open', menuAberto), 10);

  // Animação do ícone hambúrguer → X
  hamSpans[0].style.transform = menuAberto ? 'rotate(45deg) translate(4px, 4px)' : '';
  hamSpans[1].style.opacity   = menuAberto ? '0' : '';
  hamSpans[2].style.transform = menuAberto ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

// Fecha ao clicar em um link
window.closeMenu = function () {
  menuAberto = false;
  mobileMenu.classList.remove('open');
  setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
  hamSpans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
};

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════════
   WIDGET DE CLIMA — OpenWeatherMap
   → Substitua API_KEY pela sua chave gratuita
     Cadastro em: openweathermap.org/api
════════════════════════════════════════════ */
const API_KEY = '9fce6a72e45a93d4f845abbe849b6910';
const CIDADE  = 'Brasilia,BR';

const recomendacoes = {
  sunny:  {
    icon:  '☀️',
    title: 'Dia perfeito para treino ao ar livre!',
    text:  'Aproveite o sol de Brasília para um treino funcional no parque. Não esqueça o protetor solar e a garrafinha!'
  },
  hot: {
    icon:  '🌡️',
    title: 'Calor intenso — cuide-se com atenção!',
    text:  'Evite os horários de pico (11h–15h). Prefira ambientes climatizados e reforce a hidratação antes, durante e depois.'
  },
  cloudy: {
    icon:  '⛅',
    title: 'Clima ameno — ótimo para treinar!',
    text:  'Temperatura agradável, ideal para um treino de força ou cardio. Aproveite e dê o seu melhor!'
  },
  rain: {
    icon:  '🌧️',
    title: 'Chuva lá fora, treino aqui dentro!',
    text:  'Não deixe a chuva ser desculpa. Um circuito funcional em casa resolve muito bem — e mantém a consistência!'
  },
  cold: {
    icon:  '🧊',
    title: 'Frio? O corpo aquece rápido com movimento!',
    text:  'Capricha no aquecimento antes de começar. Seu corpo agradece — e esquenta muito rápido com o treino certo.'
  },
  default: {
    icon:  '🌿',
    title: 'Vamos mover o corpo hoje?',
    text:  'Independente do clima, cada treino é um passo em direção à sua melhor versão. Vamos juntas!'
  }
};

function getRecomendacao(condicao, temperatura) {
  if (temperatura > 34) return recomendacoes.hot;
  if (temperatura < 16) return recomendacoes.cold;

  const c = (condicao || '').toLowerCase();
  if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder')) return recomendacoes.rain;
  if (c.includes('cloud')) return recomendacoes.cloudy;
  if (c.includes('clear')) return recomendacoes.sunny;
  return recomendacoes.default;
}

async function carregarClima() {
  try {
    const url      = `https://api.openweathermap.org/data/2.5/weather?q=${CIDADE}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const resposta = await fetch(url);

    if (!resposta.ok) throw new Error('Erro na API');

    const dados = await resposta.json();
    const temp  = Math.round(dados.main.temp);
    const cond  = dados.weather[0].main;
    const desc  = dados.weather[0].description;
    const rec   = getRecomendacao(cond, temp);

    document.getElementById('clima-icon').textContent      = rec.icon;
    document.getElementById('clima-temp').textContent      = temp + '°C';
    document.getElementById('clima-city').textContent      = desc.charAt(0).toUpperCase() + desc.slice(1) + ' · Brasília, DF';
    document.getElementById('clima-rec-title').textContent = rec.title;
    document.getElementById('clima-rec-text').textContent  = rec.text;

  } catch (erro) {
    // Fallback: exibe mensagem padrão sem quebrar o layout
    const rec = recomendacoes.default;
    document.getElementById('clima-icon').textContent      = rec.icon;
    document.getElementById('clima-temp').textContent      = '--°C';
    document.getElementById('clima-city').textContent      = 'Brasília, DF';
    document.getElementById('clima-rec-title').textContent = rec.title;
    document.getElementById('clima-rec-text').textContent  = 'Configure a chave OpenWeatherMap em js/main.js para ativar dados em tempo real.';
  }
}

carregarClima();

/* ════════════════════════════════════════════
   FORMULÁRIO DE CONTATO — fetch → PHP
   O formulário envia os dados via AJAX para
   php/formulario.php e exibe a resposta sem
   recarregar a página.
════════════════════════════════════════════ */
const form         = document.getElementById('form-contato');
const feedback     = document.getElementById('form-feedback');
const btnSubmit    = document.getElementById('btn-submit');
const txtOriginal  = btnSubmit ? btnSubmit.textContent : '';

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Estado de carregamento
    btnSubmit.disabled    = true;
    btnSubmit.textContent = 'Enviando...';
    feedback.className    = 'form-feedback';
    feedback.style.display = 'none';

    const dados = new FormData(form);

    try {
      const resposta = await fetch('php/formulario.php', {
        method: 'POST',
        body:   dados
      });

      const json = await resposta.json();

      if (json.status === 'sucesso') {
        // Sucesso: mostra mensagem e reseta o form
        feedback.className   = 'form-feedback sucesso show';
        feedback.innerHTML   = '✅ ' + json.mensagem;
        feedback.style.display = 'block';
        form.reset();

      } else if (json.erros && json.erros.length > 0) {
        // Erros de validação: lista os erros
        const lista = json.erros.map(e => `<li>${e}</li>`).join('');
        feedback.className   = 'form-feedback erro show';
        feedback.innerHTML   = `<strong>Corrija os campos abaixo:</strong><ul>${lista}</ul>`;
        feedback.style.display = 'block';

      } else {
        // Erro genérico de envio
        feedback.className   = 'form-feedback erro show';
        feedback.innerHTML   = '⚠️ ' + (json.mensagem || 'Erro ao enviar. Tente o WhatsApp.');
        feedback.style.display = 'block';
      }

    } catch (erro) {
      // Erro de rede ou servidor
      feedback.className   = 'form-feedback erro show';
      feedback.innerHTML   = '⚠️ Não foi possível conectar ao servidor. Por favor, use o WhatsApp.';
      feedback.style.display = 'block';
    }

    // Restaura botão
    btnSubmit.disabled    = false;
    btnSubmit.textContent = txtOriginal;

    // Rola até o feedback
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
