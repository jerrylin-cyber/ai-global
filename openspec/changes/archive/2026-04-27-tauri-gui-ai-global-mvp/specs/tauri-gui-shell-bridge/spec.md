## ADDED Requirements

### Requirement: Action-based command execution
The system SHALL execute ai-global commands through a typed action model instead of accepting arbitrary shell strings.

#### Scenario: Execute status action
- **WHEN** the frontend sends action type "status"
- **THEN** the backend executes ai-global with argument list ["status"]

#### Scenario: Reject unknown action
- **WHEN** the frontend sends an unsupported action type
- **THEN** the backend returns a validation error and does not execute any process

### Requirement: Controlled command path resolution
The system MUST resolve ai-global executable path using a deterministic fallback order.

#### Scenario: Use primary executable path
- **WHEN** ~/.local/bin/ai-global exists and is executable
- **THEN** the backend uses ~/.local/bin/ai-global as the process target

#### Scenario: Fallback to secondary executable path
- **WHEN** ~/.local/bin/ai-global is unavailable
- **THEN** the backend attempts ~/.ai-global/ai-global before returning failure

### Requirement: Output delivery to UI
The system SHALL deliver command results to the GUI with stdout, stderr, and exit metadata.

#### Scenario: Return short task output
- **WHEN** a short task is executed via execute mode
- **THEN** the response includes stdout, stderr, and exit code in a single payload

#### Scenario: Stream long task output
- **WHEN** a long task is executed via spawn mode
- **THEN** the system emits stdout and stderr chunks to the UI log panel until process close
