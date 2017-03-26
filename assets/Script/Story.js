cc.Class({
    extends: cc.Component,

    properties: {
        posList: [cc.Node],
        putPlace: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.players = [];
        this.storyGenerator = new (require("StoryGenerate"));
        
        // test
        this.init("training");
    },

    init: function (chapterIdx) {
        cc.loader.loadRes("Data/chapterData.txt", (err, text)=>{
            if (!err) {
                var chapterData = JSON.parse(text)[chapterIdx];
                if (chapterData == null) {
                    cc.log("err: story has no chapterIdx with '" + chapterIdx + "'");
                    return;
                }
                cc.loader.loadRes("Data/playerData.txt", (err, text2)=>{
                    if (!err) {
                        var playerData = JSON.parse(text2);
                        this.startStory(chapterData, playerData);
                    }
                    else {
                        cc.log("err: failed load file playerData.txt");
                    }
                });
            }
            else {
                cc.log("err: failed load file chapterData.txt");
            }
        });
    },

    startStory: function (chapterData, playerData) {
        this.storyData = this.storyGenerator.calculateStory(chapterData, playerData);
        this.playerFinishNum = 0;
        for (var i = 0; i < 12; i ++) {
            let idx = i;
            var player = chapterData.players[i];
            if (player == null) {
                this.players[idx] = null;
                this.playerFinishNum ++;
                if (this.playerFinishNum >= 12) {

                }
            }
            else {
                cc.loader.loadRes("Heros/" + player, (err, prefab)=>{
                    var player = cc.instantiate(prefab);
                    this.putPlace.addChild(player);
                    cc.log("qia qia idx = " + idx);
                    player.setPosition(this.posList[idx].getPosition());
                    player.width = this.posList[idx].width;
                    player.height = this.posList[idx].height;
                    this.players[idx] = player;
                    this.playerFinishNum ++;
                    if (this.playerFinishNum >= 12) {

                    }
                });
            }
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
