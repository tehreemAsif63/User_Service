import mqtt from 'mqtt'
import mongoose from 'mongoose'

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Users";
const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')



client.on("connect", () => {
    client.subscribe("presence", (err) => {
      if (!err) {
        client.publish("presence", "Hello mqtt");
      }
    });
  });
  
  client.on("message", (topic, message) => {
    // message is Buffer
    console.log(message.toString());
    client.end();
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
 


  