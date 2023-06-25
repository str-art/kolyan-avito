const https = require("node:https");

(async () => {
  const req = https.get(
    "https://www.avito.ru/omsk/muzykalnye_instrumenty/gitary_i_strunnye-ASgBAgICAUTEAsYK?f=ASgBAgECAUTEAsYKAUXGmgwVeyJmcm9tIjowLCJ0byI6MTAwMDB9&s=104"
  );
  const result = await new Promise((ok) => {
    req.on("response", (res) => {
      let doc = "";
      res.on("data", (data) => {
        doc = doc.concat(data);
      });

      res.on("end", () => {
        ok(doc);
      });
    });
  });

  console.log(result);
})();
