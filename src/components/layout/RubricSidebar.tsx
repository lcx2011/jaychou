export default function RubricSidebar() {
  return (
    <div className="h-full bg-slate-100 overflow-y-auto p-6 lg:p-10 text-slate-800">
      <div className="max-w-3xl mx-auto pb-20">
        <h1 className="text-3xl lg:text-4xl font-black mb-8 text-slate-800 border-b-4 border-slate-300 pb-4 inline-block">
          📖 周杰伦歌曲评分细则
        </h1>

        {/* Section 1: Dimensions & Weights */}
        <Section title="一" heading="核心维度与权重">
          <table className="rubric-table">
            <thead>
              <tr><th>维度</th><th>权重</th><th>核心考察点</th></tr>
            </thead>
            <tbody>
              <tr><td className="font-bold">旋律</td><td>30%</td><td>悦耳度、记忆点、创新性、流畅度</td></tr>
              <tr><td className="font-bold">编曲</td><td>25%</td><td>层次丰富度、结构巧思、音色采样、动态把控</td></tr>
              <tr><td className="font-bold">歌词</td><td>20%</td><td>与旋律咬合度、主题画面感、金句、深度</td></tr>
              <tr><td className="font-bold">演唱</td><td>15%</td><td>情绪角色代入、唱腔匹配度、技术完成度</td></tr>
              <tr><td className="font-bold">创新</td><td>10%</td><td>开宗立派性、实验突破性、里程碑意义</td></tr>
            </tbody>
          </table>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg text-lg text-slate-700 font-bold mt-4 shadow-sm">
            总分公式：总分 = 旋律×0.3 + 编曲×0.25 + 歌词×0.2 + 演唱×0.15 + 创新×0.1<br/>
            <span className="text-base text-slate-500 font-normal">（每项0-100分，总分0-100分）</span>
          </div>
        </Section>

        {/* Section 2: Dimension Rubrics */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg shrink-0">二</span>
            各维度评分细则
          </h2>

          <DimensionCard
            title="1. 旋律（权重30%）"
            colorClass="text-amber-600"
            borderClass="border-amber-100"
            points={['悦耳与流畅度：听着顺不顺，有无生硬转折', '记忆点与金句：能否瞬间记住副歌，有无传世旋律', '旋律走向的创新：是否用离调、半音、复杂切分等高级技法', '节奏与律动：说唱的flow变化、节奏惊喜（快歌尤其重要）', '与人声/编曲的融合度：旋律是独立好听还是与伴奏融为一体']}
            anchors={[
              { tier: 'S', range: '95-100', text: '全曲无尿点，主副歌均为顶级旋律，有穿越时间的魅力' },
              { tier: 'A', range: '85-94', text: '非常好听，有明显记忆点，但未达"神级"' },
              { tier: 'B', range: '75-84', text: '好听但行活感强，或有好段落但有较平部分' },
              { tier: 'C', range: '60-74', text: '平淡，听完记不住，或局部生硬' },
              { tier: 'D', range: '60以下', text: '旋律有硬伤，听着别扭（周董歌曲极少至此）' },
            ]}
            refSongs={{ S: '《夜曲》《七里香》《青花瓷》', A: '《爱在西元前》《简单爱》', B: '《浪漫手机》' }}
          />

          <DimensionCard
            title="2. 编曲（权重25%）"
            colorClass="text-blue-600"
            borderClass="border-blue-100"
            points={['乐器层次与丰富度：能听到多少种乐器/音色，是否单薄', '结构巧思：前奏/间奏/尾奏是否精彩，段落有无意外桥段', '音色与采样创意：有无独特性声音设计（打字机、乒乓球等）', '动态与留白：懂得收放，安静段落氛围营造', '与歌曲主题的契合度：编曲是否准确传达歌曲情绪']}
            anchors={[
              { tier: 'S', range: '95-100', text: '华语天花板级，层次丰富、有神来之笔的采样或结构' },
              { tier: 'A', range: '85-94', text: '精良丰富，有明显亮点' },
              { tier: 'B', range: '75-84', text: '合格行活，该有的都有但无惊喜' },
              { tier: 'C', range: '60-74', text: '编曲单薄或与歌曲不搭' },
              { tier: 'D', range: '60以下', text: '粗糙、廉价感' },
            ]}
            refSongs={{ S: '《夜的第六章》《以父之名》《双截棍》', A: '《七里香》《晴天》', B: '《告白气球》' }}
          />

          <DimensionCard
            title="3. 歌词（权重20%）"
            colorClass="text-emerald-600"
            borderClass="border-emerald-100"
            points={['与旋律的咬合度：歌词音节是否贴合唱腔，唱起来顺', '主题与画面感：是否瞬间将你拉入场景', '金句与独创性：有无出圈名句，或发明新说法', '逻辑与深度：叙事是否清晰，立意有无深度']}
            extra={
              <div className="bg-emerald-50 p-3 rounded-lg mb-6 text-emerald-800 border border-emerald-200 text-lg">
                <strong>快歌/舞曲特别处理：</strong>将"逻辑与深度"权重降低，重点考察"节奏咬合度"与"气势氛围"。
              </div>
            }
            anchors={[
              { tier: 'S', range: '95-100', text: '诞生传世金句，咬合天衣无缝，主题深远或画面极强' },
              { tier: 'A', range: '85-94', text: '有金句或极强画面感，咬合度好' },
              { tier: 'B', range: '75-84', text: '合格叙事，通顺无硬伤' },
              { tier: 'C', range: '60-74', text: '词语堆砌无逻辑，或严重拉低歌曲意境' },
              { tier: 'D', range: '60以下', text: '不知所云' },
            ]}
            refSongs={{ S: '《青花瓷》（天青色等烟雨）、《梯田》（人文反思）', A: '《东风破》《上海一九四三》', B: '《听妈妈的话》' }}
          />

          <DimensionCard
            title="4. 演唱（权重15%）"
            colorClass="text-purple-600"
            borderClass="border-purple-100"
            points={['情绪与角色代入：声音是否演对角色、传递正确情绪', '与歌曲核心的匹配度：嗓音状态、唱腔是否为这首歌加分', '技术完成度：气息、真假声转换、标志性即兴（ad-libs）', '咬字处理：清晰度是否影响听感（需结合歌曲风格判断）']}
            anchors={[
              { tier: 'S', range: '95-100', text: '人声与歌曲天人合一，角色感极强，技术无可挑剔' },
              { tier: 'A', range: '85-94', text: '情绪到位，有亮点唱段' },
              { tier: 'B', range: '75-84', text: '正常发挥，无加分也无扣分' },
              { tier: 'C', range: '60-74', text: '咬字严重影响听感，或嗓音状态明显不佳' },
              { tier: 'D', range: '60以下', text: '演唱有硬伤' },
            ]}
            refSongs={{ S: '《最长的电影》《双截棍》', A: '《简单爱》《发如雪》', B: '多数中规中矩的演唱' }}
          />

          <DimensionCard
            title="5. 创新与历史地位（权重10%）"
            colorClass="text-rose-600"
            borderClass="border-rose-100"
            points={['开宗立派：是否创立了某种新风潮、新范式', '专辑实验性：是否在专辑中挑战不常见曲风或结构', '里程碑意义：是否为职业生涯分水岭、概念专辑核心曲目', '后续影响力：是否影响后来者创作方向']}
            extra={
              <div className="bg-rose-50 p-3 rounded-lg mb-6 text-rose-800 border border-rose-200 text-lg">
                <strong>关键提醒：</strong>必须结合发行年份审视，不能以后来标准苛求早期作品。
              </div>
            }
            anchors={[
              { tier: 'S', range: '95-100', text: '开创新风格流派，划时代意义' },
              { tier: 'A', range: '85-94', text: '在既定风格上有重大突破，或专辑实验核心' },
              { tier: 'B', range: '75-84', text: '有尝试新东西，但不算突破性' },
              { tier: 'C', range: '60-74', text: '套路化创作，无明显新意' },
              { tier: 'D', range: '60以下', text: '倒退或敷衍之作' },
            ]}
            refSongs={{ S: '《双截棍》《东风破》《以父之名》', A: '《夜的第七章》《乱舞春秋》', B: '多数常规曲风延续' }}
          />
        </div>

        {/* Section 3: Scoring Process */}
        <Section title="三" heading="打分操作流程">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-lg text-slate-700 leading-loose">
            <p className="font-bold text-xl text-amber-600 mb-4 pb-2 border-b border-amber-100">原则：先定档，再微调；直觉为主，细则为辅。</p>
            <ol className="list-decimal pl-6 space-y-4">
              <li><strong>完整听一遍歌曲</strong>，不看手机，不做其他事。</li>
              <li><strong>凭直觉定档</strong>（S/A/B/C/D），五个维度分别判断：
                <ul className="list-[circle] pl-6 mt-2 text-slate-500">
                  <li>这个旋律是S档还是A档？</li>
                  <li>这个编曲是S档还是A档？</li>
                  <li>…如此类推</li>
                </ul>
              </li>
              <li><strong>在档位分值区间内给具体分</strong>（取整数即可，如88、92）：
                <ul className="list-[circle] pl-6 mt-2 text-slate-500 grid grid-cols-2 gap-x-4">
                  <li>S档：95-100之间凭感觉取整</li>
                  <li>A档：85-94之间凭感觉取整</li>
                  <li>B档：75-84之间凭感觉取整</li>
                  <li>C档：60-74之间凭感觉取整</li>
                  <li>D档：60以下随意</li>
                </ul>
              </li>
              <li><strong>遇到纠结时</strong>，拉出对应维度的"考察要点"，逐一诊断扣分/加分项，然后给分。</li>
              <li><strong>填写备注</strong>（必须！），在对应关键词栏记下：
                <ul className="list-[circle] pl-6 mt-2 text-slate-500">
                  <li>为什么给高分（如：前奏杀、离调惊艳、打字机采样）</li>
                  <li>为什么扣分（如：副歌平淡、编曲单薄、歌词堆砌）</li>
                  <li className="text-amber-600 font-bold">这是你将来回顾、调整、与人讨论的底气。</li>
                </ul>
              </li>
              <li><strong>全专辑打完后，按总分排序</strong>，检查榜单：
                <ul className="list-[circle] pl-6 mt-2 text-slate-500">
                  <li>有没有直觉上"不配在这个位置"的歌？有就回去微调五维分。</li>
                  <li>同级档的歌分数差距是否合理？</li>
                </ul>
              </li>
            </ol>
          </div>
        </Section>

        {/* Section 4: Calibration */}
        <Section title="四" heading="评分校准系统">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-lg font-bold text-slate-700 mb-4">先给以下锚点歌强制打分，作为你的评分标尺：</p>
            <table className="rubric-table mb-6">
              <thead>
                <tr><th>刻度等级</th><th>代表歌曲</th><th>参考总分区间</th></tr>
              </thead>
              <tbody>
                <tr><td className="font-black text-purple-600">S 神作</td><td className="text-lg">《以父之名》《夜的第七章》《青花瓷》</td><td className="font-bold">95-100</td></tr>
                <tr><td className="font-black text-red-500">A+ 准神</td><td className="text-lg">《夜曲》《七里香》《双截棍》</td><td className="font-bold">90-94</td></tr>
                <tr><td className="font-black text-red-500">A 优质</td><td className="text-lg">《爱在西元前》《晴天》《一路向北》</td><td className="font-bold">85-89</td></tr>
                <tr><td className="font-black text-amber-500">B 良好</td><td className="text-lg">《浪漫手机》《听妈妈的话》</td><td className="font-bold">75-84</td></tr>
                <tr><td className="font-black text-green-500">C 及格</td><td className="text-lg">《英雄》（游戏曲）</td><td className="font-bold">60-74</td></tr>
              </tbody>
            </table>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-lg text-slate-700">
              <strong>使用方法：</strong><br/>
              每次打分前，先回想锚点歌的分数。评新歌时问自己："它的旋律比《爱在西元前》好还是差？" 这能防止分数膨胀或尺度漂移。
            </div>
          </div>
        </Section>

        <div className="text-center text-slate-400 text-sm mt-12 border-t border-slate-300 pt-8">
          （原文中的"五、评分表示例"已转化为实际打分操作面板）
        </div>
      </div>
    </div>
  );
}

function Section({ title, heading, children }: { title: string; heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg shrink-0">{title}</span>
        {heading}
      </h2>
      {children}
    </div>
  );
}

interface AnchorItem { tier: string; range: string; text: string; }

function DimensionCard({ title, colorClass, borderClass, points, anchors, refSongs, extra }: {
  title: string;
  colorClass: string;
  borderClass: string;
  points: string[];
  anchors: AnchorItem[];
  refSongs: Record<string, string>;
  extra?: React.ReactNode;
}) {
  const tierColorMap: Record<string, string> = {
    S: 'text-purple-600', A: 'text-red-500', B: 'text-amber-500', C: 'text-green-500', D: 'text-slate-500',
  };

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 mb-8 shadow-sm border border-slate-200">
      <h3 className={`text-xl lg:text-2xl font-black ${colorClass} mb-6 border-b ${borderClass} pb-3`}>{title}</h3>

      <h4 className="text-lg font-bold text-slate-700 mb-3 bg-slate-100 inline-block px-3 py-1 rounded">考察要点：</h4>
      <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6 text-lg">
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>

      {extra}

      <h4 className="text-lg font-bold text-slate-700 mb-3 bg-slate-100 inline-block px-3 py-1 rounded">定档锚点：</h4>
      <table className="rubric-table mb-6">
        <thead>
          <tr><th className="w-20">档位</th><th className="w-28">分值区间</th><th>判断标准</th></tr>
        </thead>
        <tbody>
          {anchors.map(a => (
            <tr key={a.tier}>
              <td className={`font-black ${tierColorMap[a.tier] || ''}`}>{a.tier}</td>
              <td>{a.range}</td>
              <td>{a.text}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-base font-bold text-slate-700 mb-2">参考锚点歌：</h4>
        <ul className="text-slate-600 space-y-1 text-lg">
          {Object.entries(refSongs).map(([tier, songs]) => (
            <li key={tier}>
              <span className={`font-bold ${tierColorMap[tier] || ''}`}>{tier}级：</span>
              {songs}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
