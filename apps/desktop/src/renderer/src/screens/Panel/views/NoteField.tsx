import React, { useEffect, useRef } from 'react';

import { Hint, NoteInput } from '../Panel.styles';
import { TNoteFieldProps } from '../Panel.types';

function NoteField({ value, onChange, onKeyDown }: TNoteFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div>
      <NoteInput
        ref={inputRef}
        value={value}
        placeholder="Type a note, then press Return…"
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
      <Hint>Return saves · Esc cancels</Hint>
    </div>
  );
}

export default NoteField;
