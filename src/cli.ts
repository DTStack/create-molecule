import prompts from "prompts";
import path from "path";
import fs from "fs";
import mustache from "mustache";
import ora from "ora";
import chalk from "chalk";

(async () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
  );
  console.log(
    chalk.blueBright("[INFO]: "),
    chalk.yellowBright(pkg.name, `v${pkg.version}`)
  );

  const { applicationName, template } = await prompts([
    {
      type: "text",
      name: "applicationName",
      message: "What's the name of application?",
      initial: "myapp",
    },
    {
      type: "select",
      name: "template",
      message: "Select a template for your application",
      choices: [
        {
          title: "Vite",
          value: "vite",
        },
        {
          title: "create-react-app",
          value: "cra",
        },
      ],
      initial: 0,
    },
  ]);

  const root = path.resolve(process.cwd());

  const spinner = ora("Loading Making Directory").start();

  const targetPath = path.join(root, applicationName);

  if (fs.existsSync(targetPath)) {
    spinner.fail(
      chalk.redBright(
        `${targetPath} already exist, please remove it or rename your application name`
      )
    );
    return;
  }

  fs.mkdirSync(targetPath, { recursive: true });

  const templatePath = path.join(
    __dirname,
    "..",
    "dist",
    "templates",
    `template-${template}`
  );
  const staffs = fs.readdirSync(templatePath);

  staffs.forEach((staff) => {
    if (staff.includes(".")) {
      const file = staff;
      if (staff.endsWith(".tpl")) {
        const output = mustache.render(
          fs.readFileSync(path.join(templatePath, file), "utf-8"),
          { applicationName }
        );
        spinner.text = `Loading Coping ${file.slice(0, file.lastIndexOf("."))}`;
        fs.writeFileSync(
          path.join(
            root,
            applicationName,
            file.slice(0, file.lastIndexOf("."))
          ),
          output
        );
      } else {
        spinner.text = `Loading Coping ${file}`;
        fs.copyFileSync(
          path.join(templatePath, file),
          path.join(root, applicationName, file)
        );
      }
    } else {
      const folder = staff;
      const src = fs.readdirSync(path.join(templatePath, folder));

      fs.mkdirSync(path.join(root, applicationName, folder), {
        recursive: true,
      });

      src.forEach((file) => {
        spinner.text = `Loading Coping ${file}`;
        fs.copyFileSync(
          path.join(templatePath, folder, file),
          path.join(root, applicationName, folder, file)
        );
      });
    }
  });

  spinner.succeed(
    `Downloading application successfully at ${path.join(
      root,
      applicationName
    )}`
  );
})();
