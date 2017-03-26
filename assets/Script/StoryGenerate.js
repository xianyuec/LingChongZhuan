cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        // this.test();
    },
    
    test: function () {
        var chapterData = {
            start: [{name: "linchong", content: "start"}],
            win: [{name: "linchong", content: "win"}],
            lose: [{name: "linchong", content: "lose"}],
            players: [  
                null, "HeroDemo", null, null, null, null,
                null, "HeroDemo", null, null, null, null,                
            ],
            exp: 100,
        };
        var playerData = {
            HeroDemo: {attack: 10, blood: 100, speed: 1},
        };
        
        this.calculateStory(chapterData, playerData);
    },
    
    calculateStory: function (chapterData, playerData) {
        var res = [];
        for (var i = 0; i < chapterData.start.length; i ++) {
            var data = chapterData.start[i];
            res.push({type: "talk", name: data.name, content: data.content});
        }
        var speedList = [];
        var aliveHeroIdList = [];
        var aliveEnemyIdList = [];
        var playerList = [];
        for (var i = 0; i < chapterData.players.length; i ++) {
            var player = chapterData.players[i];
            if (player == null) {
                playerList.push(null);
                continue;
            }
            else {
                var data = playerData[player];
                playerList.push({
                    attack: data.attack,
                    totHP: data.blood,
                    nowHP: data.blood,
                });
            }
            speedList.push({id: i, speed: player.speed});
            if (i < 6) aliveHeroIdList.push(i);
            else aliveEnemyIdList.push(i);
        }
        speedList.sort((a, b)=>{ return b.speed - a.speed; });
        // if fight more than 30 loops , then lose
        var fightResult = 0;    // 1: win; -1: lose
        for (var fightTime = 0; fightTime < 30; fightTime ++) {
            var list = [];
            for (var i = 0; i < speedList.length; i ++) {
                list.push(speedList[i]);
            }
            for (var i = 0; i < list.length; i ++) {
                var id = list[i].id;
                if (id < 6) {   // hero attack enemy
                    var enemyId = aliveEnemyIdList[Math.floor(Math.random() * aliveEnemyIdList.length)];
                    var enemyData = playerList[enemyId];
                    var damage = Math.floor(playerList[id].attack * (0.8 + 0.3 * Math.random()));
                    var heatDead = false;
                    if (damage > enemyData.nowHP) {
                        damage = enemyData.nowHP;
                        heatDead = true;
                    }
                    res.push({type: "attack", s: id, t: enemyId, damage: damage});
                    res.push({type: "injured", id: enemyId});
                    enemyData.nowHP -= damage;
                    if (heatDead) {
                        res.push({type: "dead", id: enemyId});
                        playerList[enemyId] = null;
                        var newList = [];
                        aliveEnemyIdList.forEach((id)=>{
                            if (id != enemyId)
                                newList.push(id);
                        });
                        aliveEnemyIdList = newList;
                        if (aliveEnemyIdList.length <= 0) {
                            fightResult = 1;
                            break;
                        }
                    }
                    else {
                        playerList[enemyId] = enemyData;
                    }
                }
                else {          // enemy attack hero
                    var heroId = aliveHeroIdList[Math.floor(Math.random() * aliveHeroIdList.length)];
                    var heroData = playerList[heroId];
                    var damage = Math.floor(playerList[id].attack * (0.8 + 0.3 * Math.random()));
                    var heatDead = false;
                    if (damage > heroData.nowHP) {
                        damage = heroData.nowHP;
                        heatDead = true;
                    }
                    res.push({type: "attack", s: id, t: heroId, damage: damage});
                    heroData.nowHP -= damage;
                    res.push({type: "injured", id: heroId, nowHP: heroData.nowHP, totHP: heroData.totHP});
                    if (heatDead) {
                        res.push({type: "dead", id: enemyId});
                        playerList[heroId] = null;
                        var newList = [];
                        aliveHeroIdList.forEach((id)=>{
                            if (id != heroId)
                                newList.push(id);
                        });
                        aliveHeroIdList = newList;
                        if (aliveHeroIdList.length <= 0) {
                            fightResult = -1;
                            break;
                        }
                    }
                    else {
                        playerList[heroId] = heroData;
                    }
                }
            }
            
            if (fightResult != 0) {
                break;
            }
        }
        if (fightResult > 0) {  // win
            for (var i = 0; i < chapterData.win.length; i ++) {
                var data = chapterData.win[i];
                res.push({type: "talk", name: data.name, content: data.content});
            }
            res.push({type: "end", exp: chapterData.exp});
        }
        else {                  // lose
            for (var i = 0; i < chapterData.lose.length; i ++) {
                var data = chapterData.lose[i];
                res.push({type: "talk", name: data.name, content: data.content});
            }
            res.push({type: "end", exp: 0});
        }
        
        return res;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
