import express from "express";
const KasaControl = require('kasa_control');
const server = express();
const envHostname = process.env.serverhostname;

var hostname = "localhost";

if (envHostname !== undefined) {
    hostname = envHostname;
} 

const port = 4200;
const kasa = new KasaControl()

const emailAddress = process.env.emailAddress;
const password = process.env.password;

server.get('/', (req:express.Request, res:express.Response) => {
    res.send('Hello World!');
})

server.get('/lightsOff', async (req, res) => {
    console.log("Turning lights off")
    await kasa.login(emailAddress, password)
    const devices:Array<any> = await kasa.getDevices()
    
    console.log(`Found ${devices.length} devices to turn off.`)

    var myPromiseArray:Array<Promise<any>> = [];

    devices.forEach(device => {
        
        myPromiseArray.push(
            kasa.power(device.deviceId,false).catch((error:any) => {
                console.error(`Unable to turn off device with name: ${device.alias}`)
            })
        )   
    });
    
    await Promise.all(myPromiseArray);

    //await kasa.power(devices[0].deviceId, false)
    res.send('Turned off.');
})

server.get('/lightsOn', async (req:express.Request, res:express.Response) => {
    console.log("Turning on lights")
    await kasa.login(emailAddress, password)
    const devices:Array<any> = await kasa.getDevices()
    
    console.log(`Found ${devices.length} devices to turn on.`)
    var myPromiseArray:Array<Promise<any>> = [];

    devices.forEach(device => {
        
        myPromiseArray.push(
            kasa.power(device.deviceId,true).catch(() => {
                console.error(`Unable to turn on device with name: ${device.alias}`)
            })
        )   
    })
    
    await Promise.all(myPromiseArray)

    //await kasa.power(devices[0].deviceId, false)
    res.send('Turned on.');
})

server.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}`);
});

