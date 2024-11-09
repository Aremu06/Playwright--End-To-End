# Local development

Basic setup:
```sh
make init
```

List all commands
```sh
make help
```


## Basic commands

Install npm dependencies:
```sh
make install
```

Jump into the docker container:
```sh
make sh
```

Exit the container:
```
exit
```


## Code Styling

Check everything:
```
make checks
```

Auto fix everything:
```
make fix
```


## Testing

Execute all tests:
```
make test
```

Execute all tests in folder or list individual ones:

Html reporter:
```
make test-specific-html NAME=tests/your-folder/your-test.spec.ts
```

List reporter:
```
make test-specific NAME=tests/your-folder/your-test.spec.ts
```

Run Tests with ui window:
```
make ui
```
