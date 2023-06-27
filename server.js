const express = require("express");
const app = express();
// const path = require("path");
// const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// dotenv.config({ path: path.join(__dirname, "../.env") });

const port = process.env.PORT || 3001;
const messageContent = "Super";

// app.use(express.static(path.join(__dirname, "../build"))); // only backend deployed, no frontend needed

// const number = []; // now i used only messages to me, so number is not needed, useful for messages from others

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qrCode) => {
  qrcode.generate(qrCode, { small: true });
}); // Event: QR code generated

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
}); // Event: Keep client authenticated without having to scan the QR code every time

client.on("ready", () => {
  console.log("WhatsApp Bot is ready!");
}); // Event: Client ready

client.on("message_create", (message) => {
  if (message.body === "hello") {
    setTimeout(() => {
      message.reply(messageContent);
      // message.delete();
      // message.react("👍");
    }, 1000);
  }
}); // Event: Reply to a custom message from you; replace "message_create" with "message" to reply to different numbers too

client.initialize(); // Start the WhatsApp client

app.get("/", (req, res) => {
  res.send({
    number: [],
    message: messageContent,
  });
});

// wildcard path MUST be last otherwise you can't access paths defined in the backend!!!
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// }); // only backend deployed, no frontend needed

app.listen(port, () => {
  console.log(`Server is live on http://localhost:${port}`);
});
