import {personal_counter} from "../../declarations/personal_counter";

var actor = personal_counter;
window.onload = async () => document.getElementById("counter").innerText = (await actor.get()).toString();

document.getElementById("incrementBtn").addEventListener("click", async () => {
    await actor.inc();
    document.getElementById("counter").innerText = (await actor.get()).toString();
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const authClient = await AuthClient.create();
    await new Promise((resolve, reject) => {
        authClient.login({
            identityProvider: iiUrl,
            onSuccess: resolve,
            onError: reject,
        });
    });

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = Actor.createActor(webapp_idl, {
        agent,
        canisterId: webapp_id,
    });
    document.getElementById("principal").innerText = await agent.getPrincipal();
    document.getElementById("counterLabel").innerText = "Your personal counter:";
    document.getElementById("counter").innerText = (await actor.get()).toString();
});
