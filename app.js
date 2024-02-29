const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config();
const API_PORT = 3000;

const router = express.Router();

app.use(cors({ origin: "*" }));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function fetchPrice(ticker) {
    let url = "https://api.marketdata.app/v1/stocks/quotes/" + ticker;

    let res = axios.get(url, {
        params: {
            format: process.env.FORMAT,
            dateformat: process.env.DATE_FORMAT,
            symbol_lookup: process.env.SYMBOL_LOOKUP,
            human: process.env.HUMAN,
            token: process.env.MARKET_DATA_TOKEN
        }
    }).then(resp => {
        console.log(resp.data);
        if(resp.data) return resp.data;
        else return "";
    }).catch(err=> {
        console.log("errrrrror: ", err.message);
        return "";
    });

    return res;
};

async function fetchCandles(ticker, d1, d2) {
    let url = "https://api.marketdata.app/v1/stocks/candles/D/" + ticker;
    let res = axios.get(url, {
        params: {
            format: process.env.FORMAT,
            dateformat: process.env.DATE_FORMAT,
            symbol_lookup: process.env.SYMBOL_LOOKUP,
            human: process.env.HUMAN,
            from: d1,
            to: d2,
            token: process.env.MARKET_DATA_TOKEN
        }
    }).then(resp => {
        console.log(resp.data);
        if(resp.data) return resp.data;
        else return "";
    }).catch(err=> {
        console.log(err.message);
        return "";
    });

    return res;
};

router.get("/getPrice/:ticker?", (req, res)=> {
    let ticker = req.params.ticker;

    fetchPrice(ticker).then(priceObj=>{
        console.log("priceObj: ", priceObj)
        if(priceObj) res.json({ success: true, data: priceObj})
        else res.json({success: false})
    })
});

router.get("/getCandles", (req, res)=>{
    let {ticker, d1, d2} = req.query;
    console.log(ticker, d1, d2);
    fetchCandles(ticker, d1, d2).then(candleObj=> {
        console.log("candleObj: ", candleObj);
        let ans;
        if(candleObj) ans = {success: true, data: candleObj};
        else ans = {success: false} ;
        res.json(ans);
        
    })
});

// append /api for our http requests
app.use("/", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

