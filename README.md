## quickstart
## 之前steam听到过5D Chess这个游戏，于是做了个3D空间的井字棋。采用的极小极大算法，并使用Alpha-beta剪枝做了优化。（https://en.wikipedia.org/wiki/Minimax）

##下图为获胜解的一种



<img width="299" alt="截屏2022-12-17 13 05 10" src="https://user-images.githubusercontent.com/14979005/208226178-d7dd9216-b38a-4aa1-a23f-03a9906b1bc7.png">
                                              


## 源码目录介绍
```
./js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   ├── gameboard.js                       // 棋盘类
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏逻辑
└── main.js                                // 游戏入口主函数

```

## 扩展
1 三维棋盘下面的三人模式
2 可以学习神经网络tensorflow训练AI
3 tips ：先走中间层正中间会让难度降低很多
