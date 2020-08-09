# OPIS-Manager
This tool performs the data visualization of the OPIS results. [Live Demo](https://unict-dmi.github.io/OPIS-Manager/) 

## About this repo
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## How to setup the project

### Backend setup

Before starting the UI, you must have the backend fully working on your machine. Follow the instruction in the [OPIS Manager backend repo](https://github.com/UNICT-DMI/opis-manager-core).

### Application setup

First of all, install the required dependencies with:
`$ npm install`

Install the last version of angular-cli to run the app locally with:
`$ npm install -g @angular/cli`

Configure the years and the API path, so copy src/assets/config.json.dist into src/assets/config.json and configure the related years and API url, like:

```
{
  "apiUrl": "http://localhost:8000/api/v2/",
  "years": ["2013/2014", "2014/2015", "2016/2017", "2017/2018", "2018/2019"]
}
```

Finally can run the front-end application with `$ ng serve -o`  then navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


### Credits

- Stefano Borzì (Helias)
- Pierpaolo Pecoraio
- Lemuel Puglisi
- Alessandro Catalano (Wornairz)
- Simone Scionti
- Alessio Piazza
- Diego Sinitò
