export namespace OpenPolicyAgent {

    export type PolicyAPI = {
        /**
         * Lists all policy modules loaded into OPA.
         * @returns List of policy modules.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#list-policies
         */
        list(): Promise<ListPoliciesResponse>,
        /**
         * Retrieves a policy module by its ID.
         * @param id - The policy module ID.
         * @param pretty - Format response for humans.
         * @returns The policy module.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-policy
         */
        get(id: string, pretty: boolean): Promise<GetPolicyResponse>,
        /**
         * Creates or updates a policy module.
         * @param id - The policy module ID.
         * @param rego - Rego policy as plain text.
         * @param pretty - Format response for humans.
         * @param metrics - Include compiler performance metrics.
         * @returns Empty object on success.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#create-or-update-a-policy
         */
        put(id: string, rego: string, pretty?: boolean, metrics?: boolean): Promise<Record<string, never>>
        /**
         * @see OPAClient.policy.put
         * @alias put
         * @param id
         * @param rego
         * @param pretty
         * @param metrics
         */
        create(id: string, rego: string, pretty?: boolean, metrics?: boolean): Promise<Record<string, never>>
        /**
         * @see OPAClient.policy.put
         * @alias put
         * @param id
         * @param rego
         * @param pretty
         * @param metrics
         */
        update(id: string, rego: string, pretty?: boolean, metrics?: boolean): Promise<Record<string, never>>,
        /**
         * Deletes a policy module by ID.
         * @param id - The policy module ID.
         * @param pretty - Format response for humans.
         * @param metrics - Include compiler performance metrics.
         * @returns Empty object on success.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#delete-a-policy
         */
        delete(id: string, pretty?: boolean, metrics?: boolean): Promise<Record<string, never>>
    }

    export type DataAPI = {
        /**
         * Gets a document by path (GET with optional input as query param).
         * @param path - Slash-separated document path.
         * @param options - Optional parameters.
         * @returns Document result and optional metadata.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-document
         */
        get<T = Document>(path: string, options?: {
            /**
             * Provide an input document. Format is a JSON value that will be used as the value for the input document.
             */
            input?: Document;
            /**
             * If parameter is true, response will be formatted for humans.
             */
            pretty?: boolean;
            /**
             * If parameter is true, response will include build/version info in addition to the result. See Provenance for more detail.
             */
            provenance?: boolean;
            /**
             * Return query explanation in addition to result. Values: notes, fails, full, debug.
             */
            explain?: 'notes' | 'fails' | 'full' | 'debug';
            /**
             * Return query performance metrics in addition to result. See (Performance)[https://www.openpolicyagent.org/docs/rest-api#provenance] Metrics for more detail.
             */
            metrics?: boolean;
            /**
             * Instrument query evaluation and return a superset of performance metrics in addition to result. See (Performance Metrics)[https://www.openpolicyagent.org/docs/rest-api#performance-metrics] for more detail.
             */
            instrument?: boolean;
            /**
             * Treat built-in function call errors as fatal and return an error immediately.
             */
            strictBuiltinErrors?: boolean;
        }): Promise<GetDataResponse<T>>

        /**
         * Gets a document using POST with input in request body.
         * @param path - Document path.
         * @param body - Request body containing input.
         * @param options - Optional parameters.
         * @returns Document result and optional metadata.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-document-with-input
         */
        post<T = Document>(path: string, body: { input?: T },
                           options?: {
                               pretty?: boolean;
                               provenance?: boolean;
                               explain?: 'notes' | 'fails' | 'full' | 'debug';
                               metrics?: boolean;
                               instrument?: boolean;
                               strictBuiltinErrors?: boolean;
                           }
        ): Promise<GetDataResponse<T>>

        /**
         * Webhook-style document evaluation (v0 API).
         * @param path - Document path.
         * @param input - Input document (raw, not wrapped).
         * @param pretty - Format response for humans
         * @default false.
         * @returns Raw result (e.g., `true`, `{}`).
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-document-webhook
         */
        webhook<T = any>(path: string, input: Document, pretty?: boolean): Promise<T>

        /**
         * Creates or overwrites a document.
         * @param path - Document path.
         * @param document - Document value.
         * @param ifNoneMatch - Prevent overwrite if document exists.
         * @param metrics - Include performance metrics.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#create-or-overwrite-a-document
         */
        put(path: string, document: Document, ifNoneMatch?: boolean, metrics?: boolean): Promise<void>

        /**
         * Patches a document using JSON Patch (RFC 6902).
         * @param path - Document path.
         * @param operations - Array of JSON Patch operations.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#patch-a-document
         */
        patch(path: string, operations: any[]): Promise<void>

        /**
         * Deletes a document.
         * @param path - Document path.
         * @param metrics - Include performance metrics.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#delete-a-document
         */
        delete(path: string, metrics?: boolean): Promise<void>
    }

