import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_3_SCRIPT: DialogueNode[] = [
  {
    id: 's3_start',
    text: "前方高能反应。虫洞‘阿特拉斯’正在坍缩。",
    speaker: 'system',
    next: 's3_captain_1'
  },
  {
    id: 's3_captain_1',
    text: "就是那里……新家园的大门。但我手在抖……这通道太窄了，比针眼还细。",
    speaker: 'captain',
    emotion: 'worry',
    next: 's3_deer_1'
  },
  {
    id: 's3_deer_1',
    text: "计算结果：绝望。飞船当前质量过大，惯性半径无法适应如此高曲率的轨道。强行穿越会导致解体。",
    speaker: 'deer',
    emotion: 'sad',
    next: 's3_captain_2'
  },
  {
    id: 's3_captain_2',
    text: "减重呢？抛弃所有货物！",
    speaker: 'captain',
    next: 's3_deer_2'
  },
  {
    id: 's3_deer_2',
    text: "不够。除非……抛弃主引擎舱。但这需要有人手动在后方操作分离程序。",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's3_silence'
  },
  {
    id: 's3_silence',
    text: "...... (死一般的寂静)",
    speaker: 'system',
    next: 's3_captain_3'
  },
  {
    id: 's3_captain_3',
    text: "把‘火种’转移到应急舱。那里面有我们的未来。而且……应急舱很轻，对吧？",
    speaker: 'captain',
    emotion: 'happy',
    next: 's3_deer_3'
  },
  {
    id: 's3_deer_3',
    text: "大叔，你在说什么？分离程序可以远程——",
    speaker: 'deer',
    emotion: 'surprised',
    next: 's3_captain_4'
  },
  {
    id: 's3_captain_4',
    text: "远程链路坏了（说谎）。必须有人留下。指挥官，听好了。这是最后一道题。",
    speaker: 'captain',
    emotion: 'neutral',
    next: 's3_nav_1'
  },
  {
    id: 's3_nav_1',
    text: "（老林……你锁定了舱门？等等，如果质量减半，我们需要一个极窄的抛物线……）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE', // Triggers the "Final Exam"
    next: 's3_resume_1'
  },
  {
    id: 's3_resume_1',
    text: "参数确认：a = 10。极其陡峭的孤独曲线。大叔，不要……",
    speaker: 'deer',
    emotion: 'sad', // Crying logic needs visual support
    next: 's3_captain_5'
  },
  {
    id: 's3_captain_5',
    text: "别哭。数学是最美的语言。指挥官，按下执行键吧。带我们回家。",
    speaker: 'captain',
    emotion: 'happy',
    next: 's3_action'
  },
  {
    id: 's3_action',
    text: "（任务目标：将 a 设置为 10，完成最后的发射。）",
    speaker: 'system',
    action: 'SACRIFICE_MODE', // Special logic to allow high 'a' and trigger cinematic
    next: 's3_end'
  }
];

// Alternate script for failure? Handled by generic failure logic or overlays.
