import {OPAClient} from "../src"; //<< !!! Don't use this if your using the package from npm
// import {OPAClient} from "@sourceregistry/node-opa";

const client = new OPAClient();

const regoPolicy = `
package opa.examples

import input.example.flag

allow_request if flag == true
`

async function main() {

    const policy = await client.policy.put("example::test", regoPolicy, true, true);
    console.log(policy);

}

main().catch(console.error);
