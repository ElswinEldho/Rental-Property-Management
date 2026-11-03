'use client';

import { TextInput } from './TextInput';

/**
 * Number input with optional min/max/step.
 * @param {{ min?: number, max?: number, step?: number } & any} props
 */
export function NumberInput({ min, max, step = 1, ...props }) {
  return <TextInput type="number" min={min} max={max} step={step} {...props} />;
}

export default NumberInput;

