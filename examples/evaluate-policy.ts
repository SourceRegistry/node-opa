import {OPAClient} from "../src"; //<< !!! Don't use this if your using the package from npm
// import {OPAClient} from "@sourceregistry/node-opa";

const client = new OPAClient();


async function main() {

    const result = await client.data.post('example::test', {
        input: {
            example: {
                flag: true
            }
        }
    });
    console.log(result);
}

main().catch(console.error);
