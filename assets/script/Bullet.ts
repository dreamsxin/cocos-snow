// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Common from "./Common";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {   
 
    // 飞行的方位 (标准化向量)
    direction : cc.Vec2 = null;

    // 靶标
    target : cc.Node = null;

    // 爆炸特效
    explodeEffect: cc.SpriteFrame = null;

    // 音效
    audioExplode : cc.AudioClip = null;

    onLoad () {
        
    }

    start () {
        if(this.target == null) { cc.log('未设置靶标 target 属性!'); return; }
        if(this.explodeEffect == null) { cc.log('未设置爆炸特效 explodeEffect 属性!'); return; }

        this.schedule(this.onTimer, 0.016);
    }

    onTimer(){
        if(this.node.y > 400)  // 靶标与射击基准之间的距离
        {
            this.unschedule(this.onTimer);  

            if(this.isHit())
                this.success();
            else
                this.failed();  

            return;    
        }

        let speed : number = 15; // 步长
        let dx = speed * this.direction.x;
        let dy = speed * this.direction.y;
        
        this.node.x += dx;
        this.node.y += dy;
    }
   
    dismiss(){
        this.node.destroy();
        
        if(Common.magazine.count <= 0)
        {
            Common.resultDialog.show();
        }
    }

    // 检查是否命中目标
    isHit() : boolean { 
        let targetPos :cc.Vec2 = this.getWorldLocation(this.target);
        let selfPos: cc.Vec2 = this.getWorldLocation(this.node);
        let distance : number = Math.abs( targetPos.x - selfPos.x) ;  // x方向距离
        // let distance : number = cc.Vec2.distance(targetPos, selfPos);
        cc.log('靶标x=' + targetPos.x + ', 子弹x=' + selfPos.x);
        
        if(distance < 50) return true;       
        return false;
    }

    // 获取一个节点的世界坐标
    getWorldLocation( node : cc.Node) : cc.Vec2 {
        let pos = node.getPosition();
        return node.parent.convertToWorldSpaceAR( pos );
    }

    success(){        
        // 此处应添加特效

        cc.log('命中目标');
        // this.dismiss();   
        
        this.explode();
        this.cheer();   
        
        // 得分
        Common.score += 10;

        // 音效
        if(this.audioExplode!=null)
            cc.audioEngine.play(this.audioExplode, false, 1);
    }

    failed(){
        cc.log('脱靶!');
        this.dismiss(); // 直接销毁
    }

    // 爆炸特效
    explode(){
        cc.log('爆炸效果..');
        let sp : cc.Sprite = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = this.explodeEffect;

        this.node.scale = 0.1;

        let self = this;
        cc.tween(this.node)
            .to(0.4, { scale: 1 } )
            .to(0.2, { opacity: 0} )
            .call( function(){ self.dismiss(); } )
            .start();
    }

    // 加分效果
    cheer(){
        let labelNode : cc.Node = new cc.Node();
        let label : cc.Label = labelNode.addComponent(cc.Label);
        label.string = "+10分";
        labelNode.color = new cc.Color(255,0,0);
        labelNode.parent = this.node.parent;
        labelNode.setPosition(cc.v3(0, 250, 0));
        labelNode.opacity = 200;

        cc.tween(labelNode)
            .to(0.5, {scale: 1.5})
            .to(0.2, {opacity: 0})
            .call( function(){ labelNode.destroy(); } )
            .start();
    }

}
