cc.Class({
    extends: cc.Component,

    properties: {
        bloodBar: cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        this.bloodBar.width = this.bloodBar.node.getChildByName("bar").width = this.node.width;
    },
    
    updateShowBloodRate: function (rate) {
        this.bloodBar.progress = rate;
    },

    dead: function() {
        if (this.name != null) {

        }
        this.node.destroy();
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
