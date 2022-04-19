import WordpressPlugin from './main';
import { ApiType } from './settings';
import { requestUrl } from 'obsidian';
import formUrlEncoded from 'form-urlencoded';

const appUrl = 'obsidian://wordpress-plugin';
const encodedAppUrl = encodeURIComponent(appUrl);


interface OAuth2URLData {
  url: string;
  method: 'get' | 'post';
  type?: 'json' | 'form';
  params: Record<string, string>;
}

interface OAuth2Option {
  authorize: OAuth2URLData;
  requestToken: OAuth2URLData;
}

const OAuth2Record: Record<string, OAuth2Option> = {
  JetPack: {
    authorize: {
      url: 'https://public-api.wordpress.com/oauth2/authorize',
      method: 'get',
      params: {
        client_id: '79085',
        redirect_uri: encodedAppUrl,
        response_type: 'code',
        scope: 'posts%20taxonomy%20media'
      }
    },
    requestToken: {
      url: 'https://public-api.wordpress.com/oauth2/token',
      method: 'post',
      type: 'form',
      params: {
        client_id: '79085',
        redirect_uri: encodedAppUrl,
        client_secret: 'zg4mKy9O1mc1mmynShJTVxs8r1k3X4e3g1sv5URlkpZqlWdUdAA7C2SSBOo02P7X',
        code: '',
        grant_type: 'authorization_code'
      }
    }
  }
};

export class OAuth2Client {

  constructor(
    private readonly plugin: WordpressPlugin
  ) { }

  /**
   * Opens the default browser to authorize by OAuth2 server.
   */
  authorize(): void {
    if (this.plugin.settings.apiType === ApiType.Jetpack) {
      const auth = OAuth2Record.JetPack.authorize;
      if (auth.method === 'get') {
        this.doHttpGet(auth.url, auth.params);
      }
    }
  }

  requestToken(code: string): Promise<object | null> {
    let oauth2;
    if (this.plugin.settings.apiType === ApiType.Jetpack) {
      oauth2 = OAuth2Record.JetPack;
    }
    if (oauth2) {
      const queryParams = {
        ...oauth2.requestToken.params,
        code: code
      };
      const d = oauth2.requestToken.type === 'json' ? JSON.stringify(queryParams) : formUrlEncoded(queryParams);
      console.log(d);
      return requestUrl({
        url: oauth2.requestToken.url,
        method: 'POST',
        headers: {
          'Content-Type': oauth2.requestToken.type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
          'User-Agent': 'obsidian.md'
        },
        body: oauth2.requestToken.type === 'json' ? JSON.stringify(queryParams) : formUrlEncoded(queryParams)
      });
    } else {
      return null;
    }
  }

  private doHttpGet(url: string, queryParams: Record<string, string>): void {
    const params = [];
    for (const [ key, value ] of Object.entries(queryParams)) {
      params.push(`${key}=${value}`);
    }
    window.open(`${url}?${params.join('&')}`);
  }

  private doHttpPost(): void {

  }

}
