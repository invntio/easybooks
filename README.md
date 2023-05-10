<!-- Allow this file to not have a first line heading -->
<!-- markdownlint-disable-file MD041 no-emphasis-as-heading -->

<!-- inline html -->
<!-- markdownlint-disable-file MD033 -->

<div align="center">
    
<p align="center">
    <img src="https://user-images.githubusercontent.com/76626605/229325142-54538aa5-1fd8-45a6-b91d-f484ad086be0.png" width="480">
</p>

**Invntio - An open-source inventory management system.**


<!-- [![Invntio](https://img.shields.io/badge/discord-tio-%237289da.svg?logo=discord)](https://discord.gg/dAuKfZS) -->


[![Invntio](https://img.shields.io/website?url=https%3A%2F%2Finvntio.com)](https://invntio.com)
[![Docs](https://img.shields.io/badge/docs-open%20source-teal.svg)](https://invntio.mintlify.app)
[![GitHub issues](https://img.shields.io/github/issues/invntio/invntio)](https://github.com/invntio/invntio/issues)
[![Build](https://github.com/invntio/invntio/actions/workflows/build.yml/badge.svg)](https://github.com/invntio/invntio/actions/workflows/build.yml)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=vvelc_inventio&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=vvelc_inventio)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vvelc_inventio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vvelc_inventio)
[![codecov](https://codecov.io/gh/invntio/invntio/branch/main/graph/badge.svg?token=V6WDKGCSP7)](https://codecov.io/gh/invntio/invntio)
[![License: MIT](https://img.shields.io/github/license/invntio/invntio?color=%239d2235)](https://opensource.org/licenses/MIT)
[![Twitter](https://img.shields.io/twitter/follow/invntio?style=social&label=Follow)](https://twitter.com/invntio)
<!-- [![Donate: Paypal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/vvelc) -->

<!-- TODO: Paypal Donate Profile -->
<!-- TODO: OpenCollective Profile -->
<!-- TODO: Discord Group -->
</div>

---

## **Disclaimer - Project under construction**
This project is currently under early stages of construction.

It is **not recommended** to use it yet due to possible:
- bugs 🐛
- malfunctions ⛔
- missing features 🔍
- starting problems 😔
- security flaws 🔓

### Statuses
* Backend: early develop stages. ⚠
* Frontend: not started. ⛔

---
## What is Invntio?

<!-- Invntio is a cloud-based inventory management solution designed to streamline your business operations. With a user-friendly interface and powerful features for tracking inventory, orders, and customers, Invntio empowers you to manage your business with ease.  -->

Invntio is an open-source, module-based, inventory management solution designed to streamline your business operations. With its simple understanding and powerful features for tracking inventory, orders, and customers, Invntio empowers you to manage your business with ease.

From small businesses to large enterprises, Invntio scales to meet your needs, improving every day to help you overcome the challenges that your business faces.

With Invntio, you can focus on what you do best - growing your business 🚀.

## Technologies Used
Invntio is built using the following technologies:

### Backend
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)

<!-- ### Frontend
[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io) -->

### Database
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Postgres](https://img.shields.io/badge/sqlite-blue.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.postgresql.org/)


### Containerization
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)

### CI/CD
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![ArgoCD](https://img.shields.io/badge/argoCD-%23103D66.svg?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/cd/)

### Hosting
[![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)](https://netlify.com/)
[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-%230167ff.svg?style=for-the-badge&logo=digitalOcean&logoColor=white)](https://www.digitalocean.com/)

### Documentation
[![Mintlify](https://custom-icon-badges.demolab.com/badge/Mintlify-black?style=for-the-badge&logo=mintlify)](https://mintlify.com/)
## Installation
To get started with Invntio, follow these steps:

### Requirements
Before installing Invntio, make sure you have the following requirements:
* [Node.js](https://nodejs.org/)
* [NestJS CLI](https://docs.nestjs.com/)
* [Angular CLI](https://angular.io/cli)

### Download
Clone the project repository to your local machine:

``` bash
git clone https://github.com/vvelc/invntio.git
```

### Setup

#### 1. Install backend dependencies:

```bash
# move to backend directory
cd invntio/backend
# Install dependencies
npm install
```

#### 2. Configure database settings.

> Note: Invntio currently supports the following databases:
> * PostgreSQL
> * SQLite
>
> Make sure you use one of these in your configuration files

There are 4 configuration files you must configure in order to use Invntio properly

<p class="codeblock-label">.env</p>

``` dosini
NODE_ENV=dev # This can be prod, dev or test
```

<p class="codeblock-label">.env.prod</p>

``` dosini
PROD_DATABASE_HOST=your_prod_database_host
PROD_DATABASE_PORT=your_prod_database_port
PROD_DATABASE_NAME=your_prod_database_name
PROD_DATABASE_USER=your_prod_database_user
PROD_DATABASE_PASSWORD=your_prod_database_password
```

<p class="codeblock-label">.env.dev</p>

``` dosini
DEV_DATABASE_HOST=your_dev_database_host
DEV_DATABASE_PORT=your_dev_database_port
DEV_DATABASE_NAME=your_dev_database_name
DEV_DATABASE_USER=your_dev_database_user
DEV_DATABASE_PASSWORD=your_dev_database_password
```

<p class="codeblock-label">.env.test</p>

``` dosini
TEST_DATABASE_HOST=your_test_database_host
TEST_DATABASE_PORT=your_test_database_port
TEST_DATABASE_NAME=your_test_database_name
TEST_DATABASE_USER=your_test_database_user
TEST_DATABASE_PASSWORD=your_test_database_password
```

> We are considering using YAML or another type of config file to use fewer files

For more information about database configuration, please refer to [database documentation](https://inventio.mintlify.app/docs/self-hosting/self-hosting/database).

#### 3. Start backend server:

``` bash
# Start backend server in development mode
npm run start:dev
```

<!-- ### Frontend

1. Install frontend dependencies:

``` bash
# Move to frontend directory
cd invntio/frontend
# Install dependencies
npm install
```

2. Start frontend server:

``` bash
# Start frontend server
npm run start
``` -->

## Usage
<!-- Once the system is up and running, users can use the frontend to perform actions like: -->

<!-- The frontend can be accessed through your web browser at http://localhost:4200. -->

The backend exposes a RESTful API that allows users to perform actions like:

* View existing products in the database
* Add new products
* Update existing product information
* Delete products
* Generate reports
* Manage customers
* Manage organization users

Once the system is up and running, users can consume the API to perfom these actions via http://localhost:3000/api.

For more information about features, please refer to the [documentation](https://inventio.mintlify.app).

## Development and Contributing

### Architecture
The backend is built with NestJS and uses a module-based architecture. Each module is responsible for a specific function, such as authentication, product management, order management, etc.

We are using a [CLEAN Arquitecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) approach, trying to achieve a reliable and scalable architecture

For more information about Invntio's architecture, please refer to [arquitecture documentation](https://inventio.mintlify.app/docs/introduction/getting-started/arquitecture)

<!-- The frontend is built with Angular and follows a component architecture. Each component represents a section of the user interface, such as the product list, product creation form, and product details view. -->

### Coding style guide
The project follows the coding style guides recommended by NestJS and Angular. It is recommended that project contributors follow these guidelines to maintain code consistency and ease of maintenance.

For more information about coding style guides, please see the following:

* [NestJS coding style guides](https://github.com/nestjs/awesome-nestjs#code-style)
* [Angular coding style guides](https://angular.io/guide/styleguide)

### Unit tests
<!-- The project includes a suite of unit tests that can be run using the `npm run test` command in the backend or frontend directory. It is recommended that contributors add additional tests as they add new features and make changes to existing code. -->

The project includes a suite of unit tests that can be run using the `npm run test` command in the backend directory. It is recommended that contributors add additional tests as they add new features and make changes to existing code.

For more information about tests, please refer to [tests documentation](https://inventio.mintlify.app/docs/self-hosting/self-hosting/testing)

### Contributing

[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v0.1-violet.svg)](CODE_OF_CONDUCT.md)

We appreciate feedback and contribution to this project! Before you get started, please see the following:

* [Invntio's Contributor Guidelines](CONTRIBUTING.md)
* [Invntio's Contributor Terms](CONTRIBUTING.md#contributor-terms)

Any contribution intentionally submitted for inclusion in the Invntio project, shall comply with the MIT License and therefore licensed as described below, without any additional terms or conditions:

## License
Inventio is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

## Support
If you encounter any issues with Inventio or have any questions, please submit an issue or contact us at victorvelazquezcid@gmail.com
