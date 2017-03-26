cc.Class({
    extends: cc.Component,

    properties: {
        expLabel: cc.Label,
        levelUpNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    showExp: function (exp) {
        this.expLabel.string = exp;
        this.levelUpNode.active = false;
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
