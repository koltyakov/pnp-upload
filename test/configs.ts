import { config } from 'dotenv';
import { IEnvironmentConfig, ICiEnvironmentConfig, IPrivateEnvironmentConfig } from './interfaces';

config();

const ci = process.argv.slice(2).indexOf('--ci') !== -1;
if (ci) { process.env.SPAUTH_ENV = 'production'; }

export const Environments: IEnvironmentConfig[] = ((headless: boolean) => {
  if (headless) {
    const ciTestConf: ICiEnvironmentConfig[] = [{
      environmentName: 'SharePoint Online',
      siteUrl: process.env.SPAUTH_SITEURL,
      authOptions: {
        username: process.env.SPAUTH_USERNAME,
        password: process.env.SPAUTH_PASSWORD
      }
    }];
    return ciTestConf;
  }
  const privateConf: IPrivateEnvironmentConfig[] = [{
    environmentName: 'SharePoint Online',
    configPath: './config/integration/private.spo.json'
  }];
  return privateConf;
})(ci);

export { IEnvironmentConfig, ICiEnvironmentConfig, IPrivateEnvironmentConfig } from './interfaces';
