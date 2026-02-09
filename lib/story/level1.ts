import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_1_SCRIPT: DialogueNode[] = [
  {
    id: 's1_start',
    text: "生命维持系统恢复绿色。正在执行强制唤醒程序……",
    speaker: 'system',
    next: 's1_lin_wakeup'
  },
  {
    id: 's1_lin_wakeup',
    text: "（剧烈的咳嗽声）咳咳……水……我……我还活着？",
    speaker: 'captain',
    emotion: 'scared',
    next: 's1_deer_1'
  },
  {
    id: 's1_deer_1',
    text: "老林！如果你再晚醒哪怕30秒，我就只能把你做成冷冻标本了！多亏了领航员重构了动力场。",
    speaker: 'deer',
    emotion: 'happy',
    next: 's1_lin_2'
  },
  {
    id: 's1_lin_2',
    text: "领航员？（看向屏幕）……ID 9527？呵，这种绝境还有人愿意接手。看来命不该绝。",
    speaker: 'captain',
    emotion: 'neutral',
    next: 's1_lin_3'
  },
  {
    id: 's1_lin_3',
    text: "等等，前面是什么鬼东西？！雷达显示全是……那些是之前试图逃逸的飞船残骸？",
    speaker: 'captain',
    emotion: 'scared',
    next: 's1_deer_2'
  },
  {
    id: 's1_deer_2',
    text: "是“线性坟场”。所有试图走直线（y=kx+b）逃离引力井的家伙，都撞成了碎片。前路被封死了。",
    speaker: 'deer',
    emotion: 'worry',
    next: 's1_nav_1'
  },
  {
    id: 's1_nav_1',
    text: "（必须寻找新的路径……如果无法穿过，或许可以……跨越？）",
    speaker: 'navigator',
    next: 's1_deer_3'
  },
  {
    id: 's1_deer_3',
    text: "正确。二维平面的障碍，在三维视角只是个又矮又胖的积木。我们需要计算垂直位移参数 k，直接“跳”过去！",
    speaker: 'deer',
    emotion: 'happy',
    next: 's1_open_mind'
  },
  {
    id: 's1_open_mind',
    text: "（正在解析垂直位移逻辑……思维殿堂启动。）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE',
    next: 's1_resume_1'
  },
  {
    id: 's1_resume_1',
    text: "公式已修正：y = ax² + k。口诀是“上加下减”。领航员，拉升高度！",
    speaker: 'deer',
    next: 's1_tutorial'
  },
  {
    id: 's1_tutorial',
    text: "（任务目标：调整 k 值（垂直位移），让飞船越过前方的残骸障碍。）",
    speaker: 'system',
    action: 'ENABLE_CONTROLS',
    next: 's1_end'
  }
];
