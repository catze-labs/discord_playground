const moment = require('moment');
const MAX_ARRAY_LENGTH = 100;

const serverHealthStatus = {
  healthStatusArray: [],
  healthStatusMonitoringInterval: null,
};

module.exports = {
  socket: {
    connectedHandler: () => {
      serverHealthStatus.healthStatusArray = [];
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

      serverHealthStatus.serverHealthStatusArray = [];
      serverHealthStatus.healthStatusMonitoringInterval = null;
    },
    // 단발성 체크
    healthCheckEmitHandler: (socket) => {
      console.log(
        `Get server health status at ${moment().format('YY-MM-DD hh:mm:ss')}`,
      );

      socket.emit('health_check');
    },
    // 지속적 체크
    healthCheckMonitoringHandler: (socket, milliseconds) => {
      if (!serverHealthStatus.healthStatusMonitoringInterval) {
        console.log(
          `Start monitoring server health status at ${moment().format(
            'YY-MM-DD hh:mm:ss',
          )} every ${milliseconds / 1000} sec.`,
        );

        serverHealthStatus.healthStatusMonitoringInterval = setInterval(
          () => socket.emit('health_check'),
          milliseconds,
        );
        return serverHealthStatus.healthStatusMonitoringInterval;
      } else {
        return serverHealthStatus.healthStatusMonitoringInterval;
      }
    },
    clearHealthCheckMonitoring: (getResult = true) => {
      clearInterval(serverHealthStatus.healthStatusMonitoringInterval);
      console.log(
        `End of monitoring server health status at ${moment().format(
          'YY-MM-DD hh:mm:ss',
        )}`,
      );
      serverHealthStatus.healthStatusMonitoringInterval = null;

      if (getResult) {
        return serverHealthStatus.healthStatusArray;
      }
    },
    healthResponseHander: (data) => {
      console.log(data);
      if (serverHealthStatus.healthStatusArray.length < MAX_ARRAY_LENGTH) {
        serverHealthStatus.healthStatusArray.push(data);
      } else {
        serverHealthStatus.healthStatusArray.shift();
        serverHealthStatus.healthStatusArray.push(data);
      }
    },
  },
  getTimeString: function (formatString) {
    return moment().format(formatString);
  },
  getServerHealthStatusArray: function (count = MAX_ARRAY_LENGTH, asc = true) {
    return asc
      ? serverHealthStatus.healthStatusArray.splice(0, count)
      : serverHealthStatus.healthStatusArray.reverse().splice(0, count);
  },
};
