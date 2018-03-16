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
