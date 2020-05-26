import "requestidlecallback-polyfill";

export async function run(
  coroutine,
  loopWhileMsRemains = 1,
  timeout = 16 * 10
) {
  const options = { timeout };
  let terminated = false;
  let resolver = null;
  const result = new Promise(function (resolve, reject) {
    resolver = resolve;
    const iterator = coroutine();
    window.requestIdleCallback(run);

    function run(api) {
      if (terminated) {
        iterator.return();
        return;
      }
      const minTime = Math.max(0.5, loopWhileMsRemains);
      try {
        do {
          const { value, done } = iterator.next();
          if (done) {
            resolve(value);
            return;
          }
          if (value === true) {
            break;
          }
        } while (api.timeRemaining() > minTime);
      } catch (e) {
        reject(e);
        return;
      }

      window.requestIdleCallback(run, options);
    }
  });
  result.terminate = function (result) {
    terminated = true;
    if (resolver) {
      resolver(result);
    }
  };
  return result;
}

export async function update(coroutine) {
  let terminated = false;
  let resolver = null;
  const result = new Promise(function (resolve, reject) {
    resolver = resolve;
    const iterator = coroutine();
    window.requestAnimationFrame(run);

    function run() {
      if (terminated) {
        iterator.return();
        return;
      }

      try {
        const { value, done } = iterator.next();
        if (done) {
          resolve(value);
          return;
        }
      } catch (e) {
        reject(e);
        return;
      }

      window.requestAnimationFrame(run);
    }
  });
  result.terminate = function (result) {
    terminated = true;
    if (resolver) {
      resolver(result);
    }
  };
  return result;
}

export async function runAsync(
  coroutine,
  loopWhileMsRemains = 1,
  timeout = 160
) {
  const options = { timeout };
  let terminated = false;
  let resolver = null;
  const result = new Promise(async function (resolve, reject) {
    resolver = resolve;
    const iterator = await Promise.resolve(coroutine());
    window.requestIdleCallback(run);

    async function run(api) {
      if (terminated) {
        iterator.return();
        return;
      }
      const minTime = Math.max(0.5, loopWhileMsRemains);
      try {
        do {
          const { value, done } = await iterator.next();
          if (done) {
            resolve(value);
            return;
          }
          if (value === true) {
            break;
          }
        } while (api.timeRemaining() > minTime);
      } catch (e) {
        reject(e);
        return;
      }

      window.requestIdleCallback(run, options);
    }
  });
  result.terminate = function (result) {
    terminated = true;
    if (resolver) {
      resolver(result);
    }
  };
  return result;
}

export default run;
