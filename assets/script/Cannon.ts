// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Common from "./Common";
import Magazine from "./Magazine";



const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // 子弹图片
    @property(cc.SpriteFrame)
    bulletIcon: cc.SpriteFrame = null;

    // 爆炸特效
    @property(cc.SpriteFrame)
    explodeEffect: cc.SpriteFrame = null;

    // 音效
    @property(cc.AudioClip)
    audioFire : cc.AudioClip = null;
    @property(cc.AudioClip)
    audioExplode : cc.AudioClip = null;

    // 炮塔图片
    @property(cc.SpriteFrame)
    iconNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    iconActive: cc.SpriteFrame = null;

    // 内部属性    
    startPos : cc.Vec2 = null;
    startAngle : number = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始角度设为90度
        this.node.angle = 90;

        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);
    }

    start () {

    }

    // update (dt) {}

    onTouchStart(e : cc.Event.EventTouch){        
        // startPos : 触点开始的位置
        this.startPos = this.node.parent.convertToNodeSpaceAR(e.getLocation());
        // startAngle : 炮口的初始角度 (x轴方向为0度)
        this.startAngle = this.node.angle;

        // 激发时的图片显示
        this.node.getComponent(cc.Sprite).spriteFrame = this.iconActive;
    }

    onTouchMove (e : cc.Event.EventTouch){     
        // 触点的当前位置
        let pos = this.node.parent.convertToNodeSpaceAR(e.getLocation());

        // 摆动的角度 a.signAngle(b) 即 a向量与b向量之前的夹角
        let sweep_radian = pos.signAngle( this.startPos);
        let sweep_angle = 180 * sweep_radian / Math.PI; // 弧度radian -> 角度 angle
        
        // 炮口的新指向
        // 比如，原来炮口90度，向右摆动15度，则炮口应指向75度
        let angle = this.startAngle - sweep_angle;
        // 炮口角度限制在45~135度之间
        if(angle < 45) angle = 45; 
        if(angle > 135 ) angle = 135; 

        //cc.log("炮口摆动: " + sweep_angle + ', 修正后的角度: ' + angle);

        this.node.angle = angle;
    }

    onTouchEnd (e : cc.Event.EventTouch){
       
        this.fire();

        // 普通状态的图片显示
        this.node.getComponent(cc.Sprite).spriteFrame = this.iconNormal;
    }

    // 开火
    fire( ){
        if(this.bulletIcon==null){ cc.log('请设置bulletIcon图片'); return; }

        // 炮口的指向，应是子弹的运行方向
        let angle : number  = this.node.angle; // 子弹运行的方向 
        let radian = angle * Math.PI / 180;
        let direction = cc.v2( Math.cos(radian), Math.sin(radian)); // 标准化向量

        // 动态创建一个Node，添加Sprite组件
        let bulletNode : cc.Node = new cc.Node();        
        let sprite : cc.Sprite = bulletNode.addComponent(cc.Sprite);
        sprite.spriteFrame = this.bulletIcon;   // 设置子弹的图片     
        
        bulletNode.parent = this.node.parent; // 指定父节点

        // 角度及初始位置  
        bulletNode.angle = this.node.angle; // 子弹的角度
        let r = 120; // 子弹与射击基准的距离
        let bullet_x = r * direction.x;
        let bullet_y = r * direction.y;
        bulletNode.setPosition(cc.v3(bullet_x, bullet_y, 0));    // 子弹的初始位置       

        // // 给子弹附加脚本组件
        // let bullet: Bullet  = bulletNode.addComponent( Bullet );
        // bullet.direction = direction; // 子弹的飞行方向

        let bullet : Bullet = bulletNode.addComponent( Bullet);
        bullet.direction = direction;
        bullet.target = cc.find('Canvas/靶子');
        bullet.explodeEffect = this.explodeEffect; // 爆炸特效
        bullet.audioExplode = this.audioExplode;

        // let magazine : Magazine = cc.find('Canvas/弹仓').getComponent('Magazine');
        // magazine.consume(1);

        Common.magazine.consume(1);

        // 音效
        if(this.audioFire!=null)
            cc.audioEngine.play(this.audioFire, false, 1);
    }       
    
}
