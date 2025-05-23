[**@cdklabs/generative-ai-cdk-constructs**](../../../../README.md)

***

[@cdklabs/generative-ai-cdk-constructs](../../../../README.md) / [bedrock](../README.md) / ContentFilter

# Interface: ContentFilter

Interface to declare a content filter.

## Properties

### inputAction?

> `readonly` `optional` **inputAction**: [`GuardrailAction`](../enumerations/GuardrailAction.md)

The action to take when content is detected in the input.

***

### inputEnabled?

> `readonly` `optional` **inputEnabled**: `boolean`

Whether the content filter is enabled for input.

***

### inputModalities?

> `readonly` `optional` **inputModalities**: [`ModalityType`](../enumerations/ModalityType.md)[]

The input modalities to apply the content filter to.

#### Default

```ts
undefined - Applies to text modality
```

***

### inputStrength

> `readonly` **inputStrength**: [`ContentFilterStrength`](../enumerations/ContentFilterStrength.md)

The strength of the content filter to apply to prompts / user input.

***

### outputAction?

> `readonly` `optional` **outputAction**: [`GuardrailAction`](../enumerations/GuardrailAction.md)

The action to take when content is detected in the output.

***

### outputEnabled?

> `readonly` `optional` **outputEnabled**: `boolean`

Whether the content filter is enabled for output.

***

### outputModalities?

> `readonly` `optional` **outputModalities**: [`ModalityType`](../enumerations/ModalityType.md)[]

The output modalities to apply the content filter to.

#### Default

```ts
undefined - Applies to text modality
```

***

### outputStrength

> `readonly` **outputStrength**: [`ContentFilterStrength`](../enumerations/ContentFilterStrength.md)

The strength of the content filter to apply to model responses.

***

### type

> `readonly` **type**: [`ContentFilterType`](../enumerations/ContentFilterType.md)

The type of harmful category that the content filter is applied to
