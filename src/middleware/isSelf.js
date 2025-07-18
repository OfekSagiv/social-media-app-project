function isSelf(req, res, next) {
  const sessionUserId = req.session?.user?._id;
  const userId = req.params.id;

  if (!sessionUserId || String(sessionUserId) !== String(userId)) {
  return res.status(403).json({ error: 'Unauthorized' });
}
  next();
}

module.exports = { isSelf };
