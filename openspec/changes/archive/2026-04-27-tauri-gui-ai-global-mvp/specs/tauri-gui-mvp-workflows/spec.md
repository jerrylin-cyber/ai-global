## ADDED Requirements

### Requirement: MVP command action panel
The GUI SHALL provide direct actions for status, list, relink, clean, and upgrade.

#### Scenario: Render MVP actions
- **WHEN** dashboard page loads
- **THEN** the UI displays five MVP action buttons

#### Scenario: Trigger command from action button
- **WHEN** user clicks an MVP action button
- **THEN** the frontend invokes backend command with the mapped action type

### Requirement: Tool status visibility
The GUI MUST show command execution state and latest result for each run.

#### Scenario: Display running state
- **WHEN** command execution starts
- **THEN** the selected action shows a running indicator and prevents duplicate trigger

#### Scenario: Display completion state
- **WHEN** command execution ends
- **THEN** the UI shows success or failure state with timestamp

### Requirement: Scoped first-phase operation coverage
The MVP MUST exclude add-skill/add-rule/add-command and unlink all workflows from first release screens.

#### Scenario: Hide second-phase actions
- **WHEN** user uses MVP version
- **THEN** UI does not expose second-phase workflow controls
