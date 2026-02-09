import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_0_SCRIPT: DialogueNode[] = [
  {
    id: 's0_start',
    text: "警报！引力波雷达红区。检测到未知奇点捕获。老林（林舰长）的生命体征极其微弱，休眠舱正处于临界状态！",
    speaker: 'deer',
    emotion: 'scared',
    next: 's0_deer_intro'
  },
  {
    id: 's0_deer_intro',
    text: "领航员（ID: 9527），现在的你就是这艘船的唯一大脑。推进器线性出力已经失效（y = kx + b），我们正在坠向视界！",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's0_deer_1'
  },
  {
    id: 's0_deer_1',
    text: "必须升维！我们需要构建“二次型动力场”来对抗引力。快，进入神经链接，我来教你构建数学模型。",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's0_nav_1'
  },
  {
    id: 's0_nav_1',
    text: "（收到。正在接入火控系统……思维殿堂启动。）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE', // Triggers the educational overlay
    next: 's0_resume_1'
  },
  {
    id: 's0_resume_1',
    text: "模型构建完毕。反重力场已就绪。领航员，请尝试调整开口率 a，制造向上的升力！小心，a 过大会导致过载。",
    speaker: 'deer',
    emotion: 'happy',
    next: 's0_system_alert'
  },
  {
    id: 's0_system_alert',
    text: "警告：休眠舱能量下降。请尽快稳定船体姿态，否则林舰长将无法苏醒。",
    speaker: 'system',
    next: 's0_tutorial'
  },
  {
    id: 's0_tutorial',
    text: "（任务目标：调整参数 a，使抛物线支撑起下坠的船体。建议尝试 a = 0.005）",
    speaker: 'system',
    action: 'ENABLE_CONTROLS',
    next: 's0_end'
  }
];
