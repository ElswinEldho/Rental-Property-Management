'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextInput } from './TextInput';
import { IconButton } from '@/components/ui/buttons/IconButton';

/**
 * Password input with show/hide toggle.
 */
export function PasswordInput(props) {
  const [show, setShow] = useState(false);

  return (
    <TextInput
      {...props}
      type={show ? 'text' : 'password'}
      rightIcon={
        <IconButton
          aria-label={show ? 'Hide password' : 'Show password'}
          size="sm"
          onClick={() => setShow((s) => !s)}
          className="text-slate-500"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </IconButton>
      }
    />
  );
}

export default PasswordInput;

