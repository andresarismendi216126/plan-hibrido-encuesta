const money = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const invoiceInput = document.querySelector('#invoice');
const modelSelect = document.querySelector('#simModel');
const invoiceLabel = document.querySelector('#invoiceLabel');
const clientPay = document.querySelector('#clientPay');
const explanation = document.querySelector('#explain');
const flow = document.querySelector('#flow');
const annualPrices = [459600, 1087200, 1888800];

function renderPlanPrices() {
  document.querySelectorAll('.plan > strong').forEach((priceElement, index) => {
    const monthlyPrice = Math.round((annualPrices[index] * 1.1) / 12);
    const monthly = document.createElement('div');
    monthly.className = 'monthly-price';
    monthly.innerHTML = `Pago mensual equivalente: <b>${money(monthlyPrice)}/mes</b><em>10% más que el pago anual</em>`;
    priceElement.insertAdjacentElement('afterend', monthly);
  });
}

function correctVisibleText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);
  textNodes.forEach((textNode) => {
    textNode.nodeValue = textNode.nodeValue.replace(/\bano\b/g, 'año');
  });
}

function updateSimulation() {
  const invoice = Number(invoiceInput.value);
  const isHybrid = modelSelect.value === 'hybrid';
  const percentage = isHybrid ? 0.4 : 0.2;
  const copay = Math.max(invoice * percentage, 40000);
  invoiceLabel.textContent = money(invoice);
  clientPay.textContent = money(copay);
  explanation.textContent = isHybrid
    ? 'Fuera de red, esta simulacion usa un copago del 40%, con minimo de $40.000. El reembolso estimado seria el valor reconocido menos el copago, usando como base el menor valor entre la factura y el tarifario SURA, sujeto a revision.'
    : 'En la red, la clinica gestiona la autorizacion. El calculo aplica un copago del 20%, con minimo de $40.000, y no supone revision de cobertura, saldo o carencias.';
  flow.innerHTML = isHybrid
    ? '<span>Clinica elegida</span><b>-></b><span>Pago</span><b>-></b><span>Radicacion digital</span><b>-></b><span>Reembolso</span>'
    : '<span>Clinica SURA</span><b>-></b><span>Autorizacion</span><b>-></b><span>Copago</span>';
}

function activateModelSwitch() {
  document.querySelectorAll('.model-switch button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.model-switch button').forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.model-card').forEach((card) => card.classList.remove('chosen'));
      button.classList.add('active');
      document.getElementById(button.dataset.focus).classList.add('chosen');
    });
  });
}

function activateModelChoices() {
  document.querySelectorAll('.choose').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('#choice').value = button.dataset.choice;
      document.querySelector('#testForm').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function saveResponse(payload) {
  localStorage.setItem(`hibrido_respuesta_${Date.now()}`, JSON.stringify(payload));
  const config = window.SURVEY_CONFIG || {};
  if (!config.endpoint || !config.anonKey) return 'La respuesta quedo guardada localmente en este navegador.';

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No fue posible registrar la respuesta: ${errorText}`);
  }

  return 'La respuesta fue enviada al repositorio configurado.';
}

function buildSupabasePayload(form) {
  const formData = Object.fromEntries(new FormData(form));
  const simulation = {
    factura_simulada: Number(invoiceInput.value),
    modelo_simulado: modelSelect.value,
    copago_simulado: Math.max(Number(invoiceInput.value) * (modelSelect.value === 'hybrid' ? 0.4 : 0.2), 40000),
  };

  return {
    codigo_participante: (formData.nombre_completo || formData.nombreCompleto || 'anonimo').toString().trim() || 'anonimo',
    ciudad: formData.ciudad || null,
    edad_mascota: formData.edad_mascota !== '' ? Number(formData.edad_mascota) : null,
    edad_persona: formData.edad_persona !== '' ? Number(formData.edad_persona) : null,
    estrato_social: formData.estrato_social || null,
    modelo: formData.modelo || null,
    claridad: formData.claridad || null,
    adelanto: formData.adelanto || null,
    copago: formData.copago || null,
    opinion_copago_hibrido: formData.opinion_copago_hibrido || null,
    claridad_copago_reembolso: formData.claridad_copago_reembolso || null,
    comentario: formData.comentario || null,
    mejora: formData.mejora || null,
    factura_simulada: simulation.factura_simulada,
    modelo_simulado: simulation.modelo_simulado,
    copago_simulado: simulation.copago_simulado,
    fecha: new Date().toISOString(),
    version_prototipo: '1.0',
  };
}

document.querySelector('#testForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const submit = form.querySelector('.submit');
  submit.disabled = true;
  submit.textContent = 'Enviando...';

  try {
    const payload = buildSupabasePayload(form);
    document.querySelector('#saveMessage').textContent = await saveResponse(payload);
  } catch (error) {
    document.querySelector('#saveMessage').textContent = 'La respuesta quedo guardada localmente, pero no pudo enviarse al repositorio.';
  } finally {
    document.querySelector('#thanks').style.display = 'block';
    submit.disabled = false;
    submit.textContent = 'Enviar respuesta';
  }
});

invoiceInput.addEventListener('input', updateSimulation);
modelSelect.addEventListener('change', updateSimulation);
correctVisibleText();
renderPlanPrices();
activateModelSwitch();
activateModelChoices();
updateSimulation();
