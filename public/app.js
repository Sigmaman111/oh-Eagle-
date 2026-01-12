const ws = new WebSocket(`ws://${location.host}`);
const status = document.getElementById("status");
const messages = document.getElementById("messages");
const input = document.getElementById("input");

ws.onmessage = event => {
    const data = JSON.parse(event.data);

    if (data.type === "waiting") {
        status.textContent = "Waiting for stranger...";
    }

    if (data.type === "matched") {
        status.textContent = "Connected to stranger!";
        input.disabled = false;
    }

    if (data.type === "disconnect") {
        status.textContent = "Stranger disconnected.";
        input.disabled = true;
    }

    if (data.text) {
        const msg = document.createElement("div");
        msg.textContent = "Stranger: " + data.text;
        messages.appendChild(msg);
    }
};

input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) {
        const msg = { text: input.value };
        ws.send(JSON.stringify(msg));

        const myMsg = document.createElement("div");
        myMsg.textContent = "You: " + input.value;
        messages.appendChild(myMsg);

        input.value = "";
    }
});
