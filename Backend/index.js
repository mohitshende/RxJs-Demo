const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
// All the rxjs SSE code
import { Subject } from "rxjs";

const NewLog$ = new Subject();
export function emitNewLog(log) {
  NewLog$.next(log);
}

function serializeEvent(event, data) {
  const jsonString = JSON.stringify(data);
  return `event: ${event}\ndata: ${jsonString}\n\n`;
}
const statuses = ["Pending", "In Progress", "Completed", "Failed"];
setInterval(() => {
  const log = {
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
  emitNewLog(log);
}, 10000);
// app.post("/", (req, res) => {
//   const content = req.body.content;
//   const log = { content: content };
//   emitNewLog(log);
//   return res.status(200).json({ ok: true });
// })

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const stream$ = NewLog$.subscribe((log) => {
    res.write(serializeEvent("NEW_LOG", log));
  });

  req.on("close", () => {
    console.log("Client disconnected");
    stream$.unsubscribe();
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
