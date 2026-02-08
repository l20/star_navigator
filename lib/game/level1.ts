import { DialogueNode } from '@/store/useDialogueStore';

// --- LEVEL 1: THE COLLAPSE (The Bridge) ---
export const LEVEL_1_SCRIPT: DialogueNode[] = [
  {
    id: 'intro_1',
    text: "（滋滋……系统重启中……）",
    speaker: 'system',
    emotion: 'neutral',
    next: 'intro_2',
  },
  {
    id: 'intro_2',
    text: "天哪，终于有人回应了！这里的物理法则完全崩塌了！",
    speaker: 'photon',
    emotion: 'scared',
    next: 'intro_3',
  },
  {
    id: 'intro_3',
    text: "我是光子 (Photon)，这个扇区的几何守护者。你看到了吗？所有的“曲率”都被抹平了！",
    speaker: 'photon',
    emotion: 'worry',
    next: 'intro_4',
  },
  {
    id: 'intro_4',
    text: "没有引力曲率，那个不知情的商人会被永远困在虚空里。我们需要手动重写宇宙常数。",
    speaker: 'photon',
    emotion: 'sad',
    next: 'tutorial_start',
  },
  {
    id: 'tutorial_start',
    text: "你面前的控制台连接着底层代码 'y = ax²'。看到那个 'a' 了吗？它是弯曲时空的钥匙。",
    speaker: 'photon',
    emotion: 'neutral',
    action: 'SHOW_FORMULA',
    next: 'tutorial_explain_a',
  },
  {
    id: 'tutorial_explain_a',
    text: "我们需要一个【负的曲率】来制造引力拱门（就像一座桥）。小心拖动它…… 别让宇宙撕裂了！",
    speaker: 'photon',
    emotion: 'happy',
    next: 'final_instruction',
  },
  {
    id: 'final_instruction',
    text: "看着那个【白色虚线蓝图】，那是原本的时空形状。让你的蓝线和它完全重合，物理引擎就会重启。",
    speaker: 'photon',
    emotion: 'neutral',
    action: 'ENABLE_CONTROLS',
  }
];

// --- LEVEL 2: THE VALLEY (The Ascent) ---
export const LEVEL_2_SCRIPT: DialogueNode[] = [
  {
    id: 'l2_intro_1',
    text: "成功了！引力场恢复稳定，商人安全通过了…… 等等。",
    speaker: 'photon',
    emotion: 'happy',
    next: 'l2_intro_2',
  },
  {
    id: 'l2_intro_2',
    text: "我们好像用力过猛，掉进了一个“概率深渊”。看这地形，是一个巨大的坑。",
    speaker: 'photon',
    emotion: 'surprised',
    next: 'l2_intro_3',
  },
  {
    id: 'l2_intro_3',
    text: "要想爬出去，我们需要反转引力方向。我们需要一个【正的曲率】来制造一个发射坡道。",
    speaker: 'photon',
    emotion: 'neutral',
    next: 'l2_instruction',
  },
  {
    id: 'l2_instruction',
    text: "把 'a' 变成正数！越大越好…… 实际上，只要对准那个U型的蓝图就行。准备好发射了吗？",
    speaker: 'photon',
    emotion: 'happy',
    action: 'ENABLE_CONTROLS',
  }
];

// --- HINT SCRIPTS ---
export const HINT_WRONG_DIRECTION: DialogueNode[] = [
  {
    id: 'hint_wrong_dir',
    text: "方向反了！这会制造反重力场，商人会飘到太空去的！调整符号方向！",
    speaker: 'photon',
    emotion: 'worry'
  }
];

export const HINT_TOO_STEEP: DialogueNode[] = [
  {
    id: 'hint_too_steep',
    text: "警告：奇点效应临近！这个坡度太陡了，普通物质承受不住。温柔一点，让曲线平缓些。",
    speaker: 'photon',
    emotion: 'scared'
  }
];

export const HINT_ALMOST_THERE: DialogueNode[] = [
  {
    id: 'hint_almost',
    text: "信号正在同步…… 就像对焦一样，再微调一点点……",
    speaker: 'photon',
    emotion: 'happy'
  }
];
