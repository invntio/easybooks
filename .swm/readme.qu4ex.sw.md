---
id: qu4ex
title: README
file_version: 1.1.2
app_version: 1.4.7
---

<div align="center">

# `📕 Inventio`

**Inventio - An open-source inventory management system.**

[div align="center"](https://inventio.github.io) [div align="center"](https://inventio.github.io) [div align="center"](https://github.com/vvelc/inventio/issues) [div align="center"](https://github.com/vvelc/inventio/actions/workflows/build.yml) [div align="center"](https://sonarcloud.io/summary/new_code?id=vvelc_inventio) [div align="center"](https://sonarcloud.io/summary/new_code?id=vvelc_inventio) [div align="center"](https://codecov.io/gh/vvelc/inventio) [div align="center"](https://opensource.org/licenses/MIT)

</div>

## **Disclaimer - Project under construction**

This project is currently under early stages of construction.

It is **not recommended** to use it yet due to possible:

*   bugs
    
*   malfunctions
    
*   starting problems
    
*   security flaws
    

### Statuses

*   Backend: early develop stages.
    
*   Frontend: not started.
    

## Technologies Used

Inventio is built using the following technologies:

### Backend

[div align="center"](https://nestjs.com)

### Frontend

[div align="center"](https://angular.io)

### Database

[div align="center"](https://www.postgresql.org/)

### Containerization

[div align="center"](https://docker.com) [div align="center"](https://kubernetes.io)

### CI/CD

[div align="center"](https://github.com/features/actions) [div align="center"](https://argoproj.github.io/cd/)

### Hosting

[div align="center"](https://netlify.com/) [div align="center"](https://www.digitalocean.com/)

## Installation

To get started with Inventio, follow these steps:

### Requirements

Before installing Inventio, make sure you have the following requirements:

*   [Node.js](https://nodejs.org/)
    
*   [NestJS CLI](https://docs.nestjs.com/)
    
*   [Angular CLI](https://angular.io/cli)
    

### Download

Clone the project repository to your local machine:

```
git clone https://github.com/vvelc/inventio.git
```

### Backend

1.  Install backend dependencies:
    

```
# move to backend directory
cd inventio/backend
# Install dependencies
npm install
```

2.  Configure database settings.
    
    Note: Inventio uses PostgreSQL as its default database. You can configure your own database by setting the environment variables in the .env file.
    

```
DATABASE_HOST=your_database_host
DATABASE_PORT=your_database_port
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
```

Alternatively, you can use the default values:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=inventio
DATABASE_USER=postgres
DATABASE_PASSWORD=password
```

If you prefer to use a different database, you can change the typeorm configuration in the `config/ormconfig.js` file.

```
export default () => ({
  type: 'postgres',
  host: 'your_database_host',
  port: your_database_port,
  database: 'your_database_name',
  username: 'your_database_user',
  password: 'your_database_password',
  synchronize: true,
  logging: false,
  entities: ['src/**/*.entity.ts'],
});
```

3.  Start backend server:
    

```
# Start backend server
npm run start
```

### Frontend

1.  Install frontend dependencies:
    

```
# Move to frontend directory
cd inventio/frontend
# Install dependencies
npm install
```

2.  Start frontend server:
    

```
# Start frontend server
npm run start
```

## Usage

Once the system is up and running, users can use the frontend to perform the following actions:

*   View existing products in the database
    
*   Add new products
    
*   Update existing product information
    
*   Delete products
    
*   Generate reports
    

The frontend can be accessed through your web browser at [http://localhost:4200](http://localhost:4200) .

The backend exposes a RESTful API that allows users to perform these actions and can be accessed via [http://localhost:3000/api](http://localhost:3000/api).

## Development and Contributing

### Architecture

The backend is built with NestJS and uses a module-based architecture. Each module is responsible for a specific function, such as authentication, product management, and order management.

The frontend is built with Angular and follows a component architecture. Each component represents a section of the user interface, such as the product list, product creation form, and product details view.

### Coding style guide

The project follows the coding style guides recommended by NestJS and Angular. It is recommended that project contributors follow these guidelines to maintain code consistency and ease of maintenance.

For more information about coding style guides, please see the following:

*   [NestJS coding style guides](https://github.com/nestjs/awesome-nestjs#code-style)
    
*   [Angular coding style guides](https://angular.io/guide/styleguide)
    

### Unit tests

The project includes a suite of unit tests that can be run using the `npm run test` command in the backend or frontend directory. It is recommended that contributors add additional tests as they add new features and make changes to existing code.

### Contributing

div align="center" (CODE_OF_CONDUCT.md)

We appreciate feedback and contribution to this project! Before you get started, please see the following:

*   Inventio's Contributor Guidelines (CONTRIBUTING.md)
    
*   Inventio's Contributor Terms (CONTRIBUTING.md#contributor-terms)
    

Any contribution intentionally submitted for inclusion in the Inventio project, shall comply with the MIT License and therefore licensed as described below, without any additional terms or conditions:

## License

Inventio is licensed under the MIT License. See LICENSE (LICENSE) for more information.

## Support

If you encounter any issues with Inventio or have any questions, please submit an issue or contact us at [victorvelazquezcidgmail.com](mailto:rvlazecid@gmail.m)

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBaW52ZW50aW8lM0ElM0F2dmVsYw==/docs/qu4ex).
