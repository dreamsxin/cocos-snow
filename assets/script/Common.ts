// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Magazine from "./Magazine";
import ResultDialog from "./ResultDialog";
import Target from "./Target";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Common extends cc.Component {

    static magazine : Magazine = null;

    // 得分统计
    static score : number = 0;

    // 结果提示框
    static resultDialog : ResultDialog = null;
    
    onLoad () {
        cc.log('Common.onLoad()被调用');
        
        Common.magazine = cc.find('Canvas/弹仓').getComponent('Magazine');
        Common.resultDialog = cc.find('Canvas/结果提示框').getComponent('ResultDialog');
    }

    static resetGame(){
        Common.score = 0;
        Common.magazine.reset();
    }

    // update (dt) {}
}
