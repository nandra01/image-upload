const _ = require('lodash');
const logger = require('loglevel');
const stringSanitizer = require('string-sanitizer');

/**
 * Set Central Log.
 * @param {Object} options
 * @param {String} options.level
 * @param {String} options.method
 * @param {String} options.message
 * @param {Error=} options.error
 * @param {String=} options.others
 */
 const setLog = (options) => {
    const payload = _.pick(options, ['level', 'method', 'message', 'error', 'others']);

    let output = stringSanitizer.sanitize.keepSpace(`${payload.level}`);
    output += ': ';
    output += stringSanitizer.sanitize.keepSpace(`${payload.method}`);
    output += '-> ';
    output += stringSanitizer.sanitize.keepSpace(`${payload.message}`);

    if(payload.others) output += ` (${stringSanitizer.sanitize.keepSpace(`${payload.others}`)})`;

    logger.info(output);
    console.log(output);

    if(payload.error) logger.warn(payload.error);
}

module.exports = { setLog }