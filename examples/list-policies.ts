import {OPAClient} from "../src";

const client = new OPAClient();

async function main() {

    const {result} = await client.policy.list();
    console.log(result);


}

main().catch(console.error);
