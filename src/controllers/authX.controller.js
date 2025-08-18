const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/User');

const b64url = (buf) => buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

exports.start = (req, res) => {
  req.session.afterX = req.query.redirect || '/settings';

  const codeVerifier = b64url(crypto.randomBytes(32));
  const codeChallenge = b64url(crypto.createHash('sha256').update(codeVerifier).digest());
  const state = b64url(crypto.randomBytes(24));

  req.session.xPkce = { codeVerifier, state, createdAt: Date.now() };

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID,
    redirect_uri: process.env.X_REDIRECT_URI,
    scope: process.env.X_SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
};

exports.callback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const pkce = req.session.xPkce;

    if (!pkce || pkce.state !== state) {
      return res.status(400).send('Invalid state');
    }
    if (!req.session?.user?._id) {
      return res.status(401).send('Not authenticated');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.X_CLIENT_ID,
      redirect_uri: process.env.X_REDIRECT_URI,
      code,
      code_verifier: pkce.codeVerifier
    });

    const authHeader = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    const data = tokenRes.data;

    await User.findByIdAndUpdate(req.session.user._id, {
      $set: {
        xAuth: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || null,
          scope: data.scope || null,
          tokenType: data.token_type || 'Bearer',
          expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null,
          connectedAt: new Date()
        }
      }
    });

    const back = req.session.afterX || '/settings';
    delete req.session.xPkce;
    delete req.session.afterX;

    return res.redirect(back);
  } catch (err) {
    console.error('X OAuth callback error:', err.response?.data || err.message);
    return res.status(500).send('X auth failed');
  }
};

