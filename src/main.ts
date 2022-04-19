import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, WordpressPluginSettings, WordpressSettingTab } from './settings';
import { addIcons } from './icons';
import { WordPressPostParams } from './wp-client';
import { getWordPressClient } from './wp-clients';
import { OAuth2Client } from './oauth2';

export default class WordpressPlugin extends Plugin {

	settings: WordpressPluginSettings;

	async onload() {
    console.log('loading obsidian-wordpress plugin');

		await this.loadSettings();

    addIcons();

    this.updateRibbonIcon();

    this.addCommand({
      id: 'defaultPublish',
      name: 'Publish current document with default options',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const params: WordPressPostParams = {
          status: this.settings.defaultPostStatus
        };
        this.publishPost(params);
      }
    });

    this.addCommand({
      id: 'publish',
      name: 'Publish current document',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        this.publishPost();
      }
    });

    const settingTab = new WordpressSettingTab(this.app, this);
		this.addSettingTab(settingTab);

    this.registerObsidianProtocolHandler('wordpress-plugin', async (e) => {
      if (e.action === 'wordpress-plugin') {
        if (e.state) {
          if (e.error) {
            new Notice(`WordPress authorize failed!\n${e.error}: ${e.error_description.replace(/\+/g,' ')}`);
          } else if (e.code) {
            //   this.settings.oauth2Code = ;
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
            const oauth2 = new OAuth2Client(this);
            const resp = await oauth2.requestToken(e.code);
            console.log(resp);

            // if (oauth) {
            //   const s = JSON.stringify({
            //     ...oauth.requestToken.params,
            //     code: e.code
            //   });
            //   console.log(s);
            //
            //   // const tokenResponse = JSON.parse(resp);
            //   // console.log(tokenResponse);
            //   // if (tokenResponse.error) {
            //   //   new Notice(`WordPress authorize failed.\nError: ${tokenResponse.error}\n${tokenResponse.error_description}`);
            //   // }
            //   console.log(resp);
            //
            //   // call display() to show logout button
            //   settingTab.display();
            // }
          }
        }
      }
    });
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

  updateRibbonIcon(): void {
    const ribbonIconTitle = 'WordPress Publish';
    if (this.settings.showRibbonIcon) {
      this.addRibbonIcon('wp-logo', ribbonIconTitle, () => {
        this.publishPost();
      });
    } else {
      const leftRibbon: any = this.app.workspace.leftRibbon; // eslint-disable-line
      const children = leftRibbon.ribbonActionsEl.children;
      for (let i = 0; i < children.length; i++) {
        if (children.item(i).getAttribute('aria-label') === ribbonIconTitle) {
          (children.item(i) as HTMLElement).style.display = 'none';
        }
      }
    }
  }

  private publishPost(defaultPostParams?: WordPressPostParams): void {
    const client = getWordPressClient(this.app, this);
    if (client) {
      client.newPost(defaultPostParams).then();
    }
  }

}