    export type QueryAPI = {
        /**
         * Executes the default decision query (`POST /`).
         * @param input - Input document.
         * @param pretty - Format response for humans. @default false
         * @returns Result of `/system/main` or configured default decision.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#execute-a-simple-query
         */
        default<T = any>(input: Document, pretty?: boolean): Promise<T>

        /**
         * Executes an ad-hoc Rego query.
         * @param query - Rego query string.
         * @param input - Optional input document.
         * @param pretty - Format response for humans.
         * @param explain - Include query explanation.
         * @param metrics - Include performance metrics.
         * @returns Query results with variable bindings.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#execute-an-ad-hoc-query
         */
        adhoc(query: string, input?: Document, pretty?: boolean, explain?: 'notes' | 'fails' | 'full' | 'debug', metrics?: boolean): Promise<ExecuteAdHocQueryResponse>

    }

    export type CompileAPI = {
        /**
         * Partially evaluates a query.
         * @param req - Partial evaluation request.
         * @param pretty - Format response for humans.
         * @param explain - Include query explanation.
         * @param metrics - Include performance metrics.
         * @param instrument - Enable detailed instrumentation.
         * @returns Partially evaluated queries or unconditional result.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#partially-evaluate-a-query
         */
        partialEval(req: PartialEvalRequest, pretty?: boolean, explain?: 'notes' | 'fails' | 'full' | 'debug', metrics?: boolean, instrument?: boolean): Promise<PartialEvalResponse>
        /**
         * Compiles a Rego policy into data filters (e.g., SQL).
         * @param path - Filter rule path (e.g., 'filters/include').
         * @param req - Compile request.
         * @param accept - Accept header (e.g., 'application/vnd.opa.sql.postgresql+json').
         * @returns Generated filter (e.g., SQL WHERE clause).
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#compling-a-rego-policy-and-query-into-data-filters
         */
        filter(path: string, req: CompileFilterRequest, accept: string): Promise<CompileFilterResponse>
    }

    export type HealthAPI = {
        /**
         * Checks OPA health.
         * @param bundles - Require all bundles to be activated.
         * @param plugins - Require all plugins to be OK.
         * @param excludePlugin - Plugin(s) to exclude from check.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#health-api
         */
        check(bundles?: boolean, plugins?: boolean, excludePlugin?: string | string[]): Promise<void>

        /**
         * Custom health check (e.g., `/health/ready`).
         * @param name - Health check name (e.g., 'ready', 'live').
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#custom-health-checks
         */
        custom(name: string): Promise<void>
    }

    export type ConfigAPI = {
        /**
         * Retrieves OPA's active configuration (sensitive fields omitted).
         * @param pretty - Format response for humans @default false.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#config-api
         */
        get(pretty?: boolean): Promise<GetConfigResponse>
    }

    export type StatusAPI = {
        /**
         * Retrieves OPA's operational status.
         * @param pretty - Format response for humans @default false.
         * @see https://www.openpolicyagent.org/docs/latest/rest-api/#status-api
         */
        get(pretty?: boolean): Promise<GetStatusResponse>
    }

    /**
     * A lightweight TypeScript client for the Open Policy Agent (OPA) REST API.
     * Uses the native `fetch` API and requires no external dependencies.
     *
     * Official REST API reference:
     * https://www.openpolicyagent.org/docs/latest/rest-api/
     */
    export class Client {

        /**
         * Creates a new instance of the OpaClient.
         *
         * @param _config - Configuration object for the OPA client.
         * @param _config.baseUrl - Base URL of the OPA server (e.g., `'http://localhost:8181'`). Trailing slashes are automatically removed.
         * @param _config.headers - Optional custom headers to include with every request.
         *   Note: Certain headers are managed internally by the client (`Accept`, `Accept-Encoding`, `Content-Type`, `Content-Encoding`).
         *   Providing these in `headers` may override internal behavior—use with caution.
         */
        constructor(private readonly _config: {
            baseUrl: string;
            headers?: Record<string, string>
        } = {baseUrl: 'http://localhost:8181'}) {
            this._config = {
                ..._config,
                baseUrl: _config.baseUrl.replace(/\/+$/, ''),
            };
        }

