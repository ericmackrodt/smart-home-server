module.exports.default = host => {
  const Broadlink = require("./broadlink");

  let device = Broadlink({ host, learnOnly: true });
  if (device) {
    if (!device.enterLearning)
      return console.log(JSON.stringify({
        error: `Learn Code (IR learning not supported for device at ${host})`
      }));
    if (!device.enterLearning && !device.enterRFSweep)
      return console.log(JSON.stringify({
        error: `Scan RF (RF learning not supported for device at ${host})`
      }));

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

      return console.log(JSON.stringify({
        command: req.params.command,
        secret: Math.random()
          .toString(36)
          .substring(3),
        mac: macRegExp.test(host) ? host : false,
        ip: macRegExp.test(host) ? false : host,
        data: message.toString("hex")
      }));
    };

    device.on("rawData", onRawData);

    // Start learning:
    device.enterLearning ? device.enterLearning() : device.enterRFSweep();
  } else {
    console.log(JSON.stringify({ error: `Device ${host} not found` }));
  }
};
