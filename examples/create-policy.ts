import {OPAClient} from "../src";

const client = new OPAClient();

const regoPolicy = `
package example

pi := 3.14159
`

async function main() {

    const policy = await client.policy.put("example::pi", regoPolicy, true, true);
    console.log(policy);

}

main().catch(console.error);