        /**
         * Compresses a string to a gzip-encoded ReadableStream<Uint8Array>.
         * If CompressionStream is unavailable, returns the original string.
         */
        private gzip(text: string): ReadableStream<Uint8Array> | string {
            if (typeof CompressionStream === 'undefined') {
                return text;
            }

            const encoder = new TextEncoder();
            const readable = new ReadableStream<Uint8Array>({
                start(controller) {
                    controller.enqueue(encoder.encode(text));
                    controller.close();
                },
            });

            // Cast to work around TypeScript's strict typing of CompressionStream
            return readable.pipeThrough(
                new CompressionStream('gzip') as unknown as ReadableWritablePair<Uint8Array, Uint8Array>
            );
        }

        /**
         * Internal fetch wrapper with auth, gzip, and error handling.
         */
        private async request<T>(
            endpoint: string,
            options: RequestInit = {}
        ): Promise<T> {
            const url = `${this._config.baseUrl}${endpoint}`;

            const headers: HeadersInit = new Headers({
                ...this._config.headers,
                Accept: 'application/json',
                'Accept-Encoding': 'gzip',
                ...options.headers,
            });

            let body = options.body;

            // Handle JSON body compression
            if (
                body &&
                typeof body === 'string' &&
                (headers.get('Content-Type') === 'application/json' ||
                    headers.get('Content-Type') === 'application/json-patch+json')
            ) {
                const compressed = this.gzip(body);
                if (typeof compressed !== 'string') {
                    body = compressed;
                    headers.set('Content-Encoding', 'gzip');
                }
            }

            const response = await fetch(url, {
                ...options,
                headers,
                body,
                ...(body instanceof ReadableStream ? {duplex: 'half'} : undefined),
            });

            if (!response.ok) {
                let message = `OPA request failed: ${response.status} ${response.statusText}`;
                let cause: any;
                try {
                    const bodyText = await response.text();
                    if (bodyText) {
                        cause = JSON.parse(bodyText);
                        if (cause.message) message += ` - ${cause.message}`;
                    }
                } catch {
                    // Ignore
                }
                // @ts-ignore
                throw new Error(message, {cause});
            }

            const text = await response.text();
            return text ? (JSON.parse(text) as T) : ({} as T);
        }

        // =============================================================================
        // Policy Management API
        // =============================================================================

        readonly policy: PolicyAPI = {

            list: (): Promise<ListPoliciesResponse> => {
                return this.request('/v1/policies');
            },


            get: (id: string, pretty: boolean = false): Promise<GetPolicyResponse> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                return this.request(`/v1/policies/${encodeURIComponent(id)}?${params}`);
            },


