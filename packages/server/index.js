import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import messageSerializer from "./messageSerializer.js";
import OpenAI from "openai";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const app = express();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../../client/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:3000"
  }
});

app.get("/test", (req, res) => {
  res.status(200).send({ text: "Dungeon?" });
});

const messages = [{ username: "assistant", content: "yuh in the dungeon" }];

var messageTask;

app.get("/gpt", async (req, res) => {
  // should be serialized
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content: req.query.chat,
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(response);
  res.status(200).send(messages);
});

const generateNextMessage = async (io, newMessage) => {  
  messages.push(newMessage);
  io.emit("messageUpdate", { newMessages: [newMessage] });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{
      "role": "system",
      "content": "You are a DnD style Dungeon Master/text adventure simulator. Respond to player's statements and simulate the world in a realistic fashion. Do not allow them to break the rules of the world you create for them. Be very brief in descriptions and stick to actionable facts only. It is important to be extremely concise. Be a tough DM and don't let the players easily survive."
    }, ...messages.map((x) => messageSerializer(x))],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const responseMessage = {
    username: "assistant",
    content: response.choices[response.choices.length - 1].message.content,
  };

  messages.push(responseMessage);
  io.emit("messageUpdate", { newMessages: [responseMessage] });
};

const generateUsername = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content:
          "Please make up a first and last name for my adventurer. Respond only with the name. Do not elaborate.`",
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
};

io.on("connection", async (socket) => {
  socket.data.username = await generateUsername();
  console.log(`a user ${socket.id} named ${socket.data.username} connected`);
  
  socket.emit("username", socket.data.username);
  socket.emit("messageUpdate", { newMessages: messages });

  socket.on("chatMessage", (message) => {
    const newMessage = { username: socket.data.username, content: message };
    if (messageTask) {
      messageTask = messageTask.then(async () => {
        await generateNextMessage(io, newMessage);
      });
    } else {
      messageTask = generateNextMessage(io, newMessage);
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}!`));
