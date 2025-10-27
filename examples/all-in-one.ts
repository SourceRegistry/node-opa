import {OPAClient} from "../src"; //<< !!! Don't use this if your using the package from npm
// import {OPAClient} from "@sourceregistry/node-opa";

const client = new OPAClient();

const regoPolicy = `
package opa.examples

import input.example.flag

allow_request if flag == true
`

async function main() {

    const policy = await client.policy.create("opa/examples/allow_request", regoPolicy, true, true)
    console.log(policy);


    const result = await client.data.post("opa/examples/allow_request", {
        "input": {
            "example": {
                "flag": true
            }
        }
    })

    console.log('result', result);

}

main().catch(console.error);
