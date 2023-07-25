export function randomNumberId(): number {
  return new Date().getMilliseconds();
}

export function randomNumberIdNeg(): number {
  return randomNumberId() * -1;
}
