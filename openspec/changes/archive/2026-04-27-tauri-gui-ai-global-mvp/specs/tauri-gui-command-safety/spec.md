## ADDED Requirements

### Requirement: Command whitelist enforcement
The system MUST allow execution only for predefined actions mapped to ai-global subcommands.

#### Scenario: Allow MVP action
- **WHEN** the frontend requests one of [status, list, relink, clean, upgrade]
- **THEN** the backend permits execution

#### Scenario: Block out-of-scope action
- **WHEN** the frontend requests an action not in the current whitelist
- **THEN** the backend rejects the request with a scope error

### Requirement: Parameter validation for typed inputs
The system SHALL validate user-provided parameters before constructing command arguments.

#### Scenario: Accept valid tool key
- **WHEN** unlink action includes a supported tool key format
- **THEN** the backend passes validation and builds command arguments

#### Scenario: Reject invalid repository reference
- **WHEN** add-skill/add-rule/add-command receives an invalid repository identifier
- **THEN** the backend returns validation error and does not spawn process

### Requirement: High-risk action confirmation gate
The system MUST require explicit confirmation before executing high-risk actions.

#### Scenario: Confirm uninstall
- **WHEN** user triggers uninstall action from GUI
- **THEN** the UI requires second confirmation before backend invocation

#### Scenario: Cancel high-risk action
- **WHEN** user closes or declines confirmation dialog
- **THEN** the backend does not execute any command
