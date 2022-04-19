import { App } from 'obsidian';
import WordpressPlugin from './main';
import { AbstractWordPressClient } from './abstract-wp-client';
import { WordPressClientResult, WordPressClientReturnCode, WordPressPostParams } from './wp-client';


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
    // const auth = OAuth2.JetPack.authorize;
    // const params = [];
    // for (const [ key, value ] of Object.entries(auth.params)) {
    //   params.push(`${key}=${value}`);
    // }
    // window.open(`${auth.url}?${params.join('&')}`);
  }

  protected requestToken(): void {

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
