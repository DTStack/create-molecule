import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { exit } from "process";

const content = `import React from 'react';
import { create, Workbench } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';

const moInstance = create({
    extensions: [],
});

const App = () => moInstance.render(<Workbench />);

export default App;`;

process.on("message", (msg: { cwd: string; typescript: boolean }) => {
  const cwd = msg.cwd;
  writeFileSync(
    join(cwd, "src", msg.typescript ? "App.tsx" : "App.js"),
    content
  );

  const indexFile = readFileSync(
    join(cwd, "src", msg.typescript ? "index.tsx" : "index.js"),
    "utf-8"
  );

  const nextFile = indexFile.replace(/React.StrictMode/g, "");

  writeFileSync(
    join(cwd, "src", msg.typescript ? "index.tsx" : "index.js"),
    nextFile
  );

  exit(1);
});
