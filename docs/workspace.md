# 题源与维护 / Sources and maintenance

题源为赵凯华、陈熙谋《电磁学》（第四版，高等教育出版社）。题面以教材对应印刷页为准。本站整理独立推导、校对结果并自绘示意图。图形中的归一化示例注明所取条件。

| 作业 | 教材节 | 印刷页 |
| --- | --- | --- |
| 一 | §1.2 | 25–26 |
| 二 | §1.3 | 39–40 |
| 三 | §1.4 | 53–55 |
| 四 | §2.1 | 84、88 |
| 五 | §2.3 | 115–117 |

1.4-16 引用 P39 的习题 1.3-3（两个同心球面）。1.2-11 在解答中分别定义距正线的坐标和相对中垂面的坐标。2.1-4 与 2.1-7 按 P84 思考题题意整理。

1. 更新 [题面、检查项与题源](../sources/questions.json) 和对应的 [逐题解答](../sources/solutions/)。
2. 示意图及曲线在 [作图脚本](../scripts/figures.mjs) 中维护。使用 `npm run figures` 生成 SVG。
3. 运行 `npm run bank` 更新应用题库，再执行 `npm run lint`、`npm test` 和 `npm run build`。
4. [Pages 工作流](../.github/workflows/pages.yml) 检查生成文件一致性，再部署静态构建结果。

For English-speaking contributors: edit the bank source and the matching Markdown solution, regenerate figures if needed, rebuild the bank, then lint, test and build. Original textbook materials are kept in a local study archive. The exercise prompts are paraphrased and the illustrations are redrawn.

应用与学习流程以 [MechanicsDrill 的 e2d446c 提交](https://github.com/yuxuan6426/MechanicsDrill/tree/0f70012ae46b26b93cebc6cb4ea82fcef64ece64) 为基线，保留上游许可署名。
