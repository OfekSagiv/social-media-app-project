const crypto = require('crypto');
const User = require('../models/User');

const b64url = (buf) => buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

const start = (req, res) => {
  req.session.afterX = req.query.redirect || '/x-auth';

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

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({ redirectUrl: authUrl });
  }

  res.redirect(authUrl);
};

const callback = async (req, res) => {
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

    const tokenRes = await fetch(
      'https://api.twitter.com/2/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: body.toString()
      }
    );

    if (!tokenRes.ok) {
      throw new Error(`HTTP error! status: ${tokenRes.status}`);
    }

    const data = await tokenRes.json();


    let xUserInfo = {};
    try {
      const userRes = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (userRes.ok) {
        const userProfile = await userRes.json();
        xUserInfo = {
          xUserId: userProfile.data?.id,
          xUsername: userProfile.data?.username
        };
      }
    } catch (userErr) {
      console.warn('Failed to fetch X user info:', userErr.message);
    }

    const updatedUser = await User.findByIdAndUpdate(req.session.user._id, {
      $set: {
        xAuth: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || null,
          scope: data.scope || null,
          tokenType: data.token_type || 'Bearer',
          expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null,
          connectedAt: new Date(),
          ...xUserInfo
        }
      }
    }, { new: true });

    req.session.user = updatedUser.toObject();

    const back = req.session.afterX || '/x-auth';
    delete req.session.xPkce;
    delete req.session.afterX;

    return res.redirect(back);
  } catch (err) {
    console.error('X OAuth callback error:', err.message);
    return res.status(500).send('X auth failed');
  }
};

const disconnect = async (req, res) => {
  try {
    if (!req.session?.user?._id) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      return res.status(401).send('Not authenticated');
    }

    const updatedUser = await User.findByIdAndUpdate(req.session.user._id, {
      $unset: {
        xAuth: 1
      }
    }, { new: true });

    req.session.user = updatedUser.toObject();

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ message: 'Successfully disconnected from X' });
    }

    const back = req.query.redirect || '/x-auth';
    res.redirect(back);
  } catch (err) {
    console.error('X disconnect error:', err.message);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'X disconnect failed' });
    }
    return res.status(500).send('X disconnect failed');
  }
};

module.exports = { start, callback, disconnect };
