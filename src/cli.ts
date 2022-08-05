import { execSync, fork } from "child_process";
import chalk from "chalk";
import rimraf from "rimraf";
import { program } from "commander";
import { join, resolve } from "path";

let projectName = "";
let isTypeScript = false;

function isUsingYarn() {
  return (process.env.npm_config_user_agent || "").indexOf("yarn") === 0;
}

function init() {
  program
    .command("create-molecule")
    .arguments("<project-directory>")
    .option("-t --typescript", "create an TypeScript Project")
    .action((name, options) => {
      projectName = name;
      isTypeScript = options?.typescript || false;
    })
    .parse(process.argv);

  const useYarn = isUsingYarn();

  const commandLine = useYarn
    ? "npx create-react-app"
    : "yarn create react-app";

  const projectPath = resolve(projectName);

  try {
    execSync(
      `${commandLine} ${projectName} ${
        isTypeScript ? "--template typescript" : ""
      }`,
      {
        stdio: "inherit",
      }
    );

    execSync(`${useYarn ? "yarn" : "npm"} add @dtinsight/molecule@latest`, {
      cwd: projectPath,
      stdio: "inherit",
    });

    const forked = fork(join(__dirname, "file.js"));
    forked.send({ cwd: projectPath, typescript: isTypeScript });

    console.log(
      `${chalk.greenBright(
        "Success"
      )}! Created ${projectName} at ${projectPath} by create-react-app`
    );
    console.log("We rewrote several files:");
    console.log("");
    console.log(
      ` * ${join(
        projectPath,
        "src",
        isTypeScript ? "App.tsx" : "App.js"
      )} ${chalk.cyan("and")}`
    );
    console.log(
      ` * ${join(projectPath, "src", isTypeScript ? "index.tsx" : "index.js")}.`
    );
    console.log("");

    console.log("You can begin by typing:");
    console.log("");
    console.log(`     ${chalk.cyan("cd")} ${projectName}`);
    console.log(`     ${chalk.cyan(useYarn ? "yarn" : "npm run")} start`);
    console.log("");

    console.log("Or if you want to review the diff of lines:");
    console.log("");
    console.log(`     ${chalk.cyan("cd")} ${projectName}`);
    console.log(
      `     ${chalk.cyan(
        `git diff src/${isTypeScript ? "App.tsx" : "App.js"}`
      )}`
    );
    console.log(
      `     ${chalk.cyan(
        `git diff src/${isTypeScript ? "index.tsx" : "index.js"}`
      )}`
    );
    console.log("");
    console.log("Happy coding!😊");
  } catch (err) {
    console.error(err);
    rimraf(projectPath, () => {
      process.exit(1);
    });
  }
}

process.on("SIGINT", function () {});

export { init };
