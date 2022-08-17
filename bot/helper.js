const moment = require('moment');
const MAX_ARRAY_LENGTH = 100;

const serverHealthStatusArray = [];
let interval = null;

module.exports = {
    socket: {
        connectedHandler: () => {
            serverHealthStatusArray = [];
            console.log(
                `Socket is established Server <> Bot at ${moment().format(
                    'YY-MM-DD hh:mm:ss',
                )}`,
            );
        },
        disconnectedhandler: (reason) => {
            console.log(
                `Socket connection is Destroyed reason of ${reason}, at ${moment().format(
                    'YY-MM-DD hh:mm:ss',
                )}`,
            );

            serverHealthStatusArray = [];
            interval = null;
        },
        // 단발성 체크
        healthCheckEmitHandler: (socket) => {
            console.log(
                `Get server health status at ${moment().format(
                    'YY-MM-DD hh:mm:ss',
                )}`,
            );

            socket.emit('health_check');
        },
        // 지속적 체크
        healthCheckMonitoringHandler: (socket, milliseconds) => {
            if (!interval) {
                console.log(
                    `Start monitoring server health status at ${moment().format(
                        'YY-MM-DD hh:mm:ss',
                    )} every ${milliseconds / 1000} sec.`,
                );

                interval = setInterval(
                    () => socket.emit('health_check'),
                    milliseconds,
                );
                return interval;
            } else {
                return interval;
            }
        },
        clearHealthCheckMonitoring: (getResult = true) => {
            clearInterval(interval);
            console.log(
                `End of monitoring server health status at ${moment().format(
                    'YY-MM-DD hh:mm:ss',
                )}`,
            );
            interval = null;

            if (getResult) {
                return serverHealthStatusArray;
            }
        },
        healthResponseHander: (data) => {
            console.log(data);
            if (serverHealthStatusArray.length < MAX_ARRAY_LENGTH) {
                serverHealthStatusArray.push(data);
            } else {
                serverHealthStatusArray.shift();
                serverHealthStatusArray.push(data);
            }
        },
    },
    getTimeString: function (formatString) {
        return moment().format(formatString);
    },
    getServerHealthStatusArray: function (
        count = MAX_ARRAY_LENGTH,
        asc = true,
    ) {
        return asc
            ? serverHealthStatusArray.splice(0, count)
            : serverHealthStatusArray.reverse().splice(0, count);
    },
};
