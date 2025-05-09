# GraphRunnerDS

<p align="center">
  <img src="GraphRunnerDS.png" alt="GraphRunnerDS Logo" width="300" />
</p>

GraphRunnerDS is a high-volume, template-driven data emitter built for simulating real-time ingestion into the [GraphRunner](https://github.com/RORVI/GraphRunner) backend. It is designed to run in multiple concurrent instances and push fake-but-realistic data using structured JSON templates and Faker.js.

---

## 🚀 Key Features

- 🔁 Multiple concurrent Docker agents (scalable to 20–30 instances)
- 🎛️ JSON-based template system (powered by Faker)
- ⚙️ Controlled emit rate via `SEND_INTERVAL_MS`
- 🌐 HTTP POST to GraphRunner’s `/ingest` endpoint
- 📡 Kafka producer support (preferred path)
- 🐳 Lightweight Docker support for isolated load testing

---

## 📦 Project Structure

```
GraphRunnerDS/
├── Dockerfile
├── docker-compose.yml (optional)
├── launch-multi.sh       # Spin up multiple agents
├── templates/            # Holds data emission templates
│   └── 01-10-template.json etc
├── src/
│   ├── config.ts         # Loads .env vars and template file
│   ├── generator.ts      # Fakes and shapes graph data
│   ├── transport/
│   │   ├── sender.ts     # HTTP transport (legacy/fallback)
│   │   └── kafkaProducer.ts  # Kafka-based transport
│   └── index.ts          # Entry point
└── .env                  # ENV config for local dev
```

---

## 🛠️ Usage (Local Testing)

### 1. Build Docker image
```bash
docker build -t graphrunnerds .
```

### 2. Launch agents with unique templates
```bash
bash launch-multi.sh
```

### 3. Start GraphRunner on port 3000 (must expose `/ingest`)
```bash
cd ../GraphRunner
npm run dev
```

### 4. Watch the logs
```bash
docker logs -f graphrunner-ds-01
```

Kafka-enabled mode will publish to graphrunner.ingest topic instead of HTTP.

---

## ⚙️ Environment Variables

These can be set via `.env` or inline with `docker run`:

| Variable                 | Description                                                | Default                          |
|--------------------------|------------------------------------------------------------|----------------------------------|
| `TEMPLATE_ID`            | ID of the template to use (e.g. `01`, `10`)                | `01`                             |
| `SEND_INTERVAL_MS`       | Delay between emissions in milliseconds                    | `1000`                           |
| `USE_KAFKA`              | If `true`, sends data to Kafka topic                       | `false`                          |
| `KAFKA_MODE`             | Mode to resolve broker address (`local` or `docker`)       | `local`                          |
| `KAFKA_BROKER_LOCALHOST` | Kafka broker for local use                                 | `localhost:9092`                 |
| `KAFKA_BROKER_DOCKER`    | Kafka broker for Docker use                                | `kafka:9092`                     |
| `KAFKA_TOPIC`            | Kafka topic to publish to                                  | `graphrunner.ingest`             |
| `GRAPH_RUNNER_URL`       | HTTP fallback endpoint for ingestion                       | `http://localhost:3030/ingest`   |



---

## 📁 Template Format

Templates live in `templates/` and must be named like:
```
01-sample-template.json
02-sample2-template.json
```

Each template defines:
- `vertices`: devices or services
- `edges`: relationships (e.g. CONNECTED_TO)
- optional: `shared_ref` for linking templates
- optional: `netZone` for segmentation

These are rendered with Faker.js and sent as JSON payloads.

---

## ✅ Coming Soon

- [x] Support for Kafka
- [ ] Exposed config control API (start/stop/change rate)
- [ ] Public-friendly template set (IoT, fraud, social, etc)
- [ ] Speed limitation based on each template (100mbits/sec - 1000mbits/sec)
- [ ] Add a 'catalogue' for templates

---

## 🤝 Contributions

Feel free to fork and extend this! All contributions are welcome — especially:
- new data model templates
- rate limiting strategies
- visual dashboards for real-time traffic

---

## 👀 See Also

- [GraphRunner](https://github.com/RORVI/GraphRunner) – backend ingestion + processing engine
- [JanusGraph Visualizer for GraphRunner](https://github.com/RORVI/janusgraph-visualizer-for-graphrunner) – graph UI to browse the live data

---

## 📣 License
MIT — except the templates, which are local/dev-only for now.