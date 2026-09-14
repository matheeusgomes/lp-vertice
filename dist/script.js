// Troque pelo seu número no formato: código do país + DDD + número, sem espaços.
const WHATSAPP_NUMBER = '5519983875892';

const form = document.querySelector('#budgetForm');
const steps = [...document.querySelectorAll('.form-step')];
const currentStepLabel = document.querySelector('#currentStep');
const progressBar = document.querySelector('#progressBar');
const backButton = document.querySelector('#backButton');
const nextButton = document.querySelector('#nextButton');
const submitButton = document.querySelector('#submitButton');
const formError = document.querySelector('#formError');
let currentStep = 1;

function whatsappUrl(message = 'Olá, Vértice Pages! Gostaria de um orçamento para minha landing page.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('[data-whatsapp]').forEach(link => link.href = whatsappUrl());

function updateForm() {
  steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === currentStep));
  currentStepLabel.textContent = currentStep;
  progressBar.style.width = `${currentStep * 33.333}%`;
  backButton.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  nextButton.style.display = currentStep < 3 ? 'inline-flex' : 'none';
  submitButton.style.display = currentStep === 3 ? 'inline-flex' : 'none';
  formError.textContent = '';
}

function validStep() {
  const active = steps[currentStep - 1];
  const required = [...active.querySelectorAll('[required]')];
  const valid = required.every(field => field.type === 'radio'
    ? active.querySelector(`input[name="${field.name}"]:checked`)
    : field.value.trim());
  formError.textContent = valid ? '' : 'Preencha esta etapa para continuar.';
  if (valid && currentStep === 3 && !/^\d{10,11}$/.test(form.elements.phone.value.replace(/\D/g, ''))) {
    formError.textContent = 'Informe um WhatsApp com DDD válido.';
    return false;
  }
  return valid;
}

nextButton.addEventListener('click', () => { if (validStep()) { currentStep++; updateForm(); form.scrollIntoView({behavior:'smooth', block:'center'}); } });
backButton.addEventListener('click', () => { currentStep--; updateForm(); });

form.addEventListener('submit', event => {
  event.preventDefault();
  if (currentStep < 3) { nextButton.click(); return; }
  if (!validStep()) return;
  const data = new FormData(form);
  const message = `Olá, Vértice Pages! Preenchi o orçamento pelo seu site.\n\n*Nome:* ${data.get('name')}\n*WhatsApp:* ${data.get('phone')}\n*Empresa/segmento:* ${data.get('business') || 'Não informado'}\n*Projeto:* ${data.get('project')}\n*Momento:* ${data.get('stage')}\n*Prazo:* ${data.get('deadline')}\n*Detalhes:* ${data.get('details') || 'Não informado'}`;
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
});

const phone = form.querySelector('input[name="phone"]');
phone.addEventListener('input', event => {
  let value = event.target.value.replace(/\D/g, '').slice(0, 11);
  if (value.length > 6) value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  else if (value.length > 2) value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
  event.target.value = value;
});

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-header nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
updateForm();
