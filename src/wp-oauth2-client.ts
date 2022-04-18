import { App } from 'obsidian';
import WordpressPlugin from './main';
import { AbstractWordPressClient } from './abstract-wp-client';
import { WordPressClientResult, WordPressClientReturnCode, WordPressPostParams } from './wp-client';


const redirectUrl = encodeURIComponent('obsidian://wordpress-plugin');

const OAuth2 = {
  JetPack: {
    authorize: {
      url: 'https://public-api.wordpress.com/oauth2/authorize',
      params: {
        client_id: 79085,
        redirect_uri: redirectUrl,
        response_type: 'code',
        scope: 'posts%20taxonomy%20media'
      }
    },
    requestToken: {
      url: 'https://public-api.wordpress.com/oauth2/token',
      params: {
        client_id: 79085,
        redirect_uri: redirectUrl,
        client_secret: 'zg4mKy9O1mc1mmynShJTVxs8r1k3X4e3g1sv5URlkpZqlWdUdAA7C2SSBOo02P7X',
        code: '',
        grant_type: 'authorization_code'
      }
    }
  }
};

interface OAuth2Options {
  url: URL;
}

export class WpOAuth2Client extends AbstractWordPressClient {

  private readonly options: OAuth2Options;

  constructor(
    readonly app: App,
    readonly plugin: WordpressPlugin,
    // private readonly context: WpRestClientContext
  ) {
    super(app, plugin);
    this.options = {
      url: new URL(plugin.settings.endpoint)
    };
  }

  publish(title: string, content: string, postParams: WordPressPostParams, wp: {
    userName: string,
    password: string
  }): Promise<WordPressClientResult> {
  //   return this.httpPost(
  //     'wp-json/wp/v2/posts',
  //     {
  //       title,
  //       content,
  //       status: postParams.status
  //     },
  //     {
  //       headers: this.context.getHeaders(wp)
  //     });
    return Promise.resolve({
      code: WordPressClientReturnCode.Error,
      data: 'not implement'
    });
  }

  protected authorize(): void {
    const auth = OAuth2.JetPack.authorize;
    const params = [];
    for (const [ key, value ] of Object.entries(auth.params)) {
      params.push(`${key}=${value}`);
    }
    window.open(`${auth.url}?${params.join('&')}`);
  }

  protected requestToken(): void {
    //   this.settings.oauth2Code = e.code;
    //   $curl = curl_init( 'https://public-api.wordpress.com/oauth2/token' );
    //   curl_setopt( $curl, CURLOPT_POST, true );
    //   curl_setopt( $curl, CURLOPT_POSTFIELDS, array(
    //     'client_id' => your_client_id,
    //     'redirect_uri' => your_redirect_url,
    //     'client_secret' => your_client_secret_key,
    //     'code' => $_GET['code'], // The code from the previous request
    //     'grant_type' => 'authorization_code'
    // ) );
    //   curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1);
    //   $auth = curl_exec( $curl );
    //   $secret = json_decode($auth);
    //   $access_key = $secret->access_token;
  }

  // protected httpPost(
  //   path: string,
  //   body: unknown,
  //   options?: {
  //     headers: Record<string, string>
  //   }): Promise<WordPressClientResult> {
  //   const opts = {
  //     headers: {},
  //     ...options
  //   }
  //   console.log('REST POST', `${this.options.url.toString()}${path}`, opts);
  //   return request({
  //     url: `${this.options.url.toString()}${path}`,
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'User-Agent': 'obsidian.md',
  //       ...opts.headers
  //     },
  //     body: JSON.stringify(body)
  //   })
  //     .then(response => {
  //       console.log('WpRestClient.post response', response);
  //       try {
  //         const resp = JSON.parse(response);
  //         if (resp.code && resp.message) {
  //           return {
  //             code: WordPressClientReturnCode.Error,
  //             data: {
  //               code: resp.code,
  //               message: resp.message
  //             }
  //           };
  //         } else if (resp.id) {
  //           return {
  //             code: WordPressClientReturnCode.OK,
  //             data: resp
  //           };
  //         }
  //       } catch (e) {
  //         console.log('WpRestClient.post', e);
  //         return {
  //           code: WordPressClientReturnCode.Error,
  //           data: {
  //             code: 500,
  //             message: 'Cannot parse WordPress REST API response.'
  //           }
  //         };
  //       }
  //     });
  // }

}
