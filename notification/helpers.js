function prepareEmail(to, subject, body, from = "emil.taciyev4@gmail.com") {
  return {
    from,
    to: to,
    subject: subject,
    text: body,
  };
}

module.exports = {
  prepareEmail
}
