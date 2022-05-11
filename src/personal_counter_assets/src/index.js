import {idlFactory, personal_counter} from "../../declarations/personal_counter";
import {Actor, HttpAgent} from "@dfinity/agent";
import {AuthClient} from "@dfinity/auth-client";

var actor = personal_counter;
window.onload = updateCounter;

document.getElementById("incrementBtn").addEventListener("click", async () => {
    await actor.inc();
    await updateCounter();
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const authClient = await AuthClient.create();
    await new Promise((resolve, reject) => {
        authClient.login({
            onSuccess: resolve,
            onError: reject,
        });
    });

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({identity});
    actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.PERSONAL_COUNTER_CANISTER_ID,
    });
    document.getElementById("counterLabel").innerText = "Your personal counter:";
    document.getElementById("principal").innerText = (await agent.getPrincipal()).toString();
    await updateCounter();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    actor = personal_counter;
    document.getElementById("counterLabel").innerText = "Anonymous counter:";
    document.getElementById("principal").innerText = 'Anonymous';
    await updateCounter();
});

async function updateCounter() {
    document.getElementById("counter").innerText = (await actor.get()).toString();
}
