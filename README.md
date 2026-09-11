# Svc

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.3.

A sales-forecasting app: Angular frontend + Flask API, deployed together as **one Render web service**.

- `src/` — the Angular app (plain client-side SPA, no SSR).
- `backend/` — the Flask API (`app.py`, `predict.py`, sample data, etc.).
- `Dockerfile` — builds the Angular app, then packages it with the Flask backend into a single image. Flask serves the built static files *and* the API from the same process/port.

## Backend URL

`src/environments/environment.ts` (dev) points `apiUrl` at `http://localhost:5000` for local development against a separately-running Flask server. `environment.prod.ts` sets `apiUrl: ''` (relative/same-origin), since in production Flask serves both the app and the API from the same host.

## Deploying on Render

Deploy as a **Web Service** using the Docker runtime (a `render.yaml` is included, or set manually):

- Runtime: Docker
- Dockerfile path: `./Dockerfile`
- Render sets `PORT` automatically; `backend/app.py` and the Dockerfile's `CMD` both read it.

That's it — one service, one URL, no CORS to configure for production.

## Local development

Run the two pieces separately so Angular's dev server can hot-reload:

```bash
# Terminal 1 — backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py            # http://localhost:5000

# Terminal 2 — frontend
npm install
npm start                 # http://localhost:4200, talks to localhost:5000
```

To run it the way it deploys (one process, one port), build the frontend first and let Flask serve it:

```bash
npm run build              # outputs dist/svc/browser
cd backend
python app.py               # now also serves the built frontend at http://localhost:5000
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
