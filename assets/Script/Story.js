cc.Class({
    extends: cc.Component,

    properties: {
        posList: [cc.Node],
        putPlace: cc.Node,
        chatPlace: cc.Node,
        expPanel: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.players = [];
        this.storyGenerator = new (require("StoryGenerate"));
        
        // test
        this.init("training");
    },

    onClickEnd: function () {
        this.putPlace.removeAllChildren();
        this.node.active = false;
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
        this.topZIndex = 1;
        for (var i = 0; i < 12; i ++) {
            let idx = i;
            var player = chapterData.players[i];
            if (player == null) {
                this.players[idx] = null;
                this.playerFinishNum ++;
                if (this.playerFinishNum >= 12) {
                    // this.tellStory();
                    this.tellStoryIdx = 0;
                    this.canTellStory = true;
                }
            }
            else {
                cc.loader.loadRes("Heros/" + player, (err, prefab)=>{
                    var player = cc.instantiate(prefab);
                    this.putPlace.addChild(player);
                    player.setPosition(this.posList[idx].getPosition());
                    player.width = this.posList[idx].width;
                    player.height = this.posList[idx].height;
                    this.players[idx] = player;
                    this.players[idx].zIndex = 1;
                    this.playerFinishNum ++;
                    if (this.playerFinishNum >= 12) {
                        // this.tellStory();
                        this.tellStoryIdx = 0;
                        this.canTellStory = true;
                    }
                });
            }
        }
    },

    tellStory: function () {
        this.canTellStory = false;

        // if (this.tellStoryIdx == null) {
        //     this.tellStoryIdx = 0;
        // }
        if (this.tellStoryIdx >= this.storyData.length) {   // 说明游戏结束了
            // tmp
            return;
        }
        var content = this.storyData[this.tellStoryIdx];
        cc.log("qia: " + this.tellStoryIdx + "/" + this.storyData.length + " content = " + JSON.stringify(content));
        if (content.type == "talk") {
            this.chatPlace.active = true;
            this.chatPlace.getComponent("ChatPlace").loadChat(content.name, content.content);
            this.tellStoryIdx ++;
            this.scheduleOnce(()=>{
                this.chatPlace.active = false;
                // this.tellStoryIdx ++;
                // this.tellStory();
                this.canTellStory = true;
            }, 1);
        }
        else if (content.type == "attack") {
            cc.log("pia qia 0 : " + JSON.stringify(content));
            var sIdx = content.s;
            var tIdx = content.t;
            var damage = content.damage;

            cc.log("pia qia 0.1 : s = " + sIdx + ", t = " + tIdx + " , damage = " + damage);

            this.topZIndex += 10;
            this.players[sIdx].zIndx = this.topZIndex;

            cc.log("pia qia : hello");

            cc.log("pia qia 0.5 : " + this.players[sIdx] + " , " + this.players[tIdx]);

            // this.scheduleOnce(()=>{
                var pos1 = this.players[sIdx].getPosition();
                var pos2 = this.players[tIdx].getPosition();
                var pos3 = cc.p(pos2.x, pos2.y+50);
                if (sIdx < 6) 
                    pos3 = cc.p(pos2.x, pos2.y-50);
                cc.log("pia qia pa pos: " + pos1 + " , " + pos2 + " , " + pos3);
                var moveTo1 = cc.moveTo(0.5, pos3);
                var moveTo2 = cc.moveTo(0.2, pos2);
                var moveTo3 = cc.moveTo(0.2, pos3);
                var moveTo4 = cc.moveTo(0.5, pos1);
                this.tellStoryIdx ++;
                cc.log("pia qia pa -- 1");
                var callFunc = cc.callFunc(()=>{
                    // this.tellStoryIdx ++;
                    // this.tellStory();
                    this.canTellStory = true;
                    cc.log("pia qia pa -- 3");
                });
                var stop = cc.moveBy(0.2, cc.p(0, 0));
                this.players[sIdx].runAction(cc.sequence(moveTo1, stop, moveTo2, moveTo3, stop, moveTo4, callFunc));
                cc.log("pia qia pa -- 2");
                // }, 10);
        }
        else if (content.type == "injured") {
            var idx = content.id;
            var rate = content.nowHP / content.totHP;
            this.players[idx].getComponent("Hero").updateShowBloodRate(rate);
            this.tellStoryIdx ++;
            this.scheduleOnce(()=>{
                // this.tellStoryIdx ++;
                // this.tellStory();
                this.canTellStory = true;
            }, 0.5);
        }
        else if (content.type == "dead") {
            var idx = content.id;
            this.players[idx].getComponent("Hero").dead();
            this.tellStoryIdx ++;
            this.scheduleOnce(()=>{
                // this.tellStoryIdx ++;
                // this.tellStory();
                this.canTellStory = true;
            }, 0.5);
        }
        else if (content.type == "end") {
            this.expPanel.active = true;
            this.expPanel.getComponent("ExpPanel").showExp(content.exp);
            this.tellStoryIdx ++;
            this.scheduleOnce(()=>{
                // this.tellStoryIdx ++;
                // this.tellStory();
                this.canTellStory = true;
            }, 0.5);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.tellStoryIdx != null && this.storyData != null && this.tellStoryIdx < this.storyData.length) {
            if (this.canTellStory) {
                cc.log("pia: story = " + JSON.stringify(this.storyData[this.tellStoryIdx]));
                this.tellStory();
            }
        }
    },
});
