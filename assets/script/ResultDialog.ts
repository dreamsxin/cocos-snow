// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Common from "./Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultDialog extends cc.Component {

    onLoad () {
        let replayNode : cc.Node = cc.find('replay', this.node);
        replayNode.on('touchstart', this.onReplay, this);

        // 拦截触摸事件
        this.node.on('touchstart', this.onTouchDisable, this);
        this.node.on('touchmove', this.onTouchDisable, this);
        this.node.on('touchend', this.onTouchDisable, this);
    }

    start () {
    }

    // 显示提示框
    show(){
        this.node.active = true;

        // 显示最终得分
        let scoreNode : cc.Node = cc.find('分数', this.node);
        let scoreLabel : cc.Label = scoreNode.getComponent(cc.Label);   
        scoreLabel.string = Common.score + '分';     
    }

    // 隐藏提示框
    dismiss(){
        this.node.active = false;        
    }    

    // 添加一个onReplay来响应事件吧
    onReplay(){
        this.dismiss();

        // 重置游戏
        Common.resetGame(); 
    }

    onTouchDisable( e : cc.Event.EventTouch ){
        e.stopPropagation();
    }
}
