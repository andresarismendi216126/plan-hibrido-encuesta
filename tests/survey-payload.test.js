import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSurveyPayload } from '../survey-payload.js';

test('normaliza el payload para Supabase y rellena codigo_participante', () => {
  const payload = normalizeSurveyPayload({
    nombre_completo: 'Ana Pérez',
    ciudad: 'Bogotá',
    edad_mascota: '2',
    edad_persona: '30',
    estrato_social: '3',
    modelo: 'Red cerrada actual',
    claridad: 'Clara',
    adelanto: 'Si',
    copago: '20%',
    opinion_copago_hibrido: 'Me parece adecuado',
    comentario: 'Test',
    mejora: 'Más claridad',
  }, {
    factura_simulada: 600000,
    modelo_simulado: 'closed',
    copago_simulado: 120000,
  });

  assert.equal(payload.codigo_participante, 'Ana Pérez');
  assert.equal(payload.modelo, 'Red cerrada actual');
  assert.equal(payload.factura_simulada, 600000);
  assert.equal(payload.modelo_simulado, 'closed');
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'nombre_completo'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'codigo_participante'), true);
  assert.ok(payload.fecha);
  assert.equal(payload.version_prototipo, '1.0');
});

test('usa un valor por defecto cuando falta codigo_participante', () => {
  const payload = normalizeSurveyPayload({
    ciudad: 'Medellín',
    edad_mascota: '1',
    edad_persona: '28',
    estrato_social: '4',
    modelo: 'Modelo hibrido',
    claridad: 'Muy clara',
    adelanto: 'Depende del monto',
    copago: '40%',
    opinion_copago_hibrido: 'Me parece alto',
  });

  assert.equal(payload.codigo_participante, 'anonimo');
});
