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

	_message(message, isClient) {
		return (isClient ? CLIENT_PREFIX : '') + message;
	}

	debug(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.debug(data, this._message(message, isClient));
	}

	error(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.error(data, this._message(message, isClient));
	}

	exception(ex, isClient) {
		ex = (ex === undefined ? null : ex);
		this._log.error((isClient ? CLIENT_PREFIX : '') + ex);
	}

	fatal(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.fatal(data, this._message(message, isClient));
	}

	info(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.info(data, this._message(message, isClient));
	}

	trace(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.trace(data, this._message(message, isClient));
	}

	warn(message, data, isClient) {
		data = (data === undefined ? null : data);
		this._log.warn(data, this._message(message, isClient));
	}
}

export default LoggerService;
