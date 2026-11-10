import { rolldown } from "rolldown";
import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
import path from "path";

const settings = ["esm", "iife"];

const execRolldown = async function (file, setting) {
  const ppp = {
    input: file,
    output: {
      sourcemap: false,
      format: setting,
      minify: true,
      file: `dist/${file.replace("src/", "").replace(".js", setting === "esm" ? ".esm.min.js" : ".iife.min.js")}`,
    },
  };

  if (setting === "iife") {
    ppp.output.name = "FormValidator";
  }

  mkdirSync(path.dirname(ppp.output.file), { recursive: true });

  const bundle = await rolldown(ppp);
  await bundle.write(ppp.output);
  // Get a copy in the docs
  copyFileSync(ppp.output.file, `docs/${ppp.output.file}`);
};

const collectJs = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJs(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
};

const filesRc = collectJs("src").filter(
  (file) => !file.endsWith("defaults.js") && !file.endsWith("utils.js"),
);
await Promise.all(
  filesRc.flatMap((file) => settings.map((setting) => execRolldown(file, setting))),
);

// Also build j-formally (needs punycode bundled)
await Promise.all(settings.map((setting) => execRolldown("src/j-formally.js", setting)));
