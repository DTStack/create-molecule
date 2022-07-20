import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { exit } from "process";

process.on("message", (msg: any) => {
  const cwd = msg.cwd;
  writeFileSync(join(cwd, "src", "App.js"), content);

  const indexFile = readFileSync(join(cwd, "src", "index.js"), "utf-8");

  const nextFile = indexFile.replace(/React.StrictMode/g, "");

  writeFileSync(join(cwd, "src", "index.js"), nextFile);

  exit(1);
});

const content = `import React from 'react';
import { create, Workbench } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';

const moInstance = create({
    extensions: [],
});

const App = () => moInstance.render(<Workbench />);

export default App;`;
