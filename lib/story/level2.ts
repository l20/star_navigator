import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_2_SCRIPT: DialogueNode[] = [
  {
    id: 's2_start',
    text: "警告。双星引力涉动。空间坐标系发生畸变。",
    speaker: 'system',
    next: 's2_captain_1'
  },
  {
    id: 's2_captain_1',
    text: "这鬼地方不对劲！目标在右边，我往右打舵，虽然推力出去了，但飞船拼命往左边偏！",
    speaker: 'captain',
    emotion: 'angry',
    next: 's2_deer_1'
  },
  {
    id: 's2_deer_1',
    text: "检测到‘镜像效应’。在这里，直觉是反的。您越想往右（正方向），数学规则就越把您推向左（负方向）。",
    speaker: 'deer',
    emotion: 'worry',
    next: 's2_captain_2'
  },
  {
    id: 's2_captain_2',
    text: "我不懂什么镜像！领航员，快接管导航！再这样下去我们要撞上那颗红巨星了！",
    speaker: 'captain',
    emotion: 'scared',
    next: 's2_nav_1'
  },
  {
    id: 's2_nav_1',
    text: "（冷静。这是水平位移的伪装。接入思维殿堂，修正相位。）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE',
    next: 's2_resume_1'
  },
  {
    id: 's2_resume_1',
    text: "相位修正完毕。记住口诀：左加右减。领航员，带我们去右边的安全区。",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's2_tutorial'
  },
  {
    id: 's2_tutorial',
    text: "（任务目标：调整 h 值。注意括号内的符号逻辑。）",
    speaker: 'system',
    action: 'ENABLE_CONTROLS',
    next: 's2_end'
  }
];
