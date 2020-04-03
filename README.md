# action2md

Takes an `action.yaml` document and prints out a reference table for it's inputs:

```bash
action2md action.yaml
```

Outputs something like:

```markdown
| Input               | Description         | Default | Required |
| ------------------- | ------------------- | ------- | -------- |
| `file`              | Some important file |         | ✔        |
| `optionA`           | A                   |         |          |
| `optionWithDefault` | B                   | `foo`   |          |
```

## Reference

```text
$ action2md action.yaml
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
        | `file`              | Some important file |         | ✔        |
        | `optionA`           | A                   |         |          |
        | `optionWithDefault` | B                   | `foo`   |          |
```
