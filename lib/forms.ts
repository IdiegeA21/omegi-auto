/** Turns named form fields into labelled detail lines, dropping anything left empty. */
export function collect(form: HTMLFormElement, spec: ReadonlyArray<readonly [name: string, label: string]>) {
  const fd = new FormData(form);
  return spec.map(([n, label]) => ({ label, value: String(fd.get(n) ?? "").trim() })).filter((d) => d.value);
}
