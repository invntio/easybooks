<!-- Allow this file to not have a first line heading -->
<!-- markdownlint-disable-file MD041 no-emphasis-as-heading -->

<!-- inline html -->
<!-- markdownlint-disable-file MD033 -->

<div align="center">

# `📕 Inventio`

**Inventio - An open-source inventory management system.**


<!-- [![Inventio](https://img.shields.io/badge/discord-tio-%237289da.svg?logo=discord)](https://discord.gg/dAuKfZS) -->


[![Inventio](https://img.shields.io/website?url=https%3A%2F%2Finventio.github.io)](https://inventio.github.io)
[![Docs](https://img.shields.io/badge/docs-open%20source-orange.svg)](https://inventio.github.io)
[![GitHub issues](https://img.shields.io/github/issues/vvelc/inventio)](https://github.com/vvelc/inventio/issues)
[![Build](https://github.com/vvelc/inventio/actions/workflows/build.yml/badge.svg)](https://github.com/vvelc/inventio/actions/workflows/build.yml)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=vvelc_inventio&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=vvelc_inventio)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vvelc_inventio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vvelc_inventio)
[![codecov](https://codecov.io/gh/vvelc/invntio/branch/main/graph/badge.svg?token=V6WDKGCSP7)](https://codecov.io/gh/vvelc/invntio)
[![License: MIT](https://img.shields.io/github/license/vvelc/invntio?color=%239d2235)](https://opensource.org/licenses/MIT)

<!-- [![Donate: Paypal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/vvelc) -->

<!-- TODO: Code Coverage -->
<!-- TODO: Paypal Donate Profile -->
<!-- TODO: Discord Group -->
</div>

---

## **Disclaimer - Project under construction**
This project is currently under early stages of construction.

It is **not recommended** to use it yet due to possible:
- bugs
- malfunctions
- starting problems
- security flaws

### Statuses
* Backend: early develop stages.
* Frontend: not started.

---

## Technologies Used
Inventio is built using the following technologies:

### Backend
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)

### Frontend
[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)

### Database
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Containerization
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)

### CI/CD
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![ArgoCD](https://img.shields.io/badge/argoCD-%23103D66.svg?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/cd/)

### Hosting
[![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)](https://netlify.com/)
[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-%230167ff.svg?style=for-the-badge&logo=digitalOcean&logoColor=white)](https://www.digitalocean.com/)

## Installation
To get started with Inventio, follow these steps:

### Requirements
Before installing Inventio, make sure you have the following requirements:
* [Node.js](https://nodejs.org/)
* [NestJS CLI](https://docs.nestjs.com/)
* [Angular CLI](https://angular.io/cli)

### Download
Clone the project repository to your local machine:

``` bash
git clone https://github.com/vvelc/inventio.git
```

### Backend

1. Install backend dependencies:

```bash
# move to backend directory
cd inventio/backend
# Install dependencies
npm install
```

2. Configure database settings.

    Note: Inventio uses PostgreSQL as its default database. You can configure your own database by setting the environment variables in the .env file.

``` dosini
DATABASE_HOST=your_database_host
DATABASE_PORT=your_database_port
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
```

Alternatively, you can use the default values:

``` dosini
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=inventio
DATABASE_USER=postgres
DATABASE_PASSWORD=password
```

If you prefer to use a different database, you can change the typeorm configuration in the `config/ormconfig.js` file.

``` js
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

3. Start backend server:

``` bash
# Start backend server
npm run start
```

### Frontend

1. Install frontend dependencies:

``` bash
# Move to frontend directory
cd inventio/frontend
# Install dependencies
npm install
```

2. Start frontend server:

``` bash
# Start frontend server
npm run start
```

## Usage
Once the system is up and running, users can use the frontend to perform the following actions:

* View existing products in the database
* Add new products
* Update existing product information
* Delete products
* Generate reports

The frontend can be accessed through your web browser at http://localhost:4200  .

The backend exposes a RESTful API that allows users to perform these actions and can be accessed via http://localhost:3000/api.

## Development and Contributing

### Architecture
The backend is built with NestJS and uses a module-based architecture. Each module is responsible for a specific function, such as authentication, product management, and order management.

The frontend is built with Angular and follows a component architecture. Each component represents a section of the user interface, such as the product list, product creation form, and product details view.

### Coding style guide
The project follows the coding style guides recommended by NestJS and Angular. It is recommended that project contributors follow these guidelines to maintain code consistency and ease of maintenance.

For more information about coding style guides, please see the following:

* [NestJS coding style guides](https://github.com/nestjs/awesome-nestjs#code-style)
* [Angular coding style guides](https://angular.io/guide/styleguide)

### Unit tests
The project includes a suite of unit tests that can be run using the `npm run test` command in the backend or frontend directory. It is recommended that contributors add additional tests as they add new features and make changes to existing code.

### Contributing

[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v0.1-violet.svg)](CODE_OF_CONDUCT.md)

We appreciate feedback and contribution to this project! Before you get started, please see the following:

* [Inventio's Contributor Guidelines](CONTRIBUTING.md)
* [Inventio's Contributor Terms](CONTRIBUTING.md#contributor-terms)

Any contribution intentionally submitted for inclusion in the Inventio project, shall comply with the MIT License and therefore licensed as described below, without any additional terms or conditions:

## License
Inventio is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

## Support
If you encounter any issues with Inventio or have any questions, please submit an issue or contact us at victorvelazquezcid@gmail.com
