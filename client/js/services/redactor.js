// MODULE: SecretRedactor. Pure code shared by the browser and the backend.
// SECURITY: Both sides redact independently; no raw-to-redacted mapping is retained.
export class SecretRedactor {
  static redact(text) {
    let value=String(text??'');
    const replacements=[
      [/(\b(?:authorization|proxy-authorization)\s*:\s*)[^\r\n]+/gi,'$1[REDACTED]'],
      [/(\b(?:cookie|set-cookie)\s*:\s*)[^\r\n]+/gi,'$1[REDACTED]'],
      [/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi,'Bearer [REDACTED]'],
      [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,'[REDACTED_JWT]'],
      [/(\b(?:api[_-]?key|x-api-key|password|passwd|access[_-]?token|refresh[_-]?token|secret|session(?:[_-]?(?:id|token))?|csrf[_-]?token|xsrf[_-]?token|x-csrf-token|x-xsrf-token)\b["']?\s*[:=]\s*["']?)[^\s"'&,;\r\n}]+/gi,'$1[REDACTED]'],
      [/\b(?:sk-[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{16,})\b/g,'[REDACTED_KEY]'],
      [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[REDACTED_EMAIL]']
    ];
    for(const [pattern,replacement] of replacements)value=value.replace(pattern,replacement);
    return value;
  }
  static context(value) {
    const sensitiveKey=/^(?:authorization|cookie|set-cookie|api[_-]?key|x-api-key|password|passwd|access[_-]?token|refresh[_-]?token|secret|session[_-]?(?:id|token)|csrf[_-]?token|xsrf[_-]?token)$/i;
    // DATA CONTRACT: authorization is also a structured permission record; redact scalar header values only.
    const walk=(item,key='')=>sensitiveKey.test(key)&&['string','number'].includes(typeof item)?'[REDACTED]':typeof item==='string'?this.redact(item):Array.isArray(item)?item.map(v=>walk(v)):item&&typeof item==='object'?Object.fromEntries(Object.entries(item).map(([k,v])=>[k,walk(v,k)])):item;
    return walk(value);
  }
}
