cc.Class({
    extends: cc.Component,

    properties: {
        bloodBar: cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    updateShowBloodRate: function (rate) {
        this.bloodBar.progress = rate;
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
