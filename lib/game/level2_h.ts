import { DialogueNode } from '@/store/useDialogueStore';

export const LEVEL_2_SCRIPT: DialogueNode[] = [
  {
    id: 'l2_photon_1',
    text: "警报。横向引力场发生偏转。调律师，空间坐标正在漂移。",
    speaker: 'photon',
    emotion: 'surprised',
    next: 'l2_merchant_1'
  },
  {
    id: 'l2_merchant_1',
    text: "救命啊！桥就在我左边几十米的地方，可我的轮子没法在空气里开！",
    speaker: 'merchant',
    emotion: 'angry',
    next: 'l2_player_1'
  },
  {
    id: 'l2_player_1',
    text: "（这是由于 h 的偏移造成的。我必须通过 (x - h) 来修正水平位移。）",
    speaker: 'player',
    next: 'l2_photon_2'
  },
  {
    id: 'l2_photon_2',
    text: "括号内部是极具误导性的镜像空间。调律师，展示您的直觉吧。",
    speaker: 'photon',
    emotion: 'neutral',
    next: 'l2_player_2'
  },
  {
    id: 'l2_player_2',
    text: "（左加右减……这里的减号意味着重心向右移动。明白了。）",
    speaker: 'player',
    next: 'l2_action'
  },
  {
    id: 'l2_action',
    text: "修正这个位移，调律师。接住那位迷路的老人。",
    speaker: 'photon',
    emotion: 'neutral',
    action: 'ENABLE_CONTROLS'
  }
];



export const HINT_LEVEL_2: DialogueNode[] = [
  {
    id: 'hint_l2',
    text: "只要左右移动。调整 'h' 即可。记住：h 是正数时，图像在右边。",
    speaker: 'photon',
    emotion: 'neutral'
  }
];
