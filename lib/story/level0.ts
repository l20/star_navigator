import { DialogueNode } from '@/store/useDialogueStore';

export const STORY_LEVEL_0_SCRIPT: DialogueNode[] = [
  {
    id: 's0_start',
    text: "喂！那个新来的调试员，听得到吗？系统全红了，快帮我看一眼仪表盘！",
    speaker: 'captain',
    emotion: 'scared',
    next: 's0_deer_intro'
  },
  {
    id: 's0_deer_intro',
    text: "检测到驾驶员情绪不稳定。已接管辅助系统。调试员，请看大屏幕，我们需要手动修正星轨参数。",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's0_captain_1'
  },
  {
    id: 's0_captain_1',
    text: "推进器即使开到最大，读数还在往下掉！我们在坠落！小鹿，计算线性逃逸路径！",
    speaker: 'captain',
    emotion: 'scared',
    next: 's0_deer_1'
  },
  {
    id: 's0_deer_1',
    text: "线性路径（y = kx + b）逃逸率 0%。必须升维。指挥官，进入思维殿堂，我们需要构建“二次动力学模型”。",
    speaker: 'deer',
    emotion: 'neutral',
    next: 's0_nav_1'
  },
  {
    id: 's0_nav_1',
    text: "（收到。正在建立神经链接……思维殿堂启动。）",
    speaker: 'navigator',
    action: 'OPEN_MIND_PALACE', // Triggers the educational overlay
    next: 's0_resume_1'
  },
  // The game pauses here until Mind Palace is resolved.
  // When resumed, we jump to next node? Or does the overlay callback handle it?
  // Let's assume the callback will advance() the dialogue or we manually trigger next.
  // Actually, 'action' will be handled, and 'next' is 's0_resume_1'.
  // But we want to PAUSE the dialogue *after* this line is shown, OR show the overlay *over* it.
  // If we show overlay, we might want to wait for it to close before showing next line.
  // Strategy: The overlay closing triggers `advance()`.

  {
    id: 's0_resume_1',
    text: "模型构建完毕。反重力场已就绪。指挥官，请注入参数 a = 5。",
    speaker: 'deer',
    emotion: 'happy',
    next: 's0_captain_3'
  },
  {
    id: 's0_captain_3',
    text: "虽然不知道你们在搞什么鬼，但我也感觉到了……船身变轻了？",
    speaker: 'captain',
    emotion: 'surprised',
    next: 's0_tutorial'
  },
  {
    id: 's0_tutorial',
    text: "（任务目标：将抛物线开口向上并收窄。设置 a = 0.005）", // Note: existing game logic uses small floats for a, despite script saying 5. We need to align mental model or scale.
    // Script said "a=5", but game engine uses 0.005.
    // Let's adjust text to be realistic to game or adjust game scale. 
    // Game scale 0.005 is "strong" enough visually. 
    // Let's keep game logic for now and say "Set a to match the guide".
    speaker: 'system',
    action: 'ENABLE_CONTROLS',
    next: 's0_end'
  }
];
