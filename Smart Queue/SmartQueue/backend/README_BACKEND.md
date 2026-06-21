## SmartQueue backend

### Setup
- Copy `.env.example` to `.env` and set:
  - `MONGO_URI`
  - `JWT_SECRET`

### Start MongoDB (easy option)

```bash
docker compose up -d
```

If you don't have Docker installed, use either:
- **Local MongoDB**: install MongoDB Community Server for Windows and start the **MongoDB** service.
- **MongoDB Atlas (cloud)**: create a free cluster and set `MONGO_URI` in `.env` to your Atlas connection string.

### Run

```bash
npm install
npm run dev
```

### API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/feedback/add` (auth)
- `GET /api/feedback/user` (auth)
- `GET /api/feedback/all` (admin)
- `GET /api/smartqueue` (admin)

### SmartQueue scoring

```text
Score = (0.5 × number_of_reports) + (0.3 × recurrence_last_7_days) + (0.2 × severity_weight)
```

- `number_of_reports`: total complaints grouped into the issue
- `recurrence_last_7_days`: complaints for that topic during the last 7 days
- `severity_weight`: `minor=1`, `moderate=2`, `serious=3`

### Socket events
- Server emits `smartqueue:update` with the computed queue

