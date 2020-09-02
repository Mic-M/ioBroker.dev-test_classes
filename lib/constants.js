'use strict';
/**
 * ioBroker Adapter: DEV Test Classes
 * @desc    Define adapter constants, which will be available in adapter class instance in 'this.constants'
 * @github  https://github.com/Mic-M/ioBroker.dev-test_classes
 * @author  Mic-M <https://github.com/Mic-M/>
 * @license MIT License
 */

module.exports = {
    forbiddenStatePaths: /[\][*,;'"`<>\\?]/g, // Source: https://github.com/ioBroker/ioBroker.js-controller/blob/master/lib/adapter.js - Version 3.1.6
    astroTimes:          ['nightEnd', 'nauticalDawn', 'dawn', 'sunrise', 'sunriseEnd', 'goldenHourEnd', 'solarNoon', 'goldenHour', 'sunsetStart', 'sunset', 'dusk', 'nauticalDusk', 'night', 'nadir'],
    astroTimesGerman:    ['Ende der Nacht', 'Nautische Morgendämmerung', 'Morgendämmerung', 'Sonnenaufgang', 'Ende des Sonnenaufgangs', 'Ende der goldenen Stunde', 'Mittag', 'Goldene Abendstunde', 'Start des Sonnenuntergangs', 'Sonnenuntergang', 'Dämmerung Abends', 'Nautische Dämmerung Abends', 'Start der Nacht', 'Mitternacht'],
};