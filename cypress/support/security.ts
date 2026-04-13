export const securityPayloads = {
  sqlInjection: "' OR '1'='1",
  xss: "<script>alert('buger')</script>",
  invalidEmail: "attacker@@buger-eats.test"
};
