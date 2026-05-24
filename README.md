# OPIS-Manager

# ![OPIS Manager](./public/logo-static.webp)

[![CodeFactor](https://www.codefactor.io/repository/github/unict-dmi/opis-manager/badge)](https://www.codefactor.io/repository/github/unict-dmi/opis-manager)

A **frontend Angular application** for visualizing and managing OPIS results.  
The project is designed to work in conjunction with a backend service and provides a modern Single Page Application (SPA) interface.

---

## 📌 Live Demo

The application is available online at:  
👉 https://unict-dmi.github.io/OPIS-Manager/

---

## 🧠 About

OPIS-Manager is the frontend layer of an OPIS results management system.  
It has been bootstrapped with [Angular CLI](https://github.com/angular/angular-cli) and follows Angular best practices regarding project structure, modularity, and maintainability.

The application communicates with a backend service to retrieve and display data; without the backend running, most features will not function correctly.

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### 🛠 Prerequisites

- **Node.js** (tested with Node v24.11.1; other recent 24.x versions should work)
- **Angular CLI**
- A running instance of the compatible backend

### 🔌 Backend Setup

Before starting the frontend application, make sure the backend is up and running.  
Follow the setup instructions available in the official OPIS Manager backend repository:  
https://github.com/UNICT-DMI/opis-manager-core

### 📥 Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ChiaraZuccaro/OPIS-Manager.git
   cd OPIS-Manager
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   npm i
   ```

### 🌍 Environment Configuration

The configuration lives in `src/environment.ts`, a committed source file holding public values
(the API base URL and the GitHub API URL). Edit it directly to change them — no `.env` file or
generation step is required.

### 🧪 Development Server

Start the local development server with:

```sh
npm start
```

or

```sh
ng serve
```

Then open `http://localhost:4200/` in your browser.  
The application will automatically reload when you modify source files.

---

## ⚙️ Code Scaffolding

You can generate new Angular artifacts using the Angular CLI:

```sh
ng generate component component-name
ng generate service service-name
```

To see all available schematics:

```sh
ng generate --help
```

---

## 📦 Build

To build the project run:

```sh
npm run build
```

or

```sh
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

---

## 🧪 Tests

### Unit Tests

Run unit tests with:

```sh
npm run test
```

or

```sh
ng test
```

Unit testing is configured using **[Vitest](https://vitest.dev/)**.

### End-to-End Tests

```sh
ng e2e
```

Angular CLI does not include an E2E test runner by default, so you can integrate the one that best suits your needs.

---

## 🧾 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

---

## 🙌 Credits

Contributors include:

- Stefano Borzì (Helias)
- Pierpaolo Pecoraio
- Lemuel Puglisi
- Alessandro Catalano (Wornairz)
- Simone Scionti
- Alessio Piazza
- Diego Sinitò
- Salvo Asero
  <<<<<<< HEAD
- Chiara Zuccaro

---

## 📌 Notes

- The backend service must be running for the application to function correctly.
- # The project relies entirely on standard Angular CLI tooling for development, testing, and building.

```

```

> > > > > > > master
