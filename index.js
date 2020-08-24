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
				prettifier: require(require.resolve('pino-pretty', { paths: [ require.main.filename ] }))
			});
		}
		else {
			this._log = pino({
				level: logLevel
			});
		}
	}

	debug(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.debug(data, this._format(clazz, method, message, isClient));
	}

	debug2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.debug(data, this._format(null, null, message, isClient));
	}

	error(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.error(data, this._format(clazz, method, message, isClient));
	}

	error2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.error(data, this._format(null, null, message, isClient));
	}

	exception(clazz, method, ex, isClient) {
		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(clazz, method, null, isClient));
	}

	exception2(ex, isClient) {
		ex = (ex === undefined ? null : ex);
		this._log.error(ex, this._format(null, null, null, isClient));
	}

	fatal(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.fatal(data, this._format(clazz, method, message, isClient));
	}

	fatal2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.fatal(data, this._format(null, null, message, isClient));
	}

	info(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.info(data, this._format(clazz, method, message, isClient));
	}

	info2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.info(data, this._format(null, null, message, isClient));
	}

	trace(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.trace(data, this._format(clazz, method, message, isClient));
	}

	trace2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.trace(data, this._format(null, null, message, isClient));
	}

	warn(clazz, method, message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.warn(data, this._format(clazz, method, message, isClient));
	}

	warn2(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.warn(data, this._format(null, null, message, isClient));
	}

	_format(clazz, method, message, isClient) {
		let output = '';
		if (!String.isNullOrEmpty(clazz))
			output += clazz;
		if (!String.isNullOrEmpty(output))
			output += '.';
		if (!String.isNullOrEmpty(method))
			output += method;
		if (!String.isNullOrEmpty(output))
			output += ': ';
		output += (isClient ? CLIENT_PREFIX : '');
		if (!String.isNullOrEmpty(message))
			output += message;
		return output;
	}
}

export default LoggerService;
