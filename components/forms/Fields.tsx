import type { ReactNode } from "react";

const base = "w-full rounded-2xl border border-rule bg-showroom px-4 text-[16px] outline-none transition-colors placeholder:text-mute focus:border-tarmac";

export function Field({ label, name, type = "text", required, placeholder, hint, inputMode, autoComplete, defaultValue, value, onChange }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; hint?: string; inputMode?: "text" | "numeric" | "decimal"; autoComplete?: string;
  defaultValue?: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}{!required && <span className="font-normal text-mute"> (optional)</span>}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} inputMode={inputMode} autoComplete={autoComplete}
        {...(value !== undefined ? { value, onChange: (e: { target: { value: string } }) => onChange?.(e.target.value) } : { defaultValue })} className={`${base} h-[52px]`} />
      {hint && <span className="mt-1 block text-[12px] text-mute">{hint}</span>}
    </label>
  );
}

export function SelectField({ label, name, options, required, placeholder = "Choose one", value, onChange, children }: {
  label: string; name: string; options?: string[]; required?: boolean; placeholder?: string; value?: string; onChange?: (v: string) => void; children?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}{!required && <span className="font-normal text-mute"> (optional)</span>}</span>
      <select name={name} required={required} {...(value !== undefined ? { value, onChange: (e: { target: { value: string } }) => onChange?.(e.target.value) } : { defaultValue: "" })} className={`${base} h-[52px] appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='m1 1.5 5 5 5-5' fill='none' stroke='%23050505' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E\")" }}>
        <option value="">{placeholder}</option>
        {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        {children}
      </select>
    </label>
  );
}

export function TextArea({ label, name, placeholder, rows = 3 }: { label: string; name: string; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}<span className="font-normal text-mute"> (optional)</span></span>
      <textarea name={name} rows={rows} placeholder={placeholder} className={`${base} resize-none py-3`} />
    </label>
  );
}

export const FormShell = ({ children, onSubmit, submit }: { children: ReactNode; onSubmit: (form: HTMLFormElement) => void; submit: string }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(e.currentTarget); }} className="grid gap-4">
    {children}
    <button type="submit" className="btn btn-red mt-2 w-full sm:w-auto sm:justify-self-start">{submit}</button>
  </form>
);