            put: (
                id: string,
                rego: string,
                pretty: boolean = false,
                metrics: boolean = false
            ): Promise<Record<string, never>> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                if (metrics) params.set('metrics', 'true');
                return this.request(`/v1/policies/${encodeURIComponent(id)}?${params}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'text/plain'},
                    body: rego,
                });
            },
            create: (...args) => this.policy.put(...args),
            update: (...args) => this.policy.put(...args),


            delete: (
                id: string,
                pretty: boolean = false,
                metrics: boolean = false
            ): Promise<Record<string, never>> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                if (metrics) params.set('metrics', 'true');
                return this.request(`/v1/policies/${encodeURIComponent(id)}?${params}`, {
                    method: 'DELETE',
                });
            },
        };

        // =============================================================================
        // Data API
        // =============================================================================

        readonly data: DataAPI = {
            get: <T = Document>(
                path: string,
                options: {
                    /**
                     * Provide an input document. Format is a JSON value that will be used as the value for the input document.
                     */
                    input?: Document;
                    /**
                     * If parameter is true, response will be formatted for humans.
                     */
                    pretty?: boolean;
                    /**
                     * If parameter is true, response will include build/version info in addition to the result. See Provenance for more detail.
                     */
                    provenance?: boolean;
                    /**
                     * Return query explanation in addition to result. Values: notes, fails, full, debug.
                     */
                    explain?: 'notes' | 'fails' | 'full' | 'debug';
                    /**
                     * Return query performance metrics in addition to result. See (Performance)[https://www.openpolicyagent.org/docs/rest-api#provenance] Metrics for more detail.
                     */
                    metrics?: boolean;
                    /**
                     * Instrument query evaluation and return a superset of performance metrics in addition to result. See (Performance Metrics)[https://www.openpolicyagent.org/docs/rest-api#performance-metrics] for more detail.
                     */
                    instrument?: boolean;
                    /**
                     * Treat built-in function call errors as fatal and return an error immediately.
                     */
                    strictBuiltinErrors?: boolean;
                } = {}
            ): Promise<GetDataResponse<T>> => {
                const params = new URLSearchParams();
                if (options.input !== undefined) {
                    params.set('input', JSON.stringify(options.input));
                }
                if (options.pretty) params.set('pretty', 'true');
                if (options.provenance) params.set('provenance', 'true');
                if (options.explain) params.set('explain', options.explain);
                if (options.metrics) params.set('metrics', 'true');
                if (options.instrument) params.set('instrument', 'true');
                if (options.strictBuiltinErrors) params.set('strict-builtin-errors', 'true');

                return this.request(`/v1/data/${path}?${params}`);
            },
            post: <T = Document>(
                path: string,
                body: { input?: Document },
                options: {
                    pretty?: boolean;
                    provenance?: boolean;
                    explain?: 'notes' | 'fails' | 'full' | 'debug';
                    metrics?: boolean;
                    instrument?: boolean;
                    strictBuiltinErrors?: boolean;
                } = {}
            ): Promise<GetDataResponse<T>> => {
                const params = new URLSearchParams();
                if (options.pretty) params.set('pretty', 'true');
                if (options.provenance) params.set('provenance', 'true');
                if (options.explain) params.set('explain', options.explain);
                if (options.metrics) params.set('metrics', 'true');
                if (options.instrument) params.set('instrument', 'true');
                if (options.strictBuiltinErrors) params.set('strict-builtin-errors', 'true');

                return this.request(`/v1/data/${path}?${params}`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            },
            webhook: <T = any>(
                path: string,
                input: Document = {},
                pretty: boolean = false
            ): Promise<T> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                return this.request(`/v0/data/${path}?${params}`, {
                    method: 'POST',
                    body: JSON.stringify(input),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            },

            put: (
                path: string,
                document: Document,
                ifNoneMatch: boolean = false,
                metrics: boolean = false
            ): Promise<void> => {
                const params = new URLSearchParams();
                if (metrics) params.set('metrics', 'true');

                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };
                if (ifNoneMatch) headers['If-None-Match'] = '*';

                return this.request(`/v1/data/${path}?${params}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(document),
                });
            },

            patch: (path: string, operations: any[]): Promise<void> => {
                return this.request(`/v1/data/${path}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json-patch+json'},
                    body: JSON.stringify(operations),
                });
            },

            delete: (path: string, metrics: boolean = false): Promise<void> => {
                const params = new URLSearchParams();
                if (metrics) params.set('metrics', 'true');
                return this.request(`/v1/data/${path}?${params}`, {
                    method: 'DELETE',
                });
            },
        };

        // =============================================================================
        // Query API
        // =============================================================================

        readonly query: QueryAPI = {

            default: <T = any>(input: Document, pretty: boolean = false): Promise<T> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                return this.request(`/?${params}`, {
                    method: 'POST',
                    body: JSON.stringify(input),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            },

            adhoc: (
                query: string,
                input?: Document,
                pretty: boolean = false,
                explain?: 'notes' | 'fails' | 'full' | 'debug',
                metrics: boolean = false
            ): Promise<ExecuteAdHocQueryResponse> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                if (explain) params.set('explain', explain);
                if (metrics) params.set('metrics', 'true');

                return this.request(`/v1/query?${params}`, {
                    method: 'POST',
                    body: JSON.stringify({query, input}),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            },
        };

        // =============================================================================
        // Compile API
        // =============================================================================

        readonly compile: CompileAPI = {
            partialEval: (
                req: PartialEvalRequest,
                pretty: boolean = false,
                explain?: 'notes' | 'fails' | 'full' | 'debug',
                metrics: boolean = false,
                instrument: boolean = false
            ): Promise<PartialEvalResponse> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                if (explain) params.set('explain', explain);
                if (metrics) params.set('metrics', 'true');
                if (instrument) params.set('instrument', 'true');

                return this.request(`/v1/compile?${params}`, {
                    method: 'POST',
                    body: JSON.stringify(req),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            },
            filter: (
                path: string,
                req: CompileFilterRequest,
                accept: string
            ): Promise<CompileFilterResponse> => {
                return this.request(`/v1/compile/${path}`, {
                    method: 'POST',
                    headers: {Accept: accept, 'Content-Type': 'application/json'},
                    body: JSON.stringify(req),
                });
            },
        };

        // =============================================================================
        // Health, Config, Status APIs
        // =============================================================================

        readonly health: HealthAPI = {
            check: (
                bundles: boolean = false,
                plugins: boolean = false,
                excludePlugin?: string | string[]
            ): Promise<void> => {
                const params = new URLSearchParams();
                if (bundles) params.set('bundles', 'true');
                if (plugins) params.set('plugins', 'true');
                if (excludePlugin) {
                    const plugins = Array.isArray(excludePlugin) ? excludePlugin : [excludePlugin];
                    plugins.forEach((p) => params.append('exclude-plugin', p));
                }
                return this.request(`/health?${params}`);
            },
            custom: (name: string): Promise<void> => {
                return this.request(`/health/${name}`);
            },
        };

        readonly config: ConfigAPI = {
            /**
             * Retrieves OPA's active configuration (sensitive fields omitted).
             * @param pretty - Format response for humans.
             * @see https://www.openpolicyagent.org/docs/latest/rest-api/#config-api
             */
            get: (pretty: boolean = false): Promise<GetConfigResponse> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                return this.request(`/v1/config?${params}`);
            },
        };

        readonly status: StatusAPI = {
            /**
             * Retrieves OPA's operational status.
             * @param pretty - Format response for humans.
             * @see https://www.openpolicyagent.org/docs/latest/rest-api/#status-api
             */
            get: (pretty: boolean = false): Promise<GetStatusResponse> => {
                const params = new URLSearchParams();
                if (pretty) params.set('pretty', 'true');
                return this.request(`/v1/status?${params}`);
            },
        };
    }

    // =============================================================================
    // Shared Types
    // =============================================================================

    export type Document = any;

    export interface PolicyModule {
        id: string;
        raw: string;
        ast: any;
    }

    export interface ListPoliciesResponse {
        result: PolicyModule[];
    }

    export interface GetPolicyResponse {
        result: PolicyModule;
    }

    export interface GetDataResponse<T = Document> {
        /**
         * The base or virtual document referred to by the URL path. If the path is undefined, this key will be omitted.
         */
        result?: T;
        /**
         * If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps.
         */
        metrics?: Record<string, number>;
        /**
         *  If decision logging is enabled, this field contains a string that uniquely identifies the decision. The identifier will be included in the decision log event for this decision. Callers can use the identifier for correlation purposes.
         */
        decision_id?: string;
        provenance?: ProvenanceInfo;
    }

    export interface ProvenanceInfo {
        version: string;
        build_commit: string;
        build_timestamp: string;
        build_host: string;
        bundles?: Record<string, { revision: string }>;
    }

    export interface ExecuteAdHocQueryResponse {
        result: Record<string, any>[];
        metrics?: Record<string, number>;
        explanation?: any[];
    }

    export interface PartialEvalRequest {
        query: string;
        input?: Document;
        options?: {
            disableInlining?: string[];
            nondeterminsticBuiltins?: boolean;
        };
        unknowns?: string[];
    }

    export interface PartialEvalResponse {
        result: PartialEvalQueries | Record<string, never>;
    }

    export interface PartialEvalQueries {
        queries: any[][];
    }

    export interface CompileFilterRequest {
        input?: Document;
        options?: {
            disableInlining?: string[];
            maskRule?: string;
            targetDialects?: string[];
            targetSQLTableMappings?: Record<string, Record<string, string>>;
        };
        unknowns?: string[];
    }

    export interface CompileFilterResponse {
        result: {
            query?: string; // absent = deny, empty = allow
        };
    }

    export interface GetConfigResponse {
        result: Record<string, any>;
    }

    export interface GetStatusResponse {
        result: {
            labels: Record<string, string>;
            bundles?: Record<string, any>;
            plugins?: Record<string, { state: string }>;
            metrics?: Record<string, any>;
        };
    }

}

export const OPAClient = OpenPolicyAgent.Client;
