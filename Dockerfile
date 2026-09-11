# Stage 1: build the Angular static frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src
RUN npm run build

# Stage 2: Python backend that serves the built frontend + its own API
FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend
COPY --from=frontend-build /app/dist/svc/browser ./dist/svc/browser

ENV PORT=5000
EXPOSE 5000

CMD ["sh", "-c", "cd backend && gunicorn app:app --timeout 120 --bind 0.0.0.0:${PORT}"]
