
export function startsWith(subject, prefix){
  return subject.indexOf(prefix, 0) !== -1;
}

export function endsWith(subject, suffix){
  return subject.indexOf(suffix, subject.length - suffix.length) !== -1;
}