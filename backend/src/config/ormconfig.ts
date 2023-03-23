import { OrmConfig } from './orm.config.interface';

// Development postgresql connection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function devPostgresConnection() {
  return {
    database: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'inventiodb',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      //logging: false,
      autoLoadEntities: true,
    } as OrmConfig,
  };
}

// Development Sqlite connection
function devSqliteConnection() {
  return {
    database: {
      type: 'sqlite',
      host: 'localhost',
      database: 'inventiodb.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    } as OrmConfig,
  };
}

export default devSqliteConnection;
