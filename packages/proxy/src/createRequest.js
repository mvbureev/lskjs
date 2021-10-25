import { isDev } from '@lskjs/env';
import Err from '@lskjs/err';
import retry from '@lskjs/utils/retry';
import axios from 'axios';

import { createFeedback as defaultCreateFeedback } from './utils/createFeedback';
import { isNetworkError } from './utils/isNetworkError';

export const NETWORK_TIMEOUT = isDev ? 1000 : 10000;
export const NETWORK_TRIES = isDev ? 2 : 5;
export const NETWORK_INTERVAL = isDev ? 100 : 1000;

// TODO: дописать
export const getProviderOptions = (proxy, driver) => (proxy ? proxy.getProviderOptions(driver) : {});

// const createNoop = () => ({ success: () => null, error: () => null });

export const createRequest =
  ({ createFeedback = defaultCreateFeedback, ...feedbackOptions } = {}) =>
  (props = {}) => {
    const {
      driver = 'axios',
      max_tries: maxTries = NETWORK_TRIES,
      timeout = NETWORK_TIMEOUT,
      interval = NETWORK_INTERVAL,
      proxy: initProxy,
      ...params
    } = props;
    if (driver !== 'axios') throw new Err('REQUEST_DRIVER', 'driver not realized yet', { driver });
    let tries = 0;
    return retry(
      async () => {
        let proxy;
        if (initProxy) proxy = initProxy;
        const proxyManager = await (props.proxyManager || feedbackOptions.proxyManager); // TODO: подумать а не замудренно ли
        if (!proxy && proxyManager) proxy = await proxyManager.getProxy();
        const options = { ...params, ...getProviderOptions(proxy, driver) };
        tries += 1;
        const feedback = createFeedback
          ? createFeedback({ options: props, proxy, tries, maxTries }, { ...feedbackOptions, proxyManager }) // TODO: подумать а не замудренно ли
          : null;
        try {
          let abortTimeout;
          if (timeout && !params.cancelToken) {
            const { CancelToken } = axios;
            const source = CancelToken.source();
            options.cancelToken = source.token;
            abortTimeout = setTimeout(() => source.cancel('REQUEST_NETWORK_TIMEOUT'), timeout);
          }
          const res = await axios(options);
          if (abortTimeout) clearTimeout(abortTimeout);
          if (feedback) await feedback.success();
          return res;
        } catch (initErr) {
          const errCode = Err.getCode(initErr);
          if (feedback) await feedback.error(initErr);
          proxy = null;
          let err;
          if (isNetworkError(initErr)) {
            err = new Err('REQUEST_NETWORK', initErr, { subcode: errCode, class: 'network', tries, maxTries });
          } else {
            err = new Err(initErr);
          }
          Err.copyProps(err, initErr);
          if (!isNetworkError(initErr)) throw retry.StopError(err); // exit right now
          throw err; // try one again
        }
      },
      {
        throw_original: true,
        interval,
        max_tries: maxTries,
      },
    );
  };

export default createRequest;