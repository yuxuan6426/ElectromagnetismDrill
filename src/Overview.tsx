import { stats, type State, type Config } from "./core";
import { streak } from "./StatsDetails";
const descriptions: Record<string, string> = {
  "1.2": "点电荷、线电荷、带电圆环与圆面。",
  "1.3": "电通量、球对称、柱对称与平面叠加。",
  "1.4": "静电力做功、分段电势与电势差。",
  "2.1": "导体屏蔽、接地和同轴传输线。",
  "2.3": "电位移、极化与电容。",
};
export function Overview({
  state,
  onStart,
  onResume,
  onBrowse,
}: {
  state: State;
  onStart: (config?: Partial<Config>) => void;
  onResume: () => void;
  onBrowse: () => void;
}) {
  const t = stats(state),
    resume = state.session && !state.session.finished;
  return (
    <>
      <div className="page-heading">
        <h1>电磁学考前训练</h1>
        <p>从场强、通量到电势与电容，练习规范列式和完整推导。</p>
        <div className="heading-meta">
          {state.bank.categories.length} 个模块 <span>/</span> {t.total} 道题
        </div>
      </div>
      <div className="start-actions">
        <button
          className="primary"
          onClick={() => (resume ? onResume() : onStart())}
        >
          {resume ? "继续练习" : "开始速刷"}
        </button>
        <button onClick={() => onStart({ mode: "paper" })}>纸笔默写</button>
      </div>
      <div className="metrics">
        {[
          ["已练习", t.seen],
          ["今日练习", t.today],
          [
            "正确率",
            t.attempts ? Math.round((t.correct / t.attempts) * 100) + "%" : "—",
          ],
          ["已掌握", t.mastered],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <h2>按模块巩固</h2>
        <button className="text-button" onClick={onBrowse}>
          浏览全部题目
        </button>
      </div>
      <div className="directory">
        {state.bank.categories.map((c) => {
          const summary = stats(state, c.id);
          return (
            <details className="directory-group" key={c.id}>
              <summary>
                <span className="group-title">
                  <span>{c.name}</span>
                  <small>{descriptions[c.id] || c.name}</small>
                </span>
                <span className="group-count">{summary.total} 题</span>
              </summary>
              <div className="group-body">
                <p>
                  已练习 {summary.seen} 题 · 已掌握 {summary.mastered} 题 ·
                  待复习 {summary.due} 题
                </p>
                <div className="actions">
                  <button
                    className="primary"
                    onClick={() =>
                      onStart({ category: c.id, tag: "", filter: "all" })
                    }
                  >
                    练习本模块
                  </button>
                  <button
                    onClick={() =>
                      onStart({
                        category: c.id,
                        tag: "",
                        filter: "all",
                        mode: "paper",
                      })
                    }
                  >
                    本模块默写
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </div>
      <div className="study-summary">
        <span>连续练习 {streak(state)} 天</span>
        <button
          className="text-button"
          onClick={() => onStart({ filter: "wrong", category: "", tag: "" })}
        >
          错题 {t.wrong} 道
        </button>
        <button
          className="text-button"
          onClick={() => onStart({ filter: "due", category: "", tag: "" })}
        >
          待复习 {t.due} 道
        </button>
      </div>
    </>
  );
}
