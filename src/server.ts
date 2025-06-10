import app from "./app";
import env from "./shared/constant/env";

app.listen(env.PORT, () => {
  console.log("Server started successfully at port 4000.");
});
