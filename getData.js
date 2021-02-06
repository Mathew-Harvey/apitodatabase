var AcuityScheduling = require("acuityscheduling");
const mongodb = require("mongodb");
var acuity = AcuityScheduling.basic({
  // userId:process.env.ACUITY_USER_ID,
  // apiKey:process.env.ACUITY_API_KEY,
userId: "16696944",
apiKey: "36fa76dda4beb013aa48228da563f53f",
});
const MongoClient = mongodb.MongoClient;
// const connectionURl = "mongodb://localhost:27017/"
const connectionURl = "mongodb+srv://bwg-portal:me2penders2000@cluster0.yqfzi.mongodb.net?retryWrites=true&w=majority"
const databaseName = "BWG";

MongoClient.connect(
  connectionURl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      console.log(error)
      return console.log("unable to connect to database");
    }
    const db = client.db(databaseName);
    async function refresh() {
      acuity.request("/appointments?max=100", async function (err, res, appointments) {
        // console.log(res) 

        appointments.map(async (appointment, i) => {
          const appointWithId = { _id: appointment.id, ...appointment };
          await db.collection("Appointment").replaceOne(
            { _id: appointment.id },
            appointWithId,
            { upsert: true }
          );
        });
        console.log("...pushing");
      });

    }
    refresh();

    setInterval(refresh, 10000);
  }
);