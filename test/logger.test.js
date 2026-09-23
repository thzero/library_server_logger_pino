import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import '@thzero/library_common/utility/string.js';
import LoggerService from '../index.js';

let service;
let logged;
let disabled;

beforeEach(() => {
	service = new LoggerService();
	logged = [];
	disabled = new Set();
	const record = (level) => (payload, message) => logged.push({ level, payload, message });
	service._log = {
		isLevelEnabled: (level) => !disabled.has(level),
		debug: record('debug'),
		error: record('error'),
		fatal: record('fatal'),
		info: record('info'),
		trace: record('trace'),
		warn: record('warn')
	};
});

// pino compares the level itself, but only once it has been handed the payload
// object and the formatted string. The wrapper asks first.
describe('level gate', () => {
	it('does not format or call pino for a level that is off', () => {
		let formats = 0;
		service._format = () => { formats++; return ''; };
		disabled.add('debug').add('trace');

		service.debug('C', 'm', 'msg', { big: true }, 'cid');
		service.debug2('msg', null, 'cid');
		service.trace('C', 'm', 'msg', null, 'cid');
		service.trace2('msg', null, 'cid');

		assert.equal(logged.length, 0);
		assert.equal(formats, 0);
	});

	it('still logs the levels that are on', () => {
		disabled.add('debug');
		service.debug('C', 'm', 'msg', null, 'cid');
		service.info('C', 'm', 'msg', null, 'cid');
		service.exception('C', 'm', new Error('boom'), 'cid');
		assert.deepEqual(logged.map(entry => entry.level), [ 'info', 'error' ]);
	});

	it('logs everything through a pino without the check', () => {
		delete service._log.isLevelEnabled;
		service.debug('C', 'm', 'msg', null, 'cid');
		assert.equal(logged.length, 1);
	});
});

describe('_format', () => {
	it('leads with the correlationId', () => {
		assert.equal(service._format('Clazz', 'method', 'msg', 'cid'), '(cid) Clazz.method: msg');
	});

	it('omits the correlationId when there is none', () => {
		assert.equal(service._format('Clazz', 'method', 'msg', null), 'Clazz.method: msg');
	});

	it('drops the dot when only one of clazz and method is given', () => {
		assert.equal(service._format('Clazz', null, 'msg', null), 'Clazz: msg');
		assert.equal(service._format(null, 'method', 'msg', null), 'method: msg');
	});

	it('emits only the message when there is no clazz or method', () => {
		assert.equal(service._format(null, null, 'msg', null), 'msg');
	});

	it('marks client-originated lines', () => {
		assert.equal(service._format(null, null, 'msg', null, true), 'CLIENT: msg');
		assert.equal(service._format('Clazz', 'method', 'msg', 'cid', true), '(cid) Clazz.method: CLIENT: msg');
	});

	it('returns an empty string for nothing at all', () => {
		assert.equal(service._format(null, null, null, null), '');
	});
});

describe('levels', () => {
	it('route to the matching pino method', () => {
		service.debug('C', 'm', 'msg', null, 'cid');
		service.error('C', 'm', 'msg', null, 'cid');
		service.fatal('C', 'm', 'msg', null, 'cid');
		service.info('C', 'm', 'msg', null, 'cid');
		service.trace('C', 'm', 'msg', null, 'cid');
		service.warn('C', 'm', 'msg', null, 'cid');
		assert.deepEqual(logged.map(entry => entry.level), [ 'debug', 'error', 'fatal', 'info', 'trace', 'warn' ]);
	});

	it('the 2 variants log without a clazz or method', () => {
		service.info2('msg', null, 'cid');
		assert.equal(logged[0].message, '(cid) msg');
	});

	it('error carries the data under an error key', () => {
		service.error('C', 'm', 'msg', { detail: 1 }, 'cid');
		assert.deepEqual(logged[0].payload, { error: { detail: 1 } });
	});

	it('error with no data sends an empty object rather than null', () => {
		service.error('C', 'm', 'msg', undefined, 'cid');
		assert.deepEqual(logged[0].payload, {});
	});

	it('debug carries the message as a property and the data as its value', () => {
		service.debug('C', 'm', 'thing', 42, 'cid');
		assert.deepEqual(logged[0].payload, { property: 'thing', value: 42 });
	});

	it('raw passes the message and data straight through', () => {
		service.raw('msg', { a: 1 });
		assert.equal(logged[0].level, 'info');
		assert.deepEqual(logged[0].payload, { a: 1 });
		assert.equal(logged[0].message, 'msg');
	});
});

describe('exception', () => {
	it('logs the exception as the payload', () => {
		const ex = new Error('boom');
		service.exception('C', 'm', ex, 'cid');
		assert.equal(logged[0].level, 'error');
		assert.equal(logged[0].payload, ex);
		assert.equal(logged[0].message, '(cid) C.m: ');
	});

	it('turns an undefined exception into null', () => {
		service.exception('C', 'm', undefined, 'cid');
		assert.equal(logged[0].payload, null);
	});

	// Regression: exception2 formatted with an identifier called `message`, which
	// is not one of its parameters - every call threw
	// `ReferenceError: message is not defined`.
	it('exception2 does not reference an identifier it does not have', () => {
		const ex = new Error('boom');
		assert.doesNotThrow(() => service.exception2(ex, 'cid'));
		assert.equal(logged[0].payload, ex);
		assert.equal(logged[0].message, '(cid) ');
	});
});
