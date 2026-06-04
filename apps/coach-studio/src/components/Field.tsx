import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  hint?: string;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };
type Props = InputProps | TextareaProps;

export function Field(props: Props) {
  const { label, hint } = props;
  let control: ReactNode;

  if (props.as === 'textarea') {
    const { as: _as, label: _label, hint: _hint, ...textareaProps } = props;
    control = <textarea {...textareaProps} />;
  } else {
    const { as: _as, label: _label, hint: _hint, ...inputProps } = props;
    control = <input {...inputProps} />;
  }

  return (
    <label className="field">
      <span>{label}</span>
      {control}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
