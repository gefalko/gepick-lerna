export function withSign(n: number) {
  if (n > 0) {
    return '+' + n
  }

  return n
}

export function getPatreonAuthRedirectUrl() {
  const rederictUrl = window.location.origin + '/patreonAuth'
  return rederictUrl
}
