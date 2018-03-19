const Broadlink = require("./broadlink");

const macRegExp = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export default host => new Promise((resolve, reject) => {

  let device = Broadlink({ host, learnOnly: true });
  if (device) {
    if (!device.enterLearning)
      return console.log(JSON.stringify({
        error: `Learn Code (IR learning not supported for device at ${host})`
      }));
    if (!device.enterLearning && !device.enterRFSweep)
      reject({
        error: `Scan RF (RF learning not supported for device at ${host})`
      });

    device.cancelRFSweep && device.cancelRFSweep();

    let cancelLearning = () => {
      device.cancelRFSweep && device.cancelRFSweep();
      device.removeListener("rawData", onRawData);

      clearTimeout(getTimeout);
      clearTimeout(getDataTimeout);
    };

    let getTimeout = setTimeout(() => {
      cancelLearning();
      console.log(JSON.stringify({ error: "Timeout." }));
    }, 20000);

    let getDataTimeout = setTimeout(() => {
      getData(device);
    }, 1000);

    const getData = device => {
      if (getDataTimeout) clearTimeout(getDataTimeout);

      device.checkData();

      getDataTimeout = setTimeout(() => {
        getData(device);
      }, 1000);
    };

    let onRawData = message => {
      cancelLearning();

      return resolve({
        secret: Math.random()
          .toString(36)
          .substring(3),
        mac: macRegExp.test(host) ? host : false,
        ip: macRegExp.test(host) ? false : host,
        data: message.toString("hex")
      });
    };

    device.on("rawData", onRawData);

    // Start learning:
    device.enterLearning ? device.enterLearning() : device.enterRFSweep();
  } else {
    reject({ error: `Device ${host} not found` });
  }
});
