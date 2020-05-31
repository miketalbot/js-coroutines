let yieldCount = 0;
export function yielder() {
  if (yieldCount++ > 100) {
    yieldCount = 0;
    return true;
  }
  return false;
}
