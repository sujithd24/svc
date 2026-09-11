# Sales Forecasting App

A web app that forecasts future sales from historical data. Upload a CSV (or use the built-in sample dataset), choose how many months ahead to forecast, and get back a chart comparing actual vs. forecasted sales along with model accuracy metrics.

**Live demo:** https://svc-kbb5.onrender.com

> Hosted on Render's free tier — the first request after a period of inactivity can take 30–60 seconds to wake up.

## Overview

The app takes a store's sales history and produces a forward-looking forecast using time-series modeling (SARIMAX). It's built as a self-contained tool: no login required, no setup needed to try it — open the link, run a forecast, see the result.

## Key Features

- **One-click sample data** — try the whole workflow instantly with a built-in sample dataset, no file required.
- **Upload your own data** — works with any CSV that has `Order Date` and `Sales` columns.
- **Configurable forecast horizon** — choose how many months ahead to predict.
- **Visual results** — a rendered forecast chart plus an interactive comparison chart (actual vs. forecasted sales).
- **Model accuracy metrics** — MAE, MSE, RMSE, and MAPE shown alongside the forecast so accuracy is transparent, not just a number pulled from thin air.
- **Public and open** — no account or login needed; anyone with the link can use it immediately.

## How It Works

1. **Upload** a sales CSV, or click **Use Sample Data**.
2. **Choose** how many months to forecast.
3. **Run Forecast** — the app processes the data and generates predictions.
4. **View Results** — see the forecast chart, comparison graph, and accuracy metrics.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, Angular Material, Chart.js |
| Backend | Python, Flask |
| Forecasting | statsmodels (SARIMAX), pandas, matplotlib |
| Deployment | Docker, Render (single web service) |

## Architecture

The frontend and backend are deployed together as **one service**: the Angular app is built to static files, and the Flask API serves those files directly alongside its own forecasting endpoints — one URL, one process, no cross-origin configuration needed in production.

```
svc/
├── src/          Angular frontend
├── backend/      Flask API + forecasting logic
└── Dockerfile    Builds both into a single deployable image
```

## Local Development

Run the two pieces separately so the Angular dev server can hot-reload:

```bash
# Terminal 1 — backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py               # http://localhost:5000

# Terminal 2 — frontend
npm install
npm start                    # http://localhost:4200, talks to localhost:5000
```

To run it the way it deploys (one process, one port):

```bash
npm run build                # outputs dist/svc/browser
cd backend
python app.py                # now also serves the built frontend at http://localhost:5000
```

## Deployment

Deployed on [Render](https://render.com) as a single Docker-based web service — see `render.yaml` and `Dockerfile` at the project root.
