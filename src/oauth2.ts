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

export const OAuth2: Record<string, OAuth2Option> = {
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

export function doHttpGet(): void {

}

export function doHttpPost(): void {

}
