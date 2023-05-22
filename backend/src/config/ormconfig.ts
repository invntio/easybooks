import { OrmConfig } from './ormconfig.interface';
import { ConfigService } from '@nestjs/config';

type SUPPORTED_DATABASE_TYPES = 'postgres' | 'sqlite';

const ormConfig = (configService: ConfigService): OrmConfig => {
  const nodeEnv: string = configService.get('NODE_ENV');

  if (!nodeEnv) {
    throw new Error(`Environment mode not provided`);
  }

  if (!['prod', 'dev', 'test'].includes(nodeEnv)) {
    throw new Error(`Unsupported environment mode: ${nodeEnv}`);
  }

  const upperCaseNodeEnv = nodeEnv.toUpperCase();

  const nodeDbType = configService.get<string>(
    `${upperCaseNodeEnv}_DATABASE_TYPE`,
  );

  if (!['postgres', 'sqlite'].includes(nodeDbType)) {
    throw new Error(`Unsupported database type: ${nodeDbType}`);
  }

  const dbType = nodeDbType as SUPPORTED_DATABASE_TYPES;
  const host = configService.get<string>(`${upperCaseNodeEnv}_DATABASE_HOST`);
  const port = configService.get<number>(`${upperCaseNodeEnv}_DATABASE_PORT`);
  const username = configService.get<string>(
    `${upperCaseNodeEnv}_DATABASE_USERNAME`,
  );
  const password = configService.get<string>(
    `${upperCaseNodeEnv}_DATABASE_PASSWORD`,
  );
  const database = configService.get<string>(
    `${upperCaseNodeEnv}_DATABASE_NAME`,
  );

  return {
    type: dbType,
    host,
    port,
    username,
    password,
    database,
    autoLoadEntities: true,
    synchronize: true,
  } as OrmConfig;
};

export default ormConfig;
