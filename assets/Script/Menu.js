cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            url: cc.AudioClip,
            default: null
        },
        mainNode: cc.Node,
        storyNode: cc.Node,
    },

    onLoad: function () {
        this.current = cc.audioEngine.play(this.audio, true, 0.5);
        
        if (cc.sys.localStorage.getItem("LCLevel") == null) {
            cc.sys.localStorage.setItem("LCLevel", 1);
            cc.sys.localStorage.setItem("LCExp", 0);
        }
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    },
    
    onClickStart: function () {
        this.mainNode.active = true;
    },

    goToChapter: function (chapter) {
        this.storyNode.active = true;
        this.storyNode.getComponent("Story").init(chapter);
    },

    onClickTraining: function () {
        this.goToChapter("training");
    },

    onClick_1: function () {
        this.goToChapter("1");
    },
    onClick_2: function () {
        this.goToChapter("2");
    },
    onClick_3: function () {
        this.goToChapter("3");
    },
    onClick_4: function () {
        this.goToChapter("4");
    },
    onClick_5: function () {
        this.goToChapter("5");
    },
    onClick_6: function () {
        this.goToChapter("6");
    },

});
