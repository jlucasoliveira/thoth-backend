import { DataSource } from 'typeorm';
import { ORACLE_CONFIG } from './configuration';
import { OracleConnectionOptions } from 'typeorm/driver/oracle/OracleConnectionOptions';

export function oracleConnectionConfig(): OracleConnectionOptions {
  return {
    type: 'oracle',
    username: ORACLE_CONFIG.username,
    password: ORACLE_CONFIG.password,
    connectString: ORACLE_CONFIG.connectString,
    synchronize: false,
    logging: ORACLE_CONFIG.isDebug ? 'all' : false,
    logger: ORACLE_CONFIG.isDebug ? 'file' : 'advanced-console',
    entities: [ORACLE_CONFIG.entitiesPath],
    migrations: [ORACLE_CONFIG.migrationsPath],
    useUTC: true,
    extra: {
      walletLocation: ORACLE_CONFIG.walletPath,
      walletPassword: ORACLE_CONFIG.walletPassword,
      configDir: ORACLE_CONFIG.walletPath,
    },
  };
}

// To use on typeorm cli
export default new DataSource(oracleConnectionConfig());
