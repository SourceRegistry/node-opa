import {OPAClient} from "../src";

const client = new OPAClient();


async function main() {

    const policy = await client.compile.filter("example::pi", regoPolicy, true, true);
    console.log(policy);

}

main().catch(console.error);
