#!/usr/bin/env node
/**
 * Compara dois relatórios JSON do Newman (baseline = proxy atual,
 * candidate = saturno-api migrada) request a request:
 *   - status code
 *   - resultado de cada assertion da collection
 *   - corpo da resposta (JSON normalizado, ignorando campos voláteis)
 */
const fs = require('fs');

const [, , baselinePath, candidatePath] = process.argv;
if (!baselinePath || !candidatePath) {
  console.error('Uso: node compare-reports.js <baseline.json> <candidate.json>');
  process.exit(2);
}

// Campos que mudam a cada execução e não são quebra de contrato.
const VOLATILE_KEYS = new Set([
  'token',
  'newToken',
  'urlDownload',
  'urlPdf',
  'urlImage',
  'base64',
  'cursor',
  'id',
  'idPaymentLink',
  'paymentUrl',
  'emv',
  'dateTimePtBr',
  'createdAt',
  'updatedAt',
  'paymentDate',
  'dateOfSale',
  'dateOfReceivables',
  'path', // inclui query string; igual por construção quando as URLs batem
]);

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = VOLATILE_KEYS.has(key) ? '<<volátil>>' : normalize(value[key]);
    }
    return out;
  }
  return value;
}

function loadExecutions(path) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'));
  const map = new Map();
  for (const exec of report.run.executions) {
    const name = exec.item.name;
    const key = map.has(name) ? `${name} (#${map.size})` : name;
    let body = null;
    try {
      const stream = exec.response && exec.response.stream;
      const raw = stream && Buffer.from(stream.data || stream).toString('utf8');
      body = raw ? JSON.parse(raw) : null;
    } catch (_) {
      body = '<<corpo não-JSON>>';
    }
    map.set(key, {
      code: exec.response ? exec.response.code : null,
      assertions: (exec.assertions || []).map((a) => ({
        name: a.assertion,
        failed: Boolean(a.error),
      })),
      body,
    });
  }
  return map;
}

const baseline = loadExecutions(baselinePath);
const candidate = loadExecutions(candidatePath);

let divergences = 0;

for (const [name, base] of baseline) {
  const cand = candidate.get(name);
  if (!cand) {
    divergences++;
    console.log(`✖ [AUSENTE no candidate] ${name}`);
    continue;
  }

  const problems = [];

  if (base.code !== cand.code) {
    problems.push(`status: baseline=${base.code} candidate=${cand.code}`);
  }

  const candAssertions = new Map(cand.assertions.map((a) => [a.name, a.failed]));
  for (const assertion of base.assertions) {
    const candFailed = candAssertions.get(assertion.name);
    if (candFailed !== undefined && candFailed !== assertion.failed) {
      problems.push(
        `assertion "${assertion.name}": baseline=${assertion.failed ? 'FALHOU' : 'passou'} candidate=${candFailed ? 'FALHOU' : 'passou'}`,
      );
    }
  }

  const baseBody = JSON.stringify(normalize(base.body));
  const candBody = JSON.stringify(normalize(cand.body));
  if (baseBody !== candBody) {
    problems.push('corpo divergente (após normalização de campos voláteis)');
    problems.push(`  baseline : ${baseBody?.slice(0, 300)}`);
    problems.push(`  candidate: ${candBody?.slice(0, 300)}`);
  }

  if (problems.length) {
    divergences++;
    console.log(`✖ ${name}`);
    for (const p of problems) console.log(`    ${p}`);
  } else {
    console.log(`✔ ${name}`);
  }
}

console.log('');
if (divergences === 0) {
  console.log('✅ PARIDADE TOTAL: nenhum desvio entre baseline e candidate.');
} else {
  console.log(`⚠️  ${divergences} request(s) com divergência — revisar acima.`);
  process.exitCode = 1;
}
