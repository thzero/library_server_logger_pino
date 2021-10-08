import pino from 'pino';

import Service from '@thzero/library_server/service/index';

const CLIENT_PREFIX = 'CLIENT: ';

class LoggerService extends Service {
	async initLogger(logLevel, prettify, config) {
		if (prettify) {
			this._log = pino({
				level: logLevel,
				prettyPrint: {
					levelFirst: true
				},
				// eslint-disable-next-line
				//prettifier: require(require.resolve('pino-pretty', { paths: [ require.main.filename ] }))
			});
		}
		else {
			this._log = pino({
				level: logLevel
			});
		}
	}

	debug(clazz, method, message, data, correlationId, isClient) {
		this._log.debug({ property: message, value: data }, this._format(clazz, method, null, correlationId, isClient));
	}

	debug2(message, data, correlationId, isClient) {
		this._log.debug({ property: message, value: data }, this._format(null, null, null, correlationId, isClient));
	}

	error(clazz, method, message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.error(data ? { error: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	error2(message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.error(data ? { error: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	exception(clazz, method, ex, correlationId, isClient) {
		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(clazz, method, null, correlationId, isClient));
	}

	exception2(ex, correlationId, isClient) {
		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(null, null, message, correlationId, isClient));
	}

	fatal(clazz, method, message, data, correlationId, isClient) {
		this._log.fatal(data ? { error: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	fatal2(message, data, correlationId, isClient) {
		this._log.fatal(data ? { error: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	info(clazz, method, message, data, correlationId, isClient) {
		this._log.info(data ? { data: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	info2(message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.info(data ? { data: data } : {}, this._format(null, null, message, correlationId, isClient));
	}

	trace(clazz, method, message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.trace({ property: message, value: data }, this._format(clazz, method, message, correlationId, isClient));
	}

	trace2(message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.trace({ property: message, value: data }, this._format(null, null, message, correlationId, isClient));
	}

	warn(clazz, method, message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.warn(data ? { data: data } : {}, this._format(clazz, method, message, correlationId, isClient));
	}

	warn2(message, data, correlationId, isClient) {
		data = (data === undefined ? null : data);
		this._log.warn(data ? { data: data } : {}, this._format(null, null, message, correlationId, isClient));
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
