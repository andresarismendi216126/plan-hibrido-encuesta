export function normalizeSurveyPayload(formData, simulation = {}) {
  const payload = {
    codigo_participante: (formData.nombre_completo || formData.nombreCompleto || formData.codigo_participante || 'anonimo').toString().trim() || 'anonimo',
    ciudad: formData.ciudad || null,
    edad_mascota: formData.edad_mascota !== undefined && formData.edad_mascota !== '' ? Number(formData.edad_mascota) : null,
    edad_persona: formData.edad_persona !== undefined && formData.edad_persona !== '' ? Number(formData.edad_persona) : null,
    estrato_social: formData.estrato_social || null,
    modelo: formData.modelo || null,
    claridad: formData.claridad || null,
    adelanto: formData.adelanto || null,
    copago: formData.copago || null,
    opinion_copago_hibrido: formData.opinion_copago_hibrido || null,
    claridad_copago_reembolso: formData.claridad_copago_reembolso || null,
    comentario: formData.comentario || null,
    mejora: formData.mejora || null,
    factura_simulada: simulation.factura_simulada ?? null,
    modelo_simulado: simulation.modelo_simulado ?? null,
    copago_simulado: simulation.copago_simulado ?? null,
    fecha: new Date().toISOString(),
    version_prototipo: '1.0',
  };

  if (payload.ciudad === '') payload.ciudad = null;
  if (payload.estrato_social === '') payload.estrato_social = null;
  if (payload.modelo === '') payload.modelo = null;
  if (payload.opinion_copago_hibrido === '') payload.opinion_copago_hibrido = null;

  return payload;
}
