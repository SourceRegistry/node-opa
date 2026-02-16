# `@sourceregistry/node-opa` – Lightweight TypeScript Client for OPA REST API

A minimal, dependency-free TypeScript client for interacting with the [Open Policy Agent (OPA) REST API](https://www.openpolicyagent.org/docs/latest/rest-api/). Built with native `fetch`, supports modern browser and Node.js environments (v18+), and includes optional gzip compression for large payloads.

> **Note**: This library is still a work in progress

---

## ✨ Features

- **Zero dependencies** – uses only native `fetch` and `CompressionStream`
- **Full coverage** of OPA REST API:
    - **Policy API**: List, get, create/update, delete policies
    - **Data API**: Read/write/query OPA data documents
    - **Query API**: Execute default and ad-hoc Rego queries
    - **Compile API**: Partial evaluation and SQL/data filter generation
    - **Health, Config & Status APIs**: Monitor and inspect OPA instance
- **TypeScript-first** – fully typed request/response interfaces
- **Automatic gzip compression** for JSON bodies (when supported)
- **Configurable base URL and headers**
- **Detailed error handling** with OPA error messages

---

## 📦 Installation

```bash
npm install @sourceregistry/node-opa
```

> **Note**: Requires a runtime that supports `fetch` and (optionally) `CompressionStream`. In Node.js, use version 18+ or polyfill `fetch`.

---

## 🚀 Quick Start

```ts
import { OPAClient, OpenPolicyAgent } from '@sourceregistry/node-opa';

// Initialize client
const opa = new OPAClient({
  baseUrl: 'http://localhost:8181',
  headers: {
    // Optional: add auth or custom headers
    // 'Authorization': 'Bearer <token>'
  }
});

// List all policies
const policies = await opa.policy.list();
console.log(policies.result);

// Evaluate a policy decision
const result = await opa.data.post('example/allow', {
  input: { user: 'alice', action: 'read' }
});
console.log(result.result); // true / false / data

// Add a new policy
await opa.policy.put('authz.rego', `
  package example
  allow if {
    input.user == "admin"
  }
`);

// Typed error handling
try {
  await opa.policy.get('missing.rego');
} catch (error) {
  if (error instanceof OpenPolicyAgent.ClientError) {
    console.error(error.code, error.message);
    console.error(error.errors); // OPAError[]
  }
}
```

---

## 🔧 API Reference

The client exposes grouped methods under intuitive namespaces:

### Policy Management
- `opa.policy.list()` – list all policies
- `opa.policy.get(id)` – retrieve a policy by ID
- `opa.policy.put(id, rego)` – create or update a policy
- `opa.policy.delete(id)` – remove a policy

### Data Operations
- `opa.data.get(path, options)` – read a document (GET with query params)
- `opa.data.post(path, { input })` – read with input in body (POST)
- `opa.data.webhook(path, input)` – webhook-style evaluation (`/v0`)
- `opa.data.put(path, doc)` – create/overwrite a document
- `opa.data.patch(path, ops)` – apply JSON Patch (RFC 6902)
- `opa.data.delete(path)` – delete a document

### Query Execution
- `opa.query.default(input)` – evaluate default decision (`POST /`)
- `opa.query.adhoc(query, input?)` – run ad-hoc Rego query

### Compile & Optimize
- `opa.compile.partialEval(req)` – partial evaluation for optimization
- `opa.compile.filter(path, req, accept)` – compile to SQL or other filters

### Observability
- `opa.health.check()` – standard health check
- `opa.health.custom('ready')` – custom `/health/<name>` endpoints
- `opa.config.get()` – retrieve active configuration
- `opa.status.get()` – get operational status

> See [OPA REST API docs](https://www.openpolicyagent.org/docs/latest/rest-api/) for full endpoint details.

---

## ⚙️ Configuration

```ts
new OPAClient({
  baseUrl: 'http://opa:8181', // required
  headers: {
    // Custom headers (avoid overriding Content-Type, Accept, etc.)
    'X-Custom-Header': 'value'
  }
})
```

> **Warning**: Avoid setting `Accept`, `Content-Type` or encoding headers in `headers` they are managed internally.

---

## 🛡️ Authentication

If your OPA instance uses token authentication:

```ts
const opa = new OPAClient({
  baseUrl: 'https://opa.example.com',
  headers: {
    'Authorization': 'Bearer your-secret-token'
  }
});
```

Ensure OPA is started with `--authentication=token`.

---

## 📄 Types

All responses are strongly typed. Common types include:

- `Document = any` – generic JSON-like data
- `PolicyModule` – policy metadata with `raw` and `ast`
- `GetDataResponse<T>` – includes `result`, `metrics`, `provenance`, etc.
- `OPAError` – structured OPA error details (`code`, `message`, `location`, `details`)
- `ClientError` – thrown on non-2xx responses (`code`, `message`, `errors`, `response`)
- Request/response types for compile, query, config, and status APIs

### Error Types

```ts
type OPAError = {
  readonly code: string;
  readonly message: string;
  readonly location: { file: string; row: number; col: number };
  readonly details: { line: string; idx: number };
};
```

```ts
class ClientError extends Error {
  readonly code: string;
  readonly errors: OPAError[];
  readonly response: Response;
}
```

---

## 🧪 Testing & Compatibility

- Works in modern browsers and Node.js ≥18
- Gzip compression automatically disabled if `CompressionStream` is unavailable
- All methods return native `Promise`s

---

## 📄 License

MIT

---

> **Note**: This client is community-maintained and not officially affiliated with the Open Policy Agent project. Refer to [OPA’s official documentation](https://www.openpolicyagent.org/docs/latest/) for API semantics and behavior.
