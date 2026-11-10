import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const file = (path) => new URL("../" + path, import.meta.url);
const read = (path) => readFile(file(path), "utf8");
const categories = [
  { id: "1.2", name: "作业一 · 静电力与场强" },
  { id: "1.3", name: "作业二 · 高斯定理" },
  { id: "1.4", name: "作业三 · 电势" },
  { id: "2.1", name: "作业四 · 静电场中的导体" },
  { id: "2.3", name: "作业五 · 电介质" },
];
const rows = JSON.parse(await read("sources/questions.json"));
if (rows.length !== 19 || new Set(rows.map((row) => row.id)).size !== 19) {
  throw Error("题库应包含 19 个唯一题号");
}
const questions = await Promise.all(
  rows.map(async ({ id, page, figure, ...fields }) => {
    if (!/^\d\.\d-\d+$/.test(id)) throw Error("题号无效：" + id);
    const categoryId = id.split("-")[0];
    const category = categories.find(({ id }) => id === categoryId);
    if (!category || !page) throw Error("缺少题源：" + id);
    const solution = (await read("sources/solutions/" + id + ".md")).trim();
    for (const heading of ["已知与求解", "依据", "推导", "结果", "阅卷要点"]) {
      if (!solution.includes("### " + heading + "\n"))
        throw Error(id + " 缺少 " + heading);
    }
    if (
      /\\(?:mathbf|boldsymbol|bm)\b/.test(
        [
          solution,
          fields.prompt,
          fields.result,
          fields.judgment.correct,
          fields.judgment.incorrect,
          fields.judgment.reason,
        ].join("\n"),
      )
    ) {
      throw Error(id + " 的矢量书写需要使用上标箭头");
    }
    const paths = [...solution.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map(
      (m) => m[1],
    );
    for (const path of [
      ...paths.map((p) => p.replace(/^\.\.\/\.\.\/public\//, "")),
      ...(figure ? [figure] : []),
    ]) {
      if (
        !/^figures\/[\w.-]+\.svg$/.test(path) ||
        !basename(path).endsWith(".svg")
      ) {
        throw Error(id + " 仅能引用公开 SVG：" + path);
      }
      await access(file("public/" + path));
    }
    return {
      id,
      ...fields,
      categoryId,
      figure,
      source: {
        section: category.name,
        page: "教材第 " + page + " 页",
        identity: createHash("sha256")
          .update(id + "\n" + fields.prompt)
          .digest("hex"),
      },
      variants: [
        {
          id: "common",
          revision: 1,
          solution: solution.replaceAll("../../public/figures/", "./figures/"),
        },
      ],
    };
  }),
);
const bank = {
  bankVersion: 1,
  categories,
  rules: (await read("sources/rules.md")).trim(),
  questions,
};
await mkdir(file("src/data/"), { recursive: true });
await writeFile(
  file("src/data/bank.json"),
  JSON.stringify(bank, null, 2) + "\n",
);
