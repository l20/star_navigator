import { DialogueNode } from '@/store/useDialogueStore';

export const LEVEL_0_SCRIPT: DialogueNode[] = [
  {
    id: 'l0_intro_1',
    text: "链接成功。这里的熵值正在失控。",
    speaker: 'player',
    next: 'l0_photon_1'
  },
  {
    id: 'l0_photon_1',
    text: "欢迎回来，调律师。这里是‘零点’(The Origin)，万物坍塌前的初始态。",
    speaker: 'photon',
    emotion: 'neutral',
    next: 'l0_intro_2'
  },
  {
    id: 'l0_intro_2',
    text: "看，老商人的货运路标被抹平了。在 y = 0 的线性虚无中，空间失去了维度。",
    speaker: 'photon',
    emotion: 'sad',
    next: 'l0_merchant_1'
  },
  {
    id: 'l0_merchant_1',
    text: "嘿！那个发光的小鹿，你在跟谁说话？我前面那条路……它消失了！",
    speaker: 'merchant',
    emotion: 'confused',
    next: 'l0_player_2'
  },
  {
    id: 'l0_player_2',
    text: "（我能感受到这里的常数。它们在颤抖，等待着被重新校准。）",
    speaker: 'player',
    next: 'l0_photon_3'
  },
  {
    id: 'l0_photon_3',
    text: "是的，调师。二次幂是弯曲维度的第一步。试着给系数 'a' 注入‘能量’。",
    speaker: 'photon',
    emotion: 'happy',
    next: 'l0_photon_4'
  },
  {
    id: 'l0_photon_4',
    text: "控制权已移交给您。让这条死寂的直线‘站’起来吧。观察 a 的正负，那是塑造世界的意志。",
    speaker: 'photon',
    emotion: 'neutral',
    action: 'ENABLE_CONTROLS'
  }
];



// Hint for Level 0
export const HINT_LEVEL_0: DialogueNode[] = [
  {
    id: 'hint_l0',
    text: "我们需要弯曲它！拖动 'a' 滑块，任何非零的值都可以打破线性束缚。",
    speaker: 'photon',
    emotion: 'neutral'
  }
];
