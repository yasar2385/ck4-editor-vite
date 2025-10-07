let ws = new WebSocket("ws://localhost:8025/collaboration");

ws.onmessage = function(event) {
    const parts = event.data.split("|");
    const action = parts[0];
    const docId = parts[1];
    const paraId = parts[2];
    const userId = parts[3];

    const statusSpan = $(`#${paraId}_status`);

    if(action === "LOCKED") {
        $(`#${paraId}`).prop("disabled", true);
        statusSpan.text(`Locked by ${userId}`);
        console.log(`Paragraph ${paraId} locked by ${userId}`);
    } else if(action === "UNLOCKED") {
        $(`#${paraId}`).prop("disabled", false);
        statusSpan.text("");
        console.log(`Paragraph ${paraId} unlocked`);
    } else if(action === "LOCK_FAILED") {
        $(`#${paraId}`).prop("disabled", true);
        statusSpan.text(`Locked by ${userId}`);
        console.log(`Paragraph ${paraId} already locked by ${userId}`);
    }
};

function lockParagraph(docId, paraId, userId) {
    ws.send(`LOCK|${docId}|${paraId}|${userId}`);
}

function unlockParagraph(docId, paraId, userId) {
    ws.send(`UNLOCK|${docId}|${paraId}|${userId}`);
}
