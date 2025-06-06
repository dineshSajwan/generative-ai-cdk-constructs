[**@cdklabs/generative-ai-cdk-constructs**](../../../../README.md)

***

[@cdklabs/generative-ai-cdk-constructs](../../../../README.md) / [bedrock](../README.md) / AgentProps

# Interface: AgentProps

Properties for creating a CDK managed Bedrock Agent.

## Properties

### actionGroups?

> `readonly` `optional` **actionGroups**: [`AgentActionGroup`](../classes/AgentActionGroup.md)[]

The Action Groups associated with the agent.

***

### agentCollaboration?

> `readonly` `optional` **agentCollaboration**: [`AgentCollaboratorType`](../enumerations/AgentCollaboratorType.md)

The collaboration type for the agent.

#### Default

```ts
- No collaboration (AgentCollaboratorType.DISABLED).
```

***

### agentCollaborators?

> `readonly` `optional` **agentCollaborators**: [`AgentCollaborator`](../classes/AgentCollaborator.md)[]

Collaborators that this agent will work with.

#### Default

```ts
- No collaborators.
```

***

### codeInterpreterEnabled?

> `readonly` `optional` **codeInterpreterEnabled**: `boolean`

Select whether the agent can generate, run, and troubleshoot code when trying to complete a task

#### Default

```ts
- false
```

***

### customOrchestration?

> `readonly` `optional` **customOrchestration**: [`CustomOrchestration`](CustomOrchestration.md)

Details of custom orchestration for the agent.

#### Default

```ts
- Standard orchestration.
```

***

### description?

> `readonly` `optional` **description**: `string`

A description of the agent.

#### Default

```ts
- No description is provided.
```

***

### existingRole?

> `readonly` `optional` **existingRole**: `IRole`

The existing IAM Role for the agent to use.
Ensure the role has a trust policy that allows the Bedrock service to assume the role.

#### Default

```ts
- A new role is created for you.
```

***

### forceDelete?

> `readonly` `optional` **forceDelete**: `boolean`

Whether to delete the resource even if it's in use.

#### Default

```ts
- true
```

***

### foundationModel

> `readonly` **foundationModel**: [`IInvokable`](IInvokable.md)

The foundation model used for orchestration by the agent.

***

### guardrail?

> `readonly` `optional` **guardrail**: [`IGuardrail`](IGuardrail.md)

The guardrail that will be associated with the agent.

***

### idleSessionTTL?

> `readonly` `optional` **idleSessionTTL**: `Duration`

How long sessions should be kept open for the agent. If no conversation occurs
during this time, the session expires and Amazon Bedrock deletes any data
provided before the timeout.

#### Default

```ts
- 1 hour
```

***

### instruction

> `readonly` **instruction**: `string`

The instruction used by the agent. This determines how the agent will perform his task.
This instruction must have a minimum of 40 characters.

***

### kmsKey?

> `readonly` `optional` **kmsKey**: `IKey`

The KMS key of the agent if custom encryption is configured.

#### Default

```ts
- An AWS managed key is used.
```

***

### knowledgeBases?

> `readonly` `optional` **knowledgeBases**: [`IKnowledgeBase`](IKnowledgeBase.md)[]

The KnowledgeBases associated with the agent.

***

### memory?

> `readonly` `optional` **memory**: [`Memory`](../classes/Memory.md)

The type and configuration of the memory to maintain context across multiple sessions and recall past interactions.
This can be useful for maintaining continuity in multi-turn conversations and recalling user preferences
or past interactions.

#### See

https://docs.aws.amazon.com/bedrock/latest/userguide/agents-memory.html

#### Default

```ts
- No memory will be used. Agents will retain context from the current session only.
```

***

### name?

> `readonly` `optional` **name**: `string`

The name of the agent.

#### Default

```ts
- A name is generated by CDK.
```

***

### orchestrationType?

> `readonly` `optional` **orchestrationType**: [`OrchestrationType`](../enumerations/OrchestrationType.md)

The type of orchestration to use for the agent.

#### Default

```ts
- STANDARD
```

***

### promptOverrideConfiguration?

> `readonly` `optional` **promptOverrideConfiguration**: [`PromptOverrideConfiguration`](../classes/PromptOverrideConfiguration.md)

Overrides some prompt templates in different parts of an agent sequence configuration.

#### Default

```ts
- No overrides are provided.
```

***

### shouldPrepareAgent?

> `readonly` `optional` **shouldPrepareAgent**: `boolean`

Specifies whether to automatically update the `DRAFT` version of the agent after
making changes to the agent. The `DRAFT` version can be continually iterated
upon during internal development.

#### Default

```ts
- false
```

***

### userInputEnabled?

> `readonly` `optional` **userInputEnabled**: `boolean`

Select whether the agent can prompt additional information from the user when it does not have
enough information to respond to an utterance

#### Default

```ts
- false
```
