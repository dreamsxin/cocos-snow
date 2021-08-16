// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Target extends cc.Component {

    // 运动方向
    isLeft : boolean = true;

    onLoad () {
    }

    start () {
    }

    update (dt) {
        let dx : number = 3;
        if(this.isLeft){
            dx = 0 - dx;
        }
        this.node.x += dx;
        if(this.isLeft && this.node.x < - 200)
            this.isLeft = false;
        if(! this.isLeft && this.node.x > 200)
            this.isLeft = true;
    }


}
