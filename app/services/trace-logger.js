import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';

export default Service.extend({

    ajax: Ember.inject.service(),

    _originalLogger: Ember.Logger,

    init() {
        this._super(...arguments);

        this.set('logs', []);
        this.set('BUCKET_SIZE', 32);
    },

    /* pass through to Ember.Logger interface for non errors */
    log() {
        this._originalLogger.log(...arguments);
    },
    warn() {
        this._originalLogger.warn(...arguments);
    },
    info() {
        this._originalLogger.info(...arguments);
    },
    debug() {
        this._originalLogger.debug(...arguments);
    },
    assert() {
        return this._originalLogger.assert(...arguments);
    },

    /* send error logs to purecloud trace api */
    error(topic, ...info) {
        this._originalLogger.error(...arguments);

        return this.get('ajax')
            .request('/platform/api/v2/diagnostics/trace', {
                method: 'post',
                dataType: 'text',
                cache: false,
                context: this,
                data: JSON.stringify({
                    app: {
                        appId: 'purecloud-skype',
                        appVersion: config.APP.buildNumber
                    },
                    traces: [{
                        topic: `purecloud-skype.${topic}`,
                        level: 'ERROR',
                        time: new Date().toISOString(),
                        message: JSON.stringify(info)
                    }]
                })
            })
            .catch(error => {
                this._originalLogger.error("Failed to send trace to purecloud", error);
            });
    }
});
