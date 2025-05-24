# GraphRunnerDS

<p align="center">
  <img src="GraphRunnerDS.png" alt="GraphRunnerDS Logo" width="300" />
</p>

GraphRunnerDS is a modular data ingestion and simulation platform designed to stress-test and populate [GraphRunner](https://github.com/RORVI/GraphRunner) — a graph-based analytics engine. It supports ingestion of fake-but-realistic data using structured templates, and is capable of delivering that data over Kafka or HTTP for advanced graph-based processing and visualization.

---

## 🚀 Key Features

- 📊 Modular ingestion architecture (via [Lerna](https://lerna.js.org/) + npm workspaces)
- 🦢 Faker-based log generation (CESNET-inspired network behaviors)
- 🧠 Vectorization-ready interface for LLMs (with local/remote file support planned)
- 📩 Kafka or HTTP delivery modes
- ⚙️ Configurable via `.env`
- 🛣️ Scalable via Docker agents (up to 30+ instances)

---

## 📦 Project Structure

```bash
GraphRunnerDS/
├── Dockerfile
├── docker-compose.yml
├── launch-agents.sh
├── packages/
│   ├── core/               # Orchestrator & shared config/transport
│   │   ├── config.ts
│   │   ├── generator.ts
│   │   ├── transport/
│   │   │   ├── producer.ts     # Kafka
│   │   │   └── sender.ts       # REST
│   │   └── index.ts            # Startup logic
│   ├── ingestion-faker/    # Simulated log generator (CESNET templates)
│   │   ├── index.ts
│   │   └── templates/
│   │       └── ...json
│   └── vectorizer/         # Vectorizes local/drive files for LLMs (internal only)
│       └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

These can be set via `.env` or inline with `docker run`:

| Variable                 | Description                                                     | Default                            |
|--------------------------|-----------------------------------------------------------------|------------------------------------|
| `ENABLED_SOURCES`        | Comma-separated list of active modules (e.g. `ingestion-faker`) |                                    |
| `TEMPLATE_PATH`          | Path to the JSON template                                       | `./templates/sample-template.json` |
| `SEND_INTERVAL_MS`       | Delay between emissions in milliseconds                         | `1000`                             |
| `USE_KAFKA`              | If `true`, sends data to Kafka topic                            | `false`                            |
| `KAFKA_MODE`             | Mode to resolve broker address (`local` or `docker`)            | `local`                            |
| `KAFKA_BROKER_LOCALHOST` | Kafka broker for local use                                      | `localhost:9092`                   |
| `KAFKA_BROKER_DOCKER`    | Kafka broker for Docker use                                     | `kafka:9092`                       |
| `KAFKA_TOPIC`            | Kafka topic to publish to                                       | `graphrunner.ingest`               |
| `GRAPH_RUNNER_URL`       | HTTP fallback endpoint for ingestion                            | `http://localhost:3030/ingest`     |

---

## 📚 Template Format (used by `ingestion-faker`)

Templates must be named like:
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

## 🚀 Vectorizer (Private)

The `vectorizer` module is currently private and not included in public releases.

It is designed to:
- Accept input from local folders or Google Drive links
- Process and vectorize content
- Forward results to GraphRunner for LLM use

> _Contact the author for licensing, partnership, or demo access._

---

## 🚧 Usage

```bash
# Install dependencies
npm install

# Run via ts-node
npx ts-node packages/core/index.ts
```

---

## 🚨 Coming Soon

- [x] Modular ingestion architecture
- [x] Kafka + REST delivery
- [ ] Vectorizer file processor integration
- [ ] Configurable LLM/AI embedding engine
- [ ] Live `/modules` health endpoint
- [ ] Template catalogue with UI
- [ ] Exposed config control API (start/stop/change rate)
- [ ] Public-friendly template set (IoT, fraud, social, etc)
- [x] Speed limitation based on each template (100mbits/sec - 1000mbits/sec)

---

## 🙌 Contributions

Fork and extend — especially welcome:
- New data templates
- Vectorization plugins
- Additional ingestion adapters
- Rate limiting strategies
- Visual dashboards for real-time traffic

---

## 🔍 See Also

- [GraphRunner](https://github.com/RORVI/GraphRunner) – Graph ingestion and analytics engine
- [JanusGraph Visualizer](https://github.com/RORVI/janusgraph-visualizer-for-graphrunner) – UI for exploring ingested data

---

## 📃 License

MIT — except for the `vectorizer` module and templates (restricted/demo-only).