## ADDED Requirements

### Requirement: Split stdout and stderr presentation
The GUI SHALL display stdout and stderr as separate output channels.

#### Scenario: Append stdout log line
- **WHEN** backend emits stdout data
- **THEN** output panel appends the data in normal log style

#### Scenario: Append stderr log line
- **WHEN** backend emits stderr data
- **THEN** output panel appends the data in error log style

### Requirement: Process lifecycle visibility
The system MUST publish process start, close, and error events to the UI.

#### Scenario: Process start event
- **WHEN** backend successfully spawns a command
- **THEN** UI receives process start event with command context

#### Scenario: Process close event
- **WHEN** command exits
- **THEN** UI receives close event containing exit code and signal

#### Scenario: Process error event
- **WHEN** command spawning fails
- **THEN** UI receives error event with readable message

### Requirement: Retry execution support
The GUI SHALL allow users to rerun the most recent action after failure.

#### Scenario: Retry after failure
- **WHEN** previous command result is failure
- **THEN** user can trigger a retry action using same validated action payload
