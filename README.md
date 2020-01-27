# XY Inc

> A geolocation system to manage POIs (Point Of Interest)


<br>


[![Build Status](https://travis-ci.org/Potentii/xy-inc.svg?branch=master)](https://travis-ci.org/Potentii/xy-inc)


<br>


You can visit the app on [xy-inc-potentii.herokuapp.com](https://xy-inc-potentii.herokuapp.com/) (_The API is under [/api/v1](https://xy-inc-potentii.herokuapp.com/api/v1)_)

![XY Inc](./docs/demo.gif?raw=true "XY Inc demo")


<br>


## Table of contents

- [The project](#the-project)
- [Running](#running)
  - [Environments](#environments)
- [Endpoints](#endpoints)
- [Testing](#testing)
  - [Making requests](#making-requests)
- [License](#license)


<br>


## The project


The project is structured as a monorepo, with the following packages:

- **api:** The server that contains the core logic of the system, provides endpoint to operate with the data.

- **ui:** The frontend application, that consumes the API.

- **common:** Logic and utils shared between the other packages.

- **db:** Not actually a package, but contains the database compose configuration for development.


The tech stack is composed of [Node.js](https://nodejs.org/) on the backend, [MongoDB](https://www.mongodb.com/) as the database, and [Vue.js](https://vuejs.org/) to build the frontend.


<br>


## Running

In order to execute the application, please note that you must have [Node.js](https://nodejs.org/) installed, preferably version [v11.14.0](https://nodejs.org/dist/v11.14.0/), and [yarn](https://yarnpkg.com/) as well.

To **install the dependencies** and **prepare the packages**, please run:

```bash
$ yarn install
```

and

```bash
$ yarn run bootstrap
```

After that simply run the following to **build** and **start** the application:

```bash
$ yarn run build
```

and

```bash
$ yarn run start
```

This last command will start a server on [http://localhost:1234](http://localhost:1234) that serves both the API (_under [/api/v1](http://localhost:1234/api/v1)_) and the web server that gives access to the system's UI (_in the [root url](http://localhost:1234/)_).


### Environments

The environment (_set by the `NODE_ENV` variable_) is very important to determine which database, bundle directory, etc... should be used by the application at runtime, the possible values are the following:

- **development:** The default env when running the application, uses the `/packages/api/.env.development` env file (_you can change this file to point to another database for example_).

- **production:** If you set to production, all the other env variables (_like the database connection for example_) must be provided as well by the environment (_this environment is intended to be used by CI only_).


<br>


## Endpoints

The API exposes **two** main REST endpoints:


<br>


**1. `POST /api/v1/pois`**

Creates a new POI (Point Of Interest) on the map.

**Body**

- **name** `string`: The name of the POI (_may not unique_).

- **x** `number`: The X component of the coordinate (_only positive integers_).

- **y** `number`: The Y component of the coordinate (_only positive integers_).

**Example:**

```json
{
  "data": {
    "name": "Gas station",
    "x": 12,
    "y": 14
  }
}
```


<br>


**2. `GET /api/v1/pois`**

Searches for all POIs placed on the map.

A **filter** could be applied to search on a **specific area**, for example:

`GET /api/v1/pois?x=10&y=8&radius=12`

This will narrow down the search to a `12m` radius circle on `x 10` `y 8`.


<br>


## Testing

To run the tests, simply execute this command:

```bash
$ yarn run test
```

### Making requests

To make requests to the API using a standalone HTTP client, please follow the **request/response envelope** patterns bellow.

To perform a request using a body (a POST for example), the actual data should be put into the `data` field:

**Request envelope**

```json
{
  "data": ...
}
```

**Response envelope**

```json
{
  "data": ... ,
  "error": ...
}
```

**For example:**

A request to `POST http://localhost:1234/api/v1/pois` should have a body like this:

```json
{
  "data": {
    "name": "My POI name",
    "x": 5,
    "y": 22
  }
}
```

This request will create a new POI using the API.



<br>


## License
[MIT](LICENSE)
