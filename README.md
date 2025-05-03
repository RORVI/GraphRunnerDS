# GraphRunnerDS

<p align="center">
  <img src="GraphRunnerDS.png" alt="GraphRunnerDS Logo" width="300" />
</p>

**GraphRunnerDS** is a data generation and injection system designed to **stress-test [GraphRunner](https://github.com/RORVI/GraphRunner)**. It simulates real-world conditions by spawning multiple instances that bombard GraphRunner with high-volume, structured, fake data at scale.

> DS = Data Shooter / Data Spammer / Distributed Sender — your choice 😎

---

## 🚀 Purpose

- Generate **high-throughput fake data** using `faker.js`
- Dynamically controlled via **configurable JSON templates**
- Fire continuous HTTP requests into the **GraphRunner** API
- Scale to **20–30 instances**, pushing **hundreds of megabits/sec** worth of ingest traffic

---

## 🧰 Features

- ✅ JSON-based data generation schemas
- ✅ Built with **Node.js** and **TypeScript**
- 🔁 Easy horizontal scaling (Docker-ready)
- 🔧 Runtime configurable (template switching, frequency control)
- 📡 High performance — built for pressure testing

---

## 🛠️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/RORVI/GraphRunnerDS.git
cd GraphRunnerDS
npm install
```

### 2. Configure the template

Create a config.json that describes the shape of the data:
```json
{
  "endpoint": "http://localhost:3000/api/vertex",
  "intervalMs": 50,
  "concurrency": 5,
  "template": {
    "name": "{{name.firstName}} {{name.lastName}}",
    "label": "person",
    "email": "{{internet.email}}",
    "company": "{{company.companyName}}"
  }
}
```

### 3. Run it

```bash
npm run start
```

Or, if you've added live config reload:
```bash
npm run dev
```

📦 Docker

You can run multiple containers simultaneously:

```bash
docker build -t graphrunnerds .
docker run --rm -e CONFIG_FILE=config.json graphrunnerds
```

Spin up 20–30 of them to test GraphRunner's ingestion power 💣

🧪 Next Steps

- [] Add Prometheus metrics for emitted data rate

- [] Auto-discover GraphRunner nodes (if clustered)

- [] Config endpoint to control data templates remotely

- [] Support multiple data models via profiles

🤝 Project Integration

This project is meant to work hand-in-hand with:

🔗 [GraphRunner](https://github.com/RORVI/GraphRunner) — the graph backend built for speed and clean architecture

🧾 License

MIT — blast responsibly.
