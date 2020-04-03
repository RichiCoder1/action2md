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
		  $ action2md action.yaml
		  |------|-------|------|
		  | test |       | test |
		  |------|-------|------|
`, {
    flags: {
        output: {
            type: 'string',
            alias: 'o'
        }
    }
});

async function main() {
	if (cli.input.length === 0) {
		cli.showHelp();
		return;
	}

	const fileInfo = await fs.stat(cli.input[0]);
	if (!fileInfo.isFile()) {
		throw Error('You must provide a valid file as input.');
	}
	const fileContents = await fs.readFile(cli.input[0]);
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

