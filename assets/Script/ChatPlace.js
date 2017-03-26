cc.Class({
    extends: cc.Component,

    properties: {
        tellerNode: cc.Node,
        contentLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        // this.loadChat("dongchao", "大家好！");
    },

    loadChat: function (name, content) {
        this.contentLabel.string = content;

        cc.loader.loadRes("UI/heroCard/" + name, cc.SpriteFrame, (err, spriteFrame)=>{
            if (err) {
                cc.error(err);
                return;
            }
            var sprite = this.tellerNode.getComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
