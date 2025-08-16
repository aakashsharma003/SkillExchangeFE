import { Input as IInput } from '../ui/input';

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  props,
}: any) {
  return (
    <div>
      <label className='block mb-1 text-sm font-medium'>{label}</label>
      <IInput
        value={value}
        onChange={({ target }) => onChange(target.value)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
