import { ReactNode } from 'react';
import MathFormula from '@/components/ui/MathFormula';

export interface QuizQuestion {
  question: ReactNode;
  options: ReactNode[];
  correctIndex: number;
  explanation?: ReactNode; // Shown after correct answer
  hint?: ReactNode; // Shown after hesitation
  wrongFeedback?: Record<number, ReactNode>; // Specific feedback for wrong answers
}

export interface KnowledgeEntry {
  title: string;
  concept: ReactNode;
  body: ReactNode;
  quiz?: QuizQuestion; // New Field
  completionShoutout?: {
    photon: string;
    merchant: string;
    player?: string;
  };
}

// Math Concepts Database
// Ref: https://zh.wikipedia.org/wiki/%E4%BA%8C%E6%AC%A1%E5%87%BD%E6%95%B0
export const KNOWLEDGE_DB: Record<number, KnowledgeEntry> = {
  0: {
    title: "定义 (Definition)",
    concept: <MathFormula tex="f(x) = ax^2" block />,
    body: (
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
        <p>
          在代数中，这是<b>最简二次函数</b>。
          系数 <MathFormula tex="a" /> 控制了开口方向和宽度。
        </p>
        <div className="bg-slate-900/50 p-3 border-l-2 border-cyan-500 font-mono text-xs text-cyan-300/80">
          {'>>'} PROPERTIES_LOG:
          <br />
          • <MathFormula tex="a > 0" />: 向上 (Valley) <MathFormula tex="\cup" />
          <br />
          • <MathFormula tex="a < 0" />: 向下 (Arch) <MathFormula tex="\cap" />
        </div>
      </div>
    ),
    quiz: {
      question: <span>现在的引力读数极大。我们需要一个<b>强力的、向上的</b>反引力场。请选择正确的参数：</span>,
      options: [
        <span key="1"><MathFormula tex="a = 0" /> (无效，维持直线)</span>,
        <span key="2"><MathFormula tex="a = -5" /> (开口向下，加速坠毁)</span>,
        <span key="3"><MathFormula tex="a = 0.1" /> (开口向上，但太宽)</span>,
        <span key="4"><MathFormula tex="a = 5" /> (开口向上，且窄，力量集中)</span>
      ],
      correctIndex: 3,
      explanation: "a > 0 确保方向向上，绝对值较大确保了更强的‘弯曲’力量。",
      hint: "我们需要抵抗黑洞的向下拉力，所以必须向上。且引力极大，需要更‘陡峭’的曲线。",
      wrongFeedback: {
        0: "a=0 意味着这是直线。直线无法对抗黑洞。",
        1: "负数意味着开口向下，这会让我们加速撞进黑洞！",
        2: "方向对了，但力量太弱（开口太宽）。我们会被吸进去的。"
      }
    },
    completionShoutout: {
      photon: "反重力场启动。参数 a 锁定。",
      merchant: "我的天……那是什么力量？就像有一只手把我们提了起来！",
      player: "（a = 5... 线性坍缩已被初步抑制。第一步完成了。）"
    }
  },
  1: {
    title: "垂直位移 (Vertical Shift)",
    concept: <MathFormula tex="y = ax^2 + k" block />,
    body: (
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
        <p>常数 <MathFormula tex="k" /> 控制抛物线的<b>上下移动</b>。</p>
        <div className="bg-slate-900/50 p-3 border-l-2 border-cyan-500 font-mono text-xs text-cyan-300/80">
          {'>>'} RULE_SET: <MathFormula tex="k > 0" /> 向上，<MathFormula tex="k < 0" /> 向下。
        </div>
      </div>
    ),
    quiz: {
      question: <span>为了飞越高度为 200 的残骸带，我们需要将轨道向上抬升。表达式应调整为：</span>,
      options: [
        <MathFormula tex="y = x^2 - 200" />,
        <MathFormula tex="y = (x-200)^2" />,
        <MathFormula tex="y = x^2 + 250" />,
        <MathFormula tex="y = 200x^2" />
      ],
      correctIndex: 2,
      explanation: "根据‘上加下减’，向上平移需要在函数末尾加上常数 k。",
      hint: "向上意味着 y 值增加。是在括号里加，还是在外面加？",
      wrongFeedback: {
        0: "减号代表向下钻地。我们要飞过去！",
        1: "括号里的改动是左右移动。我们不需要左右绕路，直接飞跃它。",
      }
    },
    completionShoutout: {
      photon: "垂直通道已确认。上加下减。",
      merchant: "我们……在残骸的头顶？不可思议。",
      player: "（垂直位移校准完毕。k 值的引入让结构获得了垂直维度的支撑。）"
    }
  },
  2: {
    title: "水平位移 (Horizontal Shift)",
    concept: <MathFormula tex="y = a(x-h)^2" block />,
    body: (
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
        <p>左右平移遵循<b>左加右减</b>的规则。</p>
        <div className="bg-slate-900/50 p-3 border-l-2 border-cyan-500 font-mono text-xs text-cyan-300/80">
          {'>>'} NAVIGATION_NOTE: 左加右减 (Inverted Logic)
        </div>
      </div>
    ),
    quiz: {
      question: <span>为了去右侧 (x=5) 的安全区，我们需要：</span>,
      options: [
        <MathFormula tex="y = (x+5)^2" />,
        <MathFormula tex="y = (x-5)^2" />,
        <MathFormula tex="y = x^2 + 5" />,
        <MathFormula tex="y = x^2 - 5" />
      ],
      correctIndex: 1,
      explanation: "要使顶点在 x=5，括号内需为 (x-5)。记住口诀：左加右减。",
      hint: "你要去右边（正方向），在括号的世界里，符号要是相反的。",
      wrongFeedback: {
        0: "加号意味着向左移（负方向）。那样我们会撞上红巨星！",
      }
    },
    completionShoutout: {
      photon: "相位修正完毕。直觉会欺骗你，但数学不会。",
      merchant: "我不懂什么镜像，但我们确实去右边了！",
      player: "（镜像世界并不是混乱，它只是有着不同的逻辑规则。）"
    }
  },
  3: {
    title: "顶点式综合 (Combined)",
    concept: <MathFormula tex="y = a(x-h)^2 + k" block />,
    body: (
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
        <p>最后的挑战。综合调整所有参数。</p>
        <div className="bg-slate-900/50 p-3 border-l-2 border-cyan-500 font-mono text-xs text-cyan-300/80">
          {'>>'} FINAL_CHECK: (h, k) 为顶点 Vertex
        </div>
      </div>
    ),
    quiz: {
      question: <span>目标：穿过虫洞中心 (5, 3)。要求轨道极窄 (a=10)。请构建方程：</span>,
      options: [
        <MathFormula tex="y = 10(x+5)^2 + 3" />,
        <MathFormula tex="y = 10(x-5)^2 + 3" />,
        <MathFormula tex="y = 0.5(x-5)^2 + 3" />,
        <MathFormula tex="y = 10(x-5)^2 - 3" />
      ],
      correctIndex: 1,
      explanation: "顶点 (5, 3) 对应 (x-5) 和 +3。极窄轨道对应 a=10。",
      hint: "首先定顶点 (h, k)，然后确认开口大小 a。",
      wrongFeedback: {
        2: "a=0.5 轨道太宽了！我们需要极其陡峭的曲线来穿过针孔。",
      }
    },
    completionShoutout: {
      photon: "参数确认：a = 10。极其陡峭的孤独曲线。",
      merchant: "别哭。数学是最美的语言。指挥官，按下执行键吧。",
      player: "（解析式：y = 10(x-5)² + 3。确认执行。）"
    }
  }
};
