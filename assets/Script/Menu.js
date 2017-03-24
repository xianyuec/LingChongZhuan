cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            url: cc.AudioClip,
            default: null
        },
        mainNode: cc.Node,
    },

    onLoad: function () {
        this.current = cc.audioEngine.play(this.audio, true, 0.5);
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    },
    
    onClickStart: function () {
        this.mainNode.active = true;
    },
});
