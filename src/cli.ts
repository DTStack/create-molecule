import { execSync, fork } from "child_process";
import * as chalk from "chalk";
import { program } from "commander";
import { join, resolve } from "path";

let projectName = "";

function init() {
  program
    .command("create-molecule")
    .arguments("<project-directory>")
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv);

  execSync(`pnpm create react-app ${projectName}`, {
    stdio: "inherit",
  });

  const projectPath = resolve(projectName);
  execSync("pnpm add @dtinsight/molecule@latest", {
    cwd: projectPath,
    stdio: "inherit",
  });

  const forked = fork(join(__dirname, "file.js"));
  forked.send({ cwd: projectPath });

  console.log(
    `${chalk.greenBright(
      "Success"
    )}! Created ${projectName} at ${projectPath} by create-react-app`
  );
  console.log("We rewrite several files:");
  console.log("");
  console.log(` * ${join(projectPath, "src", "App.js")} ${chalk.cyan("and")}`);
  console.log(` * ${join(projectPath, "src", "index.js")}.`);
  console.log("");

  console.log("You can begin by typing:");
  console.log("");
  console.log(`     ${chalk.cyan("cd")} my-app`);
  console.log(`     ${chalk.cyan("yarn")} start`);
  console.log("");

  console.log("Or if you want to review the diff of lines:");
  console.log("");
  console.log(`     ${chalk.cyan("cd")} my-app`);
  console.log(`     ${chalk.cyan("git diff src/App.js")}`);
  console.log(`     ${chalk.cyan("git diff src/index.js")}`);
  console.log("");
  console.log("Happy coding!😊");
}

export { init };
