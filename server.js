require("dotenv").config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/login', (req, res)=>{
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })
    // alert("Hello! I am an alert box!!");
    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresin: data.body.expires_in
        })
    }).catch((err)=>{
        console.log("HELLO......");
        console.log("err=>",err); 
        res.sendStatus(400);
    })
})

app.post('/refresh', (req, res)=>{
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })
    // console.log("hi himanshu singhal")
    spotifyApi
        .refreshAccessToken()
        .then(data=>{
            res.json({ 
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })  
        .catch(()=>{
            res.sendStatus(400)
        })

})
app.get("/lyrics", async(req, res)=>{
    const lyrics = 
    (await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found")
    res.json({lyrics})
})
 
// app.listen(3001);
app.listen(process.env.PORT || 3001);