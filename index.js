const YAML = require('yaml');
const meow = require('meow');
const mdTable = require('markdown-table');
const fs = require('fs').promises;

const cli = meow(`
		Usage
		  $ action2md [action.yaml]

		Options
		  --output, -o  Optionally, where to send output
		  --help        Show help
		  --version     Print package version

		Examples
		  $ action2md
		  | Input               | Description         | Default | Required |
			| ------------------- | ------------------- | ------- | -------- |
			| \`file\`              | Some important file |         | ✔        |
			| \`optionA\`           | A                   |         |          |
			| \`optionWithDefault\` | B                   | \`foo\`   |          |
`, {
    flags: {
        output: {
            type: 'string',
            alias: 'o'
        }
    }
});

async function main() {
	let targetYaml = cli.input[0];
	if (!targetYaml) {
		try {
			const fileInfo = await fs.stat('action.yaml');
			if (!fileInfo.isFile()) {
				cli.showHelp();
				return;
			}
			targetYaml = 'action.yaml';
		} catch (e) {
			cli.showHelp();
			return;
		}
	} else {
		const fileInfo = await fs.stat(targetYaml);
		if (!fileInfo.isFile()) {
			throw Error('You must provide a valid file as input.');
		}
	}
	const fileContents = await fs.readFile(targetYaml);
	const actionDescriptor = await YAML.parse(fileContents.toString());
	
	const inputs = Object
		.entries(actionDescriptor.inputs)
		.map(([key, descriptor]) => ([
			`\`${key}\``,
			descriptor.description,
			descriptor.default ? `\`${descriptor.default}\`` : '',
			descriptor.required === true ? '✔' : ''
		]));

	const table = [
		['Input', 'Description', 'Default', 'Required'],
		...inputs
	];

	const rendered = mdTable(table);
	if (cli.flags.output) {
		await fs.writeFile(cli.flags.output, rendered);
	} else {
		console.log(rendered);
	}
}

main().catch(console.error);

