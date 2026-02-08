import { DialogueNode } from '@/store/useDialogueStore';

export const LEVEL_1_SCRIPT: DialogueNode[] = [
  {
    id: 'l1_player_1',
    text: "桥梁结构已弯曲，但坐标值似乎有误。",
    speaker: 'player',
    next: 'l1_merchant_1'
  },
  {
    id: 'l1_merchant_1',
    text: "喂！调律师！虽然桥弯了，但它陷在地表下面了！我的货车可没法在土里跑。",
    speaker: 'merchant',
    emotion: 'worry',
    next: 'l1_photon_2'
  },
  {
    id: 'l1_photon_2',
    text: "检测到垂直轴向偏差。我们需要引入常数 k —— 调律师，那是您的‘重力杠杆’。",
    speaker: 'photon',
    emotion: 'neutral',
    next: 'l1_player_2'
  },
  {
    id: 'l1_player_2',
    text: "（+ k... 如果我增加这个常数，整个结构就会向上平移。）",
    speaker: 'player',
    next: 'l1_photon_3'
  },
  {
    id: 'l1_photon_3',
    text: "正如您所见。垂直平移不会改变形状，只会改变位置。请通过 k 值将能量桥抬升至路面。",
    speaker: 'photon',
    emotion: 'happy',
    next: 'l1_merchant_2'
  },
  {
    id: 'l1_merchant_2',
    text: "快动动你的‘魔法滑块’！那些裂缝里冒出的黑气让我发毛。",
    speaker: 'merchant',
    emotion: 'scared',
    action: 'ENABLE_CONTROLS'
  }
];



export const HINT_LEVEL_1: DialogueNode[] = [
  {
    id: 'hint_l1',
    text: "别担心形状 ('a')，它已经被锁定了。只要调整 'k' 把整体高度加上去就行。",
    speaker: 'photon',
    emotion: 'neutral'
  }
];
