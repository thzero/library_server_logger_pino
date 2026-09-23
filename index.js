import pino from 'pino';

import Service from '@thzero/library_server/service/index.js';

const CLIENT_PREFIX = 'CLIENT: ';

class LoggerService extends Service {
	async initLogger(logLevel, prettify, config) {
		if (prettify) {
			// this._log = pino({
			// 	level: logLevel,
			// 	prettyPrint: {
			// 		levelFirst: true
			// 	},
			// 	// eslint-disable-next-line
			// 	//prettifier: require(require.resolve('pino-pretty', { paths: [ require.main.filename ] }))
			// });
			const transport = pino.transport({
				targets: [
					{ target: 'pino-pretty', options: { level: logLevel } }
				]
			});
			this._log = pino(transport);
		}
		else {
			this._log = pino({
				level: logLevel
			});
		}
	}

	debug(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('debug'))
			return;

		this._log.debug({ property: message, value: data }, this._format(clazz, method, null, correlationId, isClient));
	}

	debug2(message, data, correlationId, isClient) {
		if (!this._enabled('debug'))
			return;

		this._log.debug({ property: message, value: data }, this._format(null, null, null, correlationId, isClient));
	}

	error(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('error'))
			return;

		data = (data === undefined ? null : data);
		this._log.error(data ? { error: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	error2(message, data, correlationId, isClient) {
		if (!this._enabled('error'))
			return;

		data = (data === undefined ? null : data);
		this._log.error(data ? { error: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	exception(clazz, method, ex, correlationId, isClient) {
		if (!this._enabled('error'))
			return;

		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(clazz, method, null, correlationId, isClient));
	}

	exception2(ex, correlationId, isClient) {
		if (!this._enabled('error'))
			return;

		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(null, null, null, correlationId, isClient));
	}

	fatal(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('fatal'))
			return;

		this._log.fatal(data ? { error: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	fatal2(message, data, correlationId, isClient) {
		if (!this._enabled('fatal'))
			return;

		this._log.fatal(data ? { error: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	info(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('info'))
			return;

		this._log.info(data ? { data: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	info2(message, data, correlationId, isClient) {
		if (!this._enabled('info'))
			return;

		data = (data === undefined ? null : data);
		this._log.info(data ? { data: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	raw(message, data, correlationId, isClient) {
		this._log.info(data, message);
	}

	trace(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('trace'))
			return;

		data = (data === undefined ? null : data);
		this._log.trace({ property: message, value: data }, this._format(clazz, method, message, correlationId, isClient));
	}

	trace2(message, data, correlationId, isClient) {
		if (!this._enabled('trace'))
			return;

		data = (data === undefined ? null : data);
		this._log.trace({ property: message, value: data }, this._format(null, null, message, correlationId, isClient));
	}

	warn(clazz, method, message, data, correlationId, isClient) {
		if (!this._enabled('warn'))
			return;

		data = (data === undefined ? null : data);
		this._log.warn(data ? { data: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	warn2(message, data, correlationId, isClient) {
		if (!this._enabled('warn'))
			return;

		data = (data === undefined ? null : data);
		this._log.warn(data ? { data: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	// pino drops a call below its level itself, but only after the payload object
	// and the _format string have been built. Ask first, so a suppressed call
	// costs one lookup. A logger without the check (a stub) logs everything.
	_enabled(level) {
		return !this._log.isLevelEnabled || this._log.isLevelEnabled(level);
	}

	_format(clazz, method, message, correlationId, isClient) {
		let output = '';
		if (!String.isNullOrEmpty(correlationId))
			output += `(${correlationId}) `;
		if (!String.isNullOrEmpty(clazz))
			output += clazz + (!String.isNullOrEmpty(method) ? '.' : '');
		if (!String.isNullOrEmpty(method))
			output += method;
		if (!String.isNullOrEmpty(clazz) || !String.isNullOrEmpty(method))
			output += ': ';
		output += (isClient ? CLIENT_PREFIX : '');
		if (!String.isNullOrEmpty(message))
			output += message;
		return output;
	}
}

export default LoggerService;
