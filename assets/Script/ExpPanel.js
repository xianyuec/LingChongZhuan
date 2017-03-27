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
        var lcLevel = parseInt(cc.sys.localStorage.getItem("LCLevel"));
        var lcExp = parseInt(cc.sys.localStorage.getItem("LCExp"));
        lcExp += exp;
        if (lcExp > lcLevel * 100) {
            lcLevel += 1;
            lcExp = 0;
            this.levelUpNode.active = true;
            this.levelUpNode.getComponent(cc.Label).string = "等级提升至" + lcLevel + "级";
        }
        else {
            this.levelUpNode.active = false;
        }
        cc.sys.localStorage.setItem("LCLevel", lcLevel);
        cc.sys.localStorage.setItem("LCExp", lcExp);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
