import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_1_SCRIPT: DialogueNode[] = [
  {
    id: 's1_start',
    text: "侦测到以太波特征。是前代文明的遗迹。",
    speaker: 'system',
    next: 's1_captain_1'
  },
  {
    id: 's1_captain_1',
    text: "看这些漂浮的残骸……整个舰队都在这里。这片区域是‘线性坟场’。所有走直线的傻瓜都撞死了。",
    speaker: 'captain',
    emotion: 'sad',
    next: 's1_deer_1'
  },
  {
    id: 's1_deer_1',
    text: "前方 y=0 轴线拥堵率 100%。侧向机动模组离线。指挥官，我们被堵死了。",
    speaker: 'deer',
    emotion: 'worry',
    next: 's1_captain_2'
  },
  {
    id: 's1_captain_2',
    text: "能不能从下面钻过去？或者上面？",
    speaker: 'captain',
    next: 's1_deer_2'
  },
  {
    id: 's1_deer_2',
    text: "唯一的可行解是垂直维度的跃迁。我们需要计算‘势能常数 k’。请求接入思维殿堂。",
    speaker: 'deer',
    next: 's1_nav_1'
  },
  {
    id: 's1_nav_1',
    text: "（批准。正在解析垂直位移逻辑……）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE',
    next: 's1_resume_1'
  },
  {
    id: 's1_resume_1',
    text: "垂直通道已确认。上加下减。指挥官，把我们‘抬’起来。",
    speaker: 'deer',
    emotion: 'happy',
    next: 's1_tutorial'
  },
  {
    id: 's1_tutorial',
    text: "（任务目标：调整 k 值，使抛物线越过障碍物。）",
    speaker: 'system',
    action: 'ENABLE_CONTROLS',
    next: 's1_end'
  }
];
