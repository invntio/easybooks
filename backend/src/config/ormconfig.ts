import { OrmConfig } from './orm.config.interface';

// Development postgresql connection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function devPostgresConnection() {
  return {
    database: {
      type: 'postgres',
      host: process.env['DATABASE_HOST'] || 'localhost',
      port: parseInt(process.env['DATABASE_PORT']) || 5432,
      database: process.env['DATABASE_NAME'] || 'inventiodb',
      username: process.env['DATABASE_USER'] || 'postgres',
      password: process.env['DATABASE_PASSWORD'],
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
