# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) documenting significant architectural decisions made during the development of the SDA Master Guid application.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Why ADRs?

- **Memory**: Document why decisions were made
- **Communication**: Share context with current and future team members
- **Learning**: Understand trade-offs and alternatives
- **Onboarding**: Help new team members understand the architecture
- **Review**: Enable retrospectives and improvements

## ADR Format

Each ADR follows this structure:

```markdown
# ADR-XXX: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

What is the issue we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

## Alternatives Considered

What other options did we consider?

## Related Decisions

Links to related ADRs

## References

External resources, documentation, or research
```

## Current ADRs

| ADR                                            | Title                                 | Status   | Date |
| ---------------------------------------------- | ------------------------------------- | -------- | ---- |
| [001](./001-use-feature-based-architecture.md) | Use Feature-Based Architecture        | Accepted | 2024 |
| [002](./002-expo-vs-react-native-cli.md)       | Use Expo for React Native Development | Accepted | 2024 |
| [003](./003-zod-for-validation.md)             | Use Zod for Schema Validation         | Accepted | 2024 |
| [004](./004-circuit-breaker-implementation.md) | Implement Circuit Breaker Pattern     | Accepted | 2024 |

## Creating New ADRs

### 1. Number Your ADR

Use the next available number (e.g., 005, 006, etc.)

### 2. Use the Template

```bash
cp docs/adr/TEMPLATE.md docs/adr/XXX-your-decision.md
```

### 3. Fill in the Sections

- **Status**: Start with "Proposed"
- **Context**: Explain the problem
- **Decision**: State what you decided
- **Consequences**: List positive and negative outcomes
- **Alternatives**: What else did you consider?

### 4. Get Review

- Share with the team
- Discuss trade-offs
- Update based on feedback

### 5. Accept or Reject

- Update status to "Accepted" or "Rejected"
- Implement the decision
- Reference the ADR in code comments

## ADR Lifecycle

```
Proposed → Accepted → Implemented
           ↓
         Rejected

Accepted → Deprecated → Superseded by ADR-XXX
```

## Key Principles

1. **Record decisions, not requirements**
   - Focus on "why" not "what"
2. **Keep ADRs immutable**
   - Don't edit old ADRs
   - Create new ADRs to supersede old ones

3. **ADRs are living documents**
   - Reference them in code
   - Update status as needed
   - Link related ADRs

4. **Make ADRs discoverable**
   - Update this README
   - Link from main README.md
   - Reference in code comments

## When to Create an ADR

Create an ADR when you make a decision that:

- Affects the architecture significantly
- Is difficult to reverse
- Has significant consequences
- Solves a recurring problem
- Sets a precedent for future decisions

### Examples of ADR-worthy decisions:

- ✅ Choosing a framework (React Native, Expo)
- ✅ Selecting a state management library
- ✅ Implementing a design pattern (Circuit Breaker, CQRS)
- ✅ Defining the project structure
- ✅ Choosing a validation library
- ✅ Database selection
- ✅ Authentication strategy

### Not ADR-worthy:

- ❌ Variable naming conventions (use style guide)
- ❌ Individual component implementations
- ❌ Bug fixes
- ❌ Small refactorings

## References

- [Joel Parker Henderson's ADR repo](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Michael Nygard's ADR article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ThoughtWorks ADR Tools](https://github.com/npryce/adr-tools)

## Questions?

If you have questions about ADRs:

1. Check existing ADRs for examples
2. Ask the team in Slack/Teams
3. Reference the ADR template

---

**Remember**: Good ADRs explain **why** a decision was made, not just **what** was decided.
