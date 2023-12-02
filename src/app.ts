import mqtt from "mqtt";
import mongoose from "mongoose";
import userController from "./controllers/users-controller";
import {
  MessageData,
  MessageHandler,
  MessagePayload,
} from "./utilities/types-utils";
import { MessageException } from "./exceptions/MessageException";
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Users";
const client = mqtt.connect(process.env.MQTT_URI || "mqtt://localhost:1883");

const messageMapping: { [key: string]: MessageHandler } = {
  "users/create": userController.createUser,
  "users/login": userController.login,
  "users/me/:user_id": userController.getUser,
  "users/update/:user_id": userController.updateUser,
  "users/delete/:user_id": userController.deleteUser,
};

client.on("connect", () => {
  client.subscribe("users/#");
});

client.on("message", async (topic, message) => {
  console.log(message.toString());
  const handler = messageMapping[topic];
  if (handler) {
    const { payload, responseTopic,requestInfo } = JSON.parse(
      message.toString()
    ) as MessagePayload;
    try {
      const result = await handler(payload,requestInfo);
      client.publish(responseTopic, JSON.stringify({ data: result }), {
        qos: 2,
      });
    } catch (error) {
      if (error instanceof MessageException) {
        client.publish(
          responseTopic,
          JSON.stringify({
            error: {
              code: error.code,
              message: error.message,
            },
          }),
          { qos: 2 }
        );
      }
      client.publish(
        responseTopic,
        JSON.stringify({
          error: {
            code: 500,
            message: (error as Error).message,
          },
        }),
        { qos: 2 }
      );
    }
  }

  //client.end();}
});

// Set URI to connect to

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  })
  .catch(function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  });
