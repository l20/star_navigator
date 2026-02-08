import { DialogueNode } from '@/store/useDialogueStore';

export const LEVEL_3_SCRIPT: DialogueNode[] = [
  {
    id: 'l3_player_1',
    text: "这是……坍缩的中心？所有数据都在乱动。",
    speaker: 'player',
    next: 'l3_photon_1'
  },
  {
    id: 'l3_photon_1',
    text: "是的，调律师。这里是最后的挑战。所有的常数都在疯狂跳动。",
    speaker: 'photon',
    emotion: 'worry',
    next: 'l3_merchant_1'
  },
  {
    id: 'l3_merchant_1',
    text: "如果你能搞定这个，调律师，我答应你把你所有的‘数学日志’都带回文明世界！",
    speaker: 'merchant',
    emotion: 'surprised',
    next: 'l3_player_2'
  },
  {
    id: 'l3_player_2',
    text: "（a, h, k... 整个顶点式都在我手中。这是最终的校准。）",
    speaker: 'player',
    next: 'l3_photon_3'
  },
  {
    id: 'l3_photon_3',
    text: "找到那个‘顶点’ (h, k)，调律师。去吧，完成最后一次调律，数学的光辉将重新定义这个世界。",
    speaker: 'photon',
    emotion: 'happy',
    action: 'ENABLE_CONTROLS'
  }
];


