export default class ChannelView{
    constructor(user){
        this.user = user;
        this.registerChannelListeners();
        this.registerNewChannelButtonEvent();
    }

    /*
    ========================================
    Display Channels
    ========================================
    */
    registerChannelListeners(){
        return firebase.database().ref('channels/').on('value', function (snap) {
            this.clearChannels();
            this.displayChannels();
        }.bind(this))
    }

    displayChannels(){
        this.clearChannels();
        return firebase.database().ref('channels/').once('value').then(function (snap) {
            this.clearChannels();
            for (let key in snap.val()){
                let channel = snap.val()[key];
                this.displayOneChannel(channel);
        }}.bind(this));
    }

    displayOneChannel(channel){
        let listItem = document.createElement('li');
        let channelButton = document.createElement('button');
        channelButton.classList.add('channel-display');
        channelButton.innerText = channel.channelname;
        channelButton.dataset.channelname = channel.channelname;
        channelButton.dataset.owner = channel.owner;
        channelButton.onclick = function(){

        }

        listItem.appendChild(channelButton);
        document.getElementById('channels-list').appendChild(listItem);
    }

    clearChannels(){
        let channelContainer = document.getElementsByClassName('channel-display');
        for (let channel of channelContainer){
            channel.parentNode.removeChild(channel);
        }
    }

    /*
    ========================================
    Add Channel
    ========================================
    */

    addNewChannel(channelName){
        let newChannelData = {
            channelname: channelName,
            owner: this.user,
            messages: {}
        };
        return firebase.database().ref('channels/' + channelName).set(newChannelData);
    }

    registerNewChannelButtonEvent(){
        let button = document.getElementById('new-channel-button');

        button.onclick = function(){
            this.getNewChannelName().then(function (channelName) {
                if (channelName !== "") {this.addNewChannel(channelName, this.user)}
            }.bind(this))
        }.bind(this);
    }

    getNewChannelName() {
        let newName = prompt("Channel name:");
        return this.checkIfChannelNameIsDuplicate(newName).then(
            function (isDuplicate) {
                if (isDuplicate){
                    alert('This name already exists');
                    return "";
                } else {
                    return newName;
                }
            }
        )
    }

    checkIfChannelNameIsDuplicate(newName) {
        let allChannels = [];
        return firebase.database().ref('channels').once("value").then(function (snap) {
            for (let key in snap.val()){
                allChannels.push(snap.val()[key].channelname);
            }
            console.log(allChannels);
            return allChannels.includes(newName);
        });
    }

    /*
    ========================================
    Join Channel
    ========================================
    */

    changeActiveChannelTo(channelName){
        this.user.activeChannel = channelName;
    }

}