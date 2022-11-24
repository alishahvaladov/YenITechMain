function prepareEmail(to, subject, body, attachments, from = "emil.taciyev4@gmail.com") {
  return {
    from,
    to: to,
    subject: subject,
    [body.startsWith("<") ? "html" : "text"]: body,
    attachments
  };
}

module.exports = {
  prepareEmail
}
