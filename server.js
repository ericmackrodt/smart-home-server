var PubNub = require('pubnub');
const TuyaDevice = require('tuyapi');
let tuya = new TuyaDevice({
    id: '',
    key: ''
});
tuya.resolveIds();

function getDevice(part) {
    return {
        tv: 1,
        retro: 2,
        new: 3,
        light: 4,
        usb: 5,
        all: 6
    }[part];
}


function turnPowerOn(m) {
        const device = getDevice('retro');
        tuya.set({set: false, dps: device}).then(result => {
            console.log('Enabled:', device);
        })
      .catch(err => console.log('Error: ', err));
}

var pubnub = new PubNub({
    ssl: true
});

pubnub.addListener({
    message: function (m) {
        // handle message
        var actualChannel = m.actualChannel;
        var channelName = m.channel; // The channel for which the message belongs
        var msg = m.message; // The Payload
        var publisher = m.publisher;
        var subscribedChannel = m.subscribedChannel;
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken        
        console.log(m);
        turnPowerOn();
    },
    presence: function (p) {
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs
        var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
        var presenceEventTime = p.timestamp; // Presence event timetoken
        var status = p.status; // 200
        var message = p.message; // OK
        var service = p.service; // service
        var uuids = p.uuids;  // UUIDs of users who are connected with the channel with their state
        var occupancy = p.occupancy; // No. of users connected with the channel
        console.log(p);
    },
    status: function (s) {
        // handle status
        var category = s.category; // PNConnectedCategory
        var operation = s.operation; // PNSubscribeOperation
        var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
        var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
        var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
        var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
        var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
        console.log(s);
    }
});

pubnub.time(function (status, response) {
    if (status.error) {
        // handle error if something went wrong based on the status object
    } else {
        console.log(response.timetoken);
    }
})

pubnub.subscribe({
    channels: ['my_channel'],
});