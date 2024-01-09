const axios = require("axios");
const express = require("express");
const router = express.Router();

// Reset pin by pcn number
router.post("/cooldown", async (req, res) => {
  try {
    const bodyRequest = req.body;

    console.log("bodyRequest ==>", bodyRequest);

    const pcnCredentials = [
      {
        pcnName: "Systems-X",
        authToken: "U3lzdGVtc1hXc0BwbGV4LmNvbTphYWE2YTg2LTQxMw==",
      },
      {
        pcnName: "Henniges Burlington",
        authToken: "SGVubmlnZXNCdXJsV1MyQHBsZXguY29tOjFlOWZjZjAtZmRhZi00",
      },
      {
        pcnName: "Henniges Frederick",
        authToken: "SGVubmlnZXNGcmVkV1MyQHBsZXguY29tOjQ0ZDVhN2UtNjk2Ny00",
      },
      {
        pcnName: "Henniges Gomez Palacio",
        authToken: "SGVubmlnZXNHb21QYWxhV1MyQHBsZXguY29tOmJkNjNkNWUtMjljNS00",
      },
      {
        pcnName: "Henniges Gomez Palacio 2",
        authToken:
          "SGVubmlnZXNHb21QYWxhMldTMkBwbGV4LmNvbTozMjU3YzJkLTYzNGEtNA==",
      },
      {
        pcnName: "Henniges Guadalajara",
        authToken: "SGVubmlnZXNHdWFkYWxhV1MyQHBsZXguY29tOmE4NTNiMzktYmNkZS00",
      },
      {
        pcnName: "Henniges Hranice",
        authToken: "SGVubmlnZXNIcmFuaWNlV1MyQHBsZXguY29tOmExNzRmMGEtZjFjYS00",
      },
      {
        pcnName: "Henniges Keokuk",
        authToken: "SGVubmlnZXNLZW9rV1MyQHBsZXguY29tOmRiMjk1ZWMtMDM5NC00",
      },
      {
        pcnName: "Henniges New Haven",
        authToken: "SGVubmlnZXNOSFdTMkBwbGV4LmNvbTplN2RmNThhLWY2OWEtNA==",
      },
      {
        pcnName: "Henniges Prudnik",
        authToken: "SGVubmlnZXNQcnVkbmlrV1MyQHBsZXguY29tOjMzYjc3OWYtNDFiNi00",
      },
      {
        pcnName: "Henniges Torreon",
        authToken: "SGVubmlnZXNUb3JyZW9uV1MyQHBsZXguY29tOmM3OGY3YzctODRmZC00",
      },
      {
        pcnName: "Henniges Reidsville",
        authToken: "SGVubmlnZXNSZWlkc1ZXUzJAcGxleC5jb206NDFmZGE4Yy1iYzM3LTQ=",
      },
    ];

    const credential = pcnCredentials.find(
      (credential) =>
        credential.pcnName.toLowerCase() === bodyRequest.pcnName.toLowerCase()
    );
    // console.log("credential", credential);
    let body = `{\r\n  "inputs": {\r\n    "Workcenter_Key":\r\n     "${bodyRequest.Workcenter_Key}"\r\n  }\r\n}`;
    let center_rate;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://cloud.plex.com/api/datasources/237656/execute?Accept=application/json&Accept-Encoding=gzip,deflate&Content-Type=application/json;charset=utf-8",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Basic ${credential.authToken}`,
      },
      data: body,
    };
    let apiResponseData = await axios.request(config);

    // console.log("123 ", typeof apiResponseData);
    console.log("123456 ", JSON.stringify(apiResponseData.data));
    apiResponseData = JSON.stringify(apiResponseData.data);
    apiResponseData = await JSON.parse(apiResponseData);
    // console.log("apiResponseData.length", apiResponseData.tables.length);
    // console.log("bodyRequest.workcenter_rate", bodyRequest.workcenter_rate);
    // console.log(
    //   "apiResponseData.tables[0].rows.length",
    //   apiResponseData.tables[0].rows.length
    // );
    // console.log(
    //   "======================================== last production time calculation Time ==========================================="
    // );
    let timeIndex =
      apiResponseData.tables[0].columns.indexOf("Production_Time");
    console.log("temp1 index", timeIndex);
    let lastProductionTime = apiResponseData.tables[0].rows[0][timeIndex];
    lastProductionTime = lastProductionTime.toLocaleString("en-US", {
      timeZone: "UTC",
    });
    console.log(
      "last production lastProductionTime",
      typeof lastProductionTime,
      "date=>",
      lastProductionTime
    );
    let currentTime = new Date();
    // Format the date in the desired format
    currentTime = currentTime.toISOString();
    currentTime = currentTime.toLocaleString("en-US", { timeZone: "UTC" });
    console.log("current date", typeof currentTime, "date=>", currentTime);
    var date1 = new Date(currentTime);
    var date2 = new Date(lastProductionTime);

    // Calculate the difference in milliseconds
    let difference = date1 - date2;
    difference = difference / 1000;
    console.log("diiference is => ", difference);
    console.log(
      "======================================== Time ==========================================="
    );
    if (!bodyRequest.fall_back_sec) {
      if (
        !bodyRequest.workcenter_no ||
        !bodyRequest.percent_of_rate ||
        !bodyRequest.workcenter_rate ||
        !bodyRequest.pcnName ||
        !bodyRequest.Workcenter_Key
      ) {
        return res.status(500).json({ error: "Field or fields are missing!" });
      }
      if (
        bodyRequest.workcenter_rate === "standard" &&
        apiResponseData.tables[0].rows.length > 0
      ) {
        console.log("standard");
        let index = apiResponseData.tables[0].columns.indexOf(
          "Workcenter_Standard_Quantity"
        );
        console.log(
          "apiResponseData.tables[0].rows[0][index]",
          apiResponseData.tables[0].rows[0][index]
        );
        center_rate = apiResponseData.tables[0].rows[0][index];
      } else if (
        bodyRequest.workcenter_rate === "ideal" &&
        apiResponseData.tables[0].rows.length > 0
      ) {
        console.log("ideal");
        let index = apiResponseData.tables[0].columns.indexOf(
          "Workcenter_Ideal_Quantity"
        );
        console.log(
          "apiResponseData.tables[0].rows[0][index]",
          apiResponseData.tables[0].rows[0][index]
        );
        center_rate = apiResponseData.tables[0].rows[0][index];
      } else if (
        bodyRequest.workcenter_rate === "target" &&
        apiResponseData.tables[0].rows.length > 0
      ) {
        console.log("target");
        let index = apiResponseData.tables[0].columns.indexOf(
          "Workcenter_Target_Quantity"
        );
        console.log(
          "apiResponseData.tables[0].rows[0][index]",
          apiResponseData.tables[0].rows[0][index]
        );
        center_rate = apiResponseData.tables[0].rows[0][index];
      }
      if (apiResponseData.length === 0) {
        return res
          .status(203)
          .json({ error: "Workcenter data is not avalable" });
      }

      console.log("center_rate", center_rate);
      const perHour = bodyRequest.pcs
        ? (1 / center_rate) * bodyRequest.pcs
        : 1 / center_rate;
      const perMin = perHour * 60;
      const perSec = perMin * 60;

      const cooldown_no =
        bodyRequest.percent_of_rate === 0
          ? perSec
          : (perSec * bodyRequest.percent_of_rate) / 100;
      // console.log("workcenter =>", perHour);
      // console.log("perMin =>", perMin);
      // console.log("perSec =>", perSec);
      console.log("cooldown_no =>", cooldown_no);
      let adjustedCoolDown = cooldown_no - difference;
      // let adjustedCoolDown =  difference - cooldown_no;

      console.log("adjusted cooldown_no =>", adjustedCoolDown);

      res.status(200).json({
        total_cooldown_no: cooldown_no,
        cooldown_no: adjustedCoolDown,
      });
    } else {
      console.log("fall back sec =>", bodyRequest.fall_back_sec);
      console.log("difference =>", difference);


      res
        .status(200)
        .json({
          total_cooldown_no: bodyRequest.fall_back_sec,
          cooldown_no: bodyRequest.fall_back_sec - difference,
        })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
