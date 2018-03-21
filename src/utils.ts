import * as fs from 'fs';

export function promiseRoute(fn) {
  return (req, res) => {
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error('Timed out in '+ 5000 + 'ms.'))
      }, 5000);
    });

    return Promise.race([
      fn(req),
      timeout
    ])
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send(err.message));
  };
};

export const addCommandToJson = (file, command) => new Promise((resolve, reject) => {
  fs.readFile(file, (err, data) => {
    if (err) return reject(err);
    const json = JSON.parse(data);
    json.push(command);
    fs.writeFile(file, JSON.stringify(json), (err) => {
      if (err) return reject(err);
      resolve(json);
    });
  });
});

export const loadFile = (file) => new Promise((resolve, reject) => {
  fs.readFile(file, (err, data) => {
    if (err) return reject(err);
    resolve(JSON.parse(data));
  });
});
