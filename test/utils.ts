import { AuthConfig } from 'node-sp-auth-config';
import { ICiEnvironmentConfig, IPrivateEnvironmentConfig, IEnvironmentConfig } from './configs';

export const getAuthConf = (config: IEnvironmentConfig) => {
  const proxySettings =
    typeof (config as IPrivateEnvironmentConfig).configPath !== 'undefined'
    ? { // Local test mode
      configPath: (config as IPrivateEnvironmentConfig).configPath
    }
    : { // Headless/CI mode
      authConfigSettings: {
        headlessMode: true,
        authOptions: {
          siteUrl: (config as ICiEnvironmentConfig).siteUrl,
          ...(config as ICiEnvironmentConfig).authOptions
        }
      }
    };
  return proxySettings;
};

export const getAuth = (config: IEnvironmentConfig) => {
  const authConf = getAuthConf(config);
  return new AuthConfig({
    configPath: authConf.configPath,
    ...authConf.authConfigSettings || {}
  }).getContext();
};
