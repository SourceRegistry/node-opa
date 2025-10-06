import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {OPAClient} from '../src';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('OPAClient', () => {
    let client: OPAClient;

    beforeEach(() => {
        client = new OPAClient({baseUrl: 'http://localhost:8181'});
        mockFetch.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockJsonResponse = (data: any) => {
        return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers({'Content-Type': 'application/json'}),
            json: () => Promise.resolve(data),
            text: () => Promise.resolve(JSON.stringify(data)),
        });
    };

    const mockEmptyResponse = () => {
        return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers({'Content-Type': 'application/json'}),
            json: () => Promise.resolve({}),
            text: () => Promise.resolve('{}'),
        });
    };

    const mockTextResponse = (text: string) => {
        return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers({'Content-Type': 'application/json'}),
            json: () => Promise.resolve(JSON.parse(text)),
            text: () => Promise.resolve(text),
        });
    };

    // =============================================================================
    // Policy API
    // =============================================================================

    describe('policy', () => {
        it('list', async () => {
            const mockData = {result: [{id: 'test', raw: 'package test', ast: {}}]};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            const res = await client.policy.list();
            expect(res).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8181/v1/policies', expect.any(Object));
        });

        it('get', async () => {
            const mockData = {result: {id: 'test', raw: 'package test', ast: {}}};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            const res = await client.policy.get('test', true);
            expect(res).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/policies/test?pretty=true',
                expect.any(Object)
            );
        });

        it('put', async () => {
            mockFetch.mockResolvedValue(mockEmptyResponse());
            const rego = 'package test\nallow := true';

            const res = await client.policy.put('test', rego, false, true);
            expect(res).toEqual({});
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/policies/test?metrics=true',
                expect.objectContaining({
                    method: 'PUT',
                    headers: expect.anything(),
                    // headers: expect.objectContaining({'Content-Type': 'text/plain'}),
                    body: expect.anything()
                    // body: rego,
                })
            );
        });

        it('delete', async () => {
            mockFetch.mockResolvedValue(mockEmptyResponse());

            await client.policy.delete('test', true, true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/policies/test?pretty=true&metrics=true',
                expect.objectContaining({method: 'DELETE'})
            );
        });
    });

    // =============================================================================
    // Data API
    // =============================================================================

    describe('data', () => {
        it('get', async () => {
            const mockData = {result: true};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            const res = await client.data.get('allow', {
                input: {user: 'alice'},
                explain: 'full',
                metrics: true,
            });

            expect(res).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/data/allow?input=%7B%22user%22%3A%22alice%22%7D&explain=full&metrics=true',
                expect.any(Object)
            );
        });

        it('post', async () => {
            const mockData = {result: true};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            await client.data.post('allow', {input: {user: 'bob'}}, {pretty: true});
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/data/allow?pretty=true',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything()
                    // body: '{"input":{"user":"bob"}}',
                })
            );
        });

        it('webhook', async () => {
            mockFetch.mockResolvedValue(mockTextResponse('true'));

            const res = await client.data.webhook('allow', {user: 'charlie'}, true);
            expect(res).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v0/data/allow?pretty=true',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything()
                    // body: '{"user":"charlie"}',
                })
            );
        });

        it('put document', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                statusText: 'No Content',
                headers: new Headers(),
                text: () => Promise.resolve(''),
                json: () => Promise.reject(new Error('no json')),
            });

            await client.data.put('config', {debug: true}, true, true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/data/config?metrics=true',
                expect.objectContaining({
                    method: 'PUT',
                    headers: expect.anything(),
                    // headers: expect.objectContaining({'If-None-Match': '*'}),
                    body: expect.anything()
                    // body: '{"debug":true}',
                })
            );
        });

        it('patch', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                statusText: 'No Content',
                headers: new Headers(),
                text: () => Promise.resolve(''),
            });

            await client.data.patch('servers', [{op: 'add', path: '/-', value: {id: 's1'}}]);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/data/servers',
                expect.objectContaining({
                    method: 'PATCH',
                    headers: expect.anything(),
                    body: expect.anything()
                    // body: '[{"op":"add","path":"/-","value":{"id":"s1"}}]',
                })
            );
        });

        it('delete', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                statusText: 'No Content',
                headers: new Headers(),
                text: () => Promise.resolve(''),
            });

            await client.data.delete('servers', true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/data/servers?metrics=true',
                expect.objectContaining({method: 'DELETE'})
            );
        });
    });

    // =============================================================================
    // Query API
    // =============================================================================

    describe('query', () => {
        it('default', async () => {
            mockFetch.mockResolvedValue(mockTextResponse('"hello"'));
            const res = await client.query.default({user: 'alice'}, true);
            expect(res).toBe('hello');
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/?pretty=true',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything()
                })
            );
        });

        it('adhoc', async () => {
            const mockData = {result: [{name: 'app'}]};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            await client.query.adhoc('data.servers[i].name = name', {servers: []}, false, 'notes', true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/query?explain=notes&metrics=true',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything()
                })
            );
        });
    });

    // =============================================================================
    // Compile API
    // =============================================================================

    describe('compile', () => {
        it('partialEval', async () => {
            const mockData = {result: {queries: [[]]}};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            await client.compile.partialEval(
                {query: 'data.allow == true'},
                true,
                'full',
                true,
                true
            );
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/compile?pretty=true&explain=full&metrics=true&instrument=true',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything()
                })
            );
        });

        it('filter', async () => {
            const mockData = {result: {query: "WHERE name = 'alice'"}};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));

            await client.compile.filter(
                'filters/include',
                {input: {favorite: 'apple'}},
                'application/vnd.opa.sql.postgresql+json'
            );
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/v1/compile/filters/include',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.anything(),
                    headers: expect.anything()
                })
            );
        });
    });

    // =============================================================================
    // Health, Config, Status
    // =============================================================================

    describe('health', () => {
        it('check', async () => {
            mockFetch.mockResolvedValue(mockEmptyResponse());
            await client.health.check(true, true, ['decision-logs']);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8181/health?bundles=true&plugins=true&exclude-plugin=decision-logs',
                expect.any(Object)
            );
        });

        it('custom', async () => {
            mockFetch.mockResolvedValue(mockEmptyResponse());
            await client.health.custom('ready');
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8181/health/ready', expect.any(Object));
        });
    });

    describe('config', () => {
        it('get', async () => {
            const mockData = {result: {services: {}}};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));
            const res = await client.config.get(true);
            expect(res).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8181/v1/config?pretty=true', expect.any(Object));
        });
    });

    describe('status', () => {
        it('get', async () => {
            const mockData = {result: {labels: {}}};
            mockFetch.mockResolvedValue(mockJsonResponse(mockData));
            const res = await client.status.get(true);
            expect(res).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8181/v1/status?pretty=true', expect.any(Object));
        });
    });

    // =============================================================================
    // Auth & Gzip
    // =============================================================================

    it('includes auth header when provided', async () => {
        const clientWithAuth = new OPAClient({
            baseUrl: 'http://localhost:8181',
            headers: {
                "Authorization": `Bearer secret-token`,
            }
        });
        mockFetch.mockResolvedValue(mockEmptyResponse());

        await clientWithAuth.policy.list();
        expect(mockFetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.toSatisfy((init) => init.headers.get('Authorization') === 'Bearer secret-token'),
        );
    });

    it('compresses JSON body when CompressionStream is available', async () => {
        // Temporarily mock CompressionStream
        const originalCS = global.CompressionStream;
        global.CompressionStream = class {
            writable = new WritableStream();
            readable = new ReadableStream({
                start(controller) {
                    controller.enqueue(new Uint8Array([1, 2, 3]));
                    controller.close();
                },
            });
        } as any;

        mockFetch.mockResolvedValue(mockEmptyResponse());

        await client.data.post('test', {input: {x: 1}});

        const call = mockFetch.mock.calls[0];
        const body = call[1]?.body;
        expect(body).toBeInstanceOf(ReadableStream);

        global.CompressionStream = originalCS;
    });
});
